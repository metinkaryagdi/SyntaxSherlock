import os
import json
import time
import signal
import sys
from datetime import datetime, timezone
import subprocess
import pika

# ---- Anında log çıktısı ----
sys.stdout.reconfigure(line_buffering=True)

# ---- ENV Config ----
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
RABBITMQ_PASS = os.getenv("RABBITMQ_PASS", "guest")
RABBITMQ_VHOST = os.getenv("RABBITMQ_VHOST", "/")

INPUT_EXCHANGE = os.getenv("INPUT_EXCHANGE", "code.events")
INPUT_ROUTING_KEY = os.getenv("INPUT_ROUTING_KEY", "code.submitted")
INPUT_QUEUE = os.getenv("INPUT_QUEUE", "linterworker.code.submitted")

OUTPUT_EXCHANGE = os.getenv("OUTPUT_EXCHANGE", "code.events")
OUTPUT_ROUTING_KEY = os.getenv("OUTPUT_ROUTING_KEY", "lint.completed")

PREFETCH_COUNT = int(os.getenv("PREFETCH_COUNT", "1"))
RETRY_DELAY_SEC = int(os.getenv("RETRY_DELAY_SEC", "5"))

# ---- Graceful shutdown ----
_should_stop = False
def _handle_sigterm(_signo, _frame):
    global _should_stop
    _should_stop = True
signal.signal(signal.SIGTERM, _handle_sigterm)
signal.signal(signal.SIGINT, _handle_sigterm)

# ---- SEVERITY MAPPING ----
def classify_severity(code: str) -> str:
    """Flake8 hata koduna göre severity seviyesi döner."""
    if not code:
        return "info"
    prefix = code[0].upper()
    if prefix in ("F", "E"):
        return "error"
    elif prefix == "W":
        return "warning"
    elif prefix == "C":
        return "convention"
    elif prefix == "N":
        return "naming"
    else:
        return "info"

# ---- Linting işlemi ----
def run_flake8(file_path: str):
    """
    Flake8'i JSON formatta çalıştırır ve tüm PEP8 hatalarını döndürür.
    Syntax (E999) olsa bile --exit-zero sayesinde analiz devam eder.
    """
    try:
        result = subprocess.run(
            ["flake8", "--exit-zero", "--format=json", file_path],
            capture_output=True,
            text=True
        )

        stdout = (result.stdout or "").strip()
        stderr = (result.stderr or "").strip()
        output = stdout if stdout else stderr

        if not output:
            print(f"ℹ️  No lint output for {file_path}, returning empty result.")
            return []

        try:
            parsed = json.loads(output)
        except json.JSONDecodeError as je:
            print(f"⚠️ JSON parse error for {file_path}: {je}\nRaw Output:\n{output}")
            return [{
                "file": os.path.basename(file_path),
                "code": "E999",
                "message": f"Invalid JSON output: {je}",
                "line": 0,
                "column": 0,
                "severity": "error"
            }]

        flattened = []
        for filename, issues in parsed.items():
            for issue in issues:
                code = issue.get("code", "E000")
                flattened.append({
                    "file": os.path.basename(filename),
                    "code": code,
                    "message": issue.get("text", "Unknown issue"),
                    "line": issue.get("line_number", 0),
                    "column": issue.get("column_number", 0),
                    "severity": classify_severity(code)
                })

        return flattened

    except FileNotFoundError:
        return [{
            "file": os.path.basename(file_path),
            "code": "E998",
            "message": "flake8 not found in container",
            "line": 0,
            "column": 0,
            "severity": "error"
        }]
    except Exception as e:
        return [{
            "file": os.path.basename(file_path),
            "code": "E999",
            "message": f"Exception during linting: {e}",
            "line": 0,
            "column": 0,
            "severity": "error"
        }]

