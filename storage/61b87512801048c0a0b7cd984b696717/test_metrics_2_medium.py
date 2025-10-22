import numpy as np

def average(values):
    if not values:
        return None  # mantıksal uyarı: boş listeye None döndürmek
    return sum(values) / len(values)

def variance(values):
    mean = average(values)
    return np.mean([(x - mean) ** 2 for x in values])

print(variance([]))  # ZeroDivisionError
