import ast
import pandas as pd
import joblib
import os
import warnings

warnings.filterwarnings("ignore")

class CodeFeatureExtractor(ast.NodeVisitor):
    def __init__(self, filename):
        self.filename = filename
        self.rows = []

        self.inside_loop = 0
        self.inside_function = 0
        self.try_guard = 0

        self.zero_guards = set()
        self.len_guards = set()
        self.known_lists = {}
        self.loop_vars = set()
        self.function_params = set()


    def visit_For(self, node):
        self.inside_loop = 1
        if isinstance(node.target, ast.Name):
            self.loop_vars.add(node.target.id)
        self.generic_visit(node)
        if isinstance(node.target, ast.Name):
            self.loop_vars.discard(node.target.id)
        self.inside_loop = 0

    def visit_While(self, node):
        self.inside_loop = 1
        self.generic_visit(node)
        self.inside_loop = 0

    def visit_FunctionDef(self, node):
        self.inside_function = 1
        for arg in node.args.args:
            self.function_params.add(arg.arg)
        self.generic_visit(node)
        for arg in node.args.args:
            self.function_params.discard(arg.arg)
        self.inside_function = 0

    def visit_If(self, node):
        if isinstance(node.test, ast.Compare):
            left = node.test.left
            if (
                isinstance(left, ast.Name)
                and len(node.test.comparators) == 1
                and isinstance(node.test.comparators[0], ast.Constant)
                and node.test.comparators[0].value == 0
                and isinstance(node.test.ops[0], ast.NotEq)
            ):
                self.zero_guards.add(left.id)
            
            if (isinstance(node.test.ops[0], (ast.Lt, ast.LtE)) and
                isinstance(node.test.comparators[0], ast.Call) and
                isinstance(node.test.comparators[0].func, ast.Name) and
                node.test.comparators[0].func.id == 'len'):
                if isinstance(left, ast.Name):
                    self.len_guards.add(left.id)

        self.generic_visit(node)

        if isinstance(node.test, ast.Compare):
            if isinstance(node.test.left, ast.Name):
                self.zero_guards.discard(node.test.left.id)
                self.len_guards.discard(node.test.left.id)

    def visit_Try(self, node):
        self.try_guard = 1
        self.generic_visit(node)
        self.try_guard = 0


    def visit_Assign(self, node):
        if isinstance(node.value, ast.List):
            for t in node.targets:
                if isinstance(t, ast.Name):
                    self.known_lists[t.id] = len(node.value.elts)
        self.generic_visit(node)


    def visit_Subscript(self, node):
        # Index özellikleri
        index_is_const = 0
        index_is_name = 0
        index_is_loop_var = 0
        index_is_param = 0
        container_is_literal = 0
        idx_oob_literal = 0
        index_guarded = 0
        index_strong_guard = 0
        definite_error = False

        if isinstance(node.slice, ast.Constant):
            index_is_const = 1
        elif isinstance(node.slice, ast.Name):
            idx_name = node.slice.id
            if idx_name in self.loop_vars:
                index_is_loop_var = 1
            elif idx_name in self.function_params:
                index_is_param = 1
            else:
                index_is_name = 1
            
            if idx_name in self.len_guards:
                index_guarded = 1
                index_strong_guard = 1

        if isinstance(node.value, ast.Name) and node.value.id in self.known_lists:
            container_is_literal = 1
            size = self.known_lists[node.value.id]
            
            if isinstance(node.slice, ast.Constant):
                idx = node.slice.value
                if isinstance(idx, int) and (idx >= size or idx < -size):
                    idx_oob_literal = 1
                    definite_error = True

        self.rows.append(self._make_index_row(
            lineno=node.lineno,
            index_is_const=index_is_const,
            index_is_name=index_is_name,
            index_is_loop_var=index_is_loop_var,
            index_is_param=index_is_param,
            container_is_literal=container_is_literal,
            idx_oob_literal=idx_oob_literal,
            index_guarded=index_guarded,
            index_strong_guard=index_strong_guard,
            definite_error=definite_error
        ))

        self.generic_visit(node)


    def visit_BinOp(self, node):
        if isinstance(node.op, ast.Div):
            # Division özellikleri
            divisor_is_const_zero = 0
            divisor_is_const_nonzero = 0
            divisor_is_name = 0
            divisor_is_param = 0
            divisor_is_loop_var = 0
            divisor_guarded = 0
            definite_error = False
            safe = False

            if isinstance(node.right, ast.Constant):
                if node.right.value == 0:
                    divisor_is_const_zero = 1
                    definite_error = True
                else:
                    divisor_is_const_nonzero = 1
                    divisor_guarded = 1
                    safe = True
            elif isinstance(node.right, ast.Name):
                div_name = node.right.id
                if div_name in self.loop_vars:
                    divisor_is_loop_var = 1
                elif div_name in self.function_params:
                    divisor_is_param = 1
                else:
                    divisor_is_name = 1
                
                if div_name in self.zero_guards:
                    divisor_guarded = 1
                    safe = True

            self.rows.append(self._make_division_row(
                lineno=node.lineno,
                divisor_is_const_zero=divisor_is_const_zero,
                divisor_is_const_nonzero=divisor_is_const_nonzero,
                divisor_is_name=divisor_is_name,
                divisor_is_param=divisor_is_param,
                divisor_is_loop_var=divisor_is_loop_var,
                divisor_guarded=divisor_guarded,
                definite_error=definite_error,
                safe=safe
            ))

        self.generic_visit(node)


    def _make_division_row(
        self,
        lineno,
        divisor_is_const_zero,
        divisor_is_const_nonzero,
        divisor_is_name,
        divisor_is_param,
        divisor_is_loop_var,
        divisor_guarded,
        definite_error=False,
        safe=False
    ):
        return {
            "lineno": lineno,

            "is_division": 1,
            "is_index": 0,
            "inside_loop": self.inside_loop,
            "inside_function": self.inside_function,
            "try_guard": self.try_guard,
            
            "divisor_is_const_zero": divisor_is_const_zero,
            "divisor_is_const_nonzero": divisor_is_const_nonzero,
            "divisor_is_name": divisor_is_name,
            "divisor_is_param": divisor_is_param,
            "divisor_is_loop_var": divisor_is_loop_var,
            "divisor_guarded": divisor_guarded,
            
            "index_is_const": 0,
            "index_is_name": 0,
            "index_is_loop_var": 0,
            "index_is_param": 0,
            "container_is_literal": 0,
            "idx_oob_literal": 0,
            "index_guarded": 0,
            "index_strong_guard": 0,

            "__definite_error": definite_error,
            "__error_type": "ZeroDivisionError" if definite_error else None,
            "__safe": safe
        }

    def _make_index_row(
        self,
        lineno,
        index_is_const,
        index_is_name,
        index_is_loop_var,
        index_is_param,
        container_is_literal,
        idx_oob_literal,
        index_guarded,
        index_strong_guard,
        definite_error=False
    ):
        return {
            "lineno": lineno,

            "is_division": 0,
            "is_index": 1,
            "inside_loop": self.inside_loop,
            "inside_function": self.inside_function,
            "try_guard": self.try_guard,
            
            "divisor_is_const_zero": 0,
            "divisor_is_const_nonzero": 0,
            "divisor_is_name": 0,
            "divisor_is_param": 0,
            "divisor_is_loop_var": 0,
            "divisor_guarded": 0,
            
            "index_is_const": index_is_const,
            "index_is_name": index_is_name,
            "index_is_loop_var": index_is_loop_var,
            "index_is_param": index_is_param,
            "container_is_literal": container_is_literal,
            "idx_oob_literal": idx_oob_literal,
            "index_guarded": index_guarded,
            "index_strong_guard": index_strong_guard,

            "__definite_error": definite_error,
            "__error_type": "IndexError" if definite_error else None,
            "__safe": False
        }

