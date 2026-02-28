def calculate(x, y):
    """Basit bir bölme işlemi yapar"""
    result = x / y  # Satır 3 - Backend %95 emin (critical - KIRMIZI)
    return result

# Bu satır ZeroDivisionError fırlatır
answer = calculate(10, 0)
print(answer)

def average(total, count):
    avg = total / count  # Satır 11 - Backend %60 emin (suspicious - SARI)
    return avg

# Şüpheli durum
result = average(100, 0)

