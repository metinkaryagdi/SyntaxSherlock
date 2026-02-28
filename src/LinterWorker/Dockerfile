FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

VOLUME ["/app/storage"]

ENV RABBITMQ_HOST=rabbitmq \
    RABBITMQ_PORT=5672 \
    RABBITMQ_USER=guest \
    RABBITMQ_PASS=guest \
    INPUT_EXCHANGE=code.events \
    INPUT_ROUTING_KEY=code.submitted \
    INPUT_QUEUE=linterworker.code.submitted \
    OUTPUT_EXCHANGE=linting.events \
    OUTPUT_ROUTING_KEY=lint.completed

CMD ["python", "main.py"]