# ---- Event inşası ----
def build_lint_completed_event(submission_id, language, file_path, results):
    if not results:
        results = [{
            "file": os.path.basename(file_path),
            "code": "W000",
            "message": "No issues detected",
            "line": 0,
            "column": 0,
            "severity": "info"
        }]

    # Count by severity
    error_count = sum(1 for r in results if r.get("severity") == "error")
    warning_count = sum(1 for r in results if r.get("severity") == "warning")
    info_count = sum(1 for r in results if r.get("severity") == "info")

    return {
        "submissionId": submission_id,
        "language": language,
        "errorCount": error_count,
        "warningCount": warning_count,
        "infoCount": info_count,
        "issueCount": len(results),
        "fileCount": 1,
        "results": results,
        "calculatedAt": datetime.now(timezone.utc).isoformat(),
        "source": "LinterWorker",
        "filePath": file_path
    }

# ---- Event yayınlama ----
def publish_event(channel, event: dict):
    channel.basic_publish(
        exchange=OUTPUT_EXCHANGE,
        routing_key=OUTPUT_ROUTING_KEY,
        body=json.dumps(event).encode("utf-8"),
        properties=pika.BasicProperties(
            content_type="application/json",
            delivery_mode=2
        )
    )
    print(f"✅ Published `{OUTPUT_ROUTING_KEY}` for {event.get('submissionId')} "
          f"({event.get('issueCount')} issues | Errors: {event.get('errorCount')} | "
          f"Warnings: {event.get('warningCount')} | Info: {event.get('infoCount')})")

# ---- Mesaj işleme ----
def process_message(ch, method, properties, body):
    try:
        msg = json.loads(body)
        print(f"📨 Received `{INPUT_ROUTING_KEY}`: {msg}")

        submission_id = msg.get("SubmissionId")
        file_path = msg.get("FilePath")
        language = msg.get("Language", "python")

        if not submission_id or not file_path:
            raise ValueError("SubmissionId veya FilePath eksik.")

        if not os.path.exists(file_path):
            results = [{
                "file": os.path.basename(file_path or ""),
                "code": "E404",
                "message": "File not found",
                "line": 0,
                "column": 0,
                "severity": "error"
            }]
        else:
            results = run_flake8(file_path)

        event = build_lint_completed_event(submission_id, language, file_path, results)
        publish_event(ch, event)
        ch.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as e:
        print(f"❌ Processing error: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

# ---- RabbitMQ bağlantısı ve dinleme ----
def connect_and_consume():
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    params = pika.ConnectionParameters(
        host=RABBITMQ_HOST,
        port=RABBITMQ_PORT,
        virtual_host=RABBITMQ_VHOST,
        credentials=credentials,
        heartbeat=30,
        blocked_connection_timeout=60
    )

    connection = pika.BlockingConnection(params)
    channel = connection.channel()

    channel.exchange_declare(exchange=INPUT_EXCHANGE, exchange_type="topic", durable=True)
    channel.exchange_declare(exchange=OUTPUT_EXCHANGE, exchange_type="topic", durable=True)
    channel.queue_declare(queue=INPUT_QUEUE, durable=True)
    channel.queue_bind(exchange=INPUT_EXCHANGE, queue=INPUT_QUEUE, routing_key=INPUT_ROUTING_KEY)

    channel.basic_qos(prefetch_count=PREFETCH_COUNT)
    channel.basic_consume(queue=INPUT_QUEUE, on_message_callback=process_message, auto_ack=False)

    print(f"🎧 Waiting messages on '{INPUT_QUEUE}' (bind: {INPUT_EXCHANGE}:{INPUT_ROUTING_KEY})")

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print("🛑 Interrupted by user.")
    finally:
        if channel.is_open:
            try:
                channel.close()
            except Exception:
                pass
        if connection.is_open:
            try:
                connection.close()
            except Exception:
                pass

# ---- Ana döngü ----
def main():
    print("🐍 LinterWorker starting…")
    while not _should_stop:
        try:
            connect_and_consume()
        except Exception as e:
            if _should_stop:
                break
            print(f"⚠️ LinterWorker disconnected/crashed: {e}. Retrying in {RETRY_DELAY_SEC}s…")
            time.sleep(RETRY_DELAY_SEC)
    print("🛑 LinterWorker stopped.")


if __name__ == "__main__":
    main()