def load_model(model_path: str):
    """Model dosyasını yükler"""
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found: {model_path}")
    return joblib.load(model_path)

def analyze_code(source_code: str, model):
    """
    Python kodunu analiz eder ve risk listesi döner.
    model: joblib.load() ile yüklenmiş model (dict veya direkt model objesi)
    """
    try:
        tree = ast.parse(source_code)
    except SyntaxError as e:
        return [{"error": str(e), "lineno": e.lineno or 0}]

    code_lines = source_code.split('\n')

    extractor = CodeFeatureExtractor("<memory>")
    extractor.visit(tree)

    if not extractor.rows:
        return []

    df = pd.DataFrame(extractor.rows)

    if isinstance(model, dict):
        actual_model = model.get("model", model)
        feature_cols = model.get("features", list(actual_model.feature_names_in_))
    else:
        actual_model = model
        feature_cols = list(model.feature_names_in_)
    
    X = df[feature_cols]
    probs = actual_model.predict_proba(X)[:, 1]

    results = []

    for i, prob in enumerate(probs):
        row = df.iloc[i]
        line = row["lineno"]

        risk = prob

        if row["__definite_error"]:
            risk = 1.0
        elif row["__safe"]:
            risk = 0.0

        if row["is_division"]:
            error_type = "Division"
        elif row["is_index"]:
            error_type = "Index"
        else:
            error_type = "Unknown"

        code_snippet = code_lines[line - 1].strip() if line <= len(code_lines) else ""

        message_parts = []
        if row["__definite_error"]:
            message_parts.append(f"KESİN ({row['__error_type']})")
        if row["try_guard"] == 0 and not row["__safe"]:
            message_parts.append("Korumasız")
        
        message = ", ".join(message_parts) if message_parts else ""

        results.append({
            "lineno": line,
            "risk_score": risk,
            "type": error_type,
            "code": code_snippet,
            "message": message,
            "definite_error": row["__definite_error"]
        })

    return results
