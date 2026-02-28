import math

class MathService:
    """Gelişmiş matematiksel işlemler servisi."""
    
    def __init__(self, multiplier=1):
        self.multiplier = multiplier

    def riskli_bolme(self, x, y):
        return (x / y) * self.multiplier

    def guvenli_bolme(self, x, y):
        if y != 0:
            return x / y
        return 0.0

    def karma_islem(self, liste, payda):
        sonuclar = []
        try:
            for deger in liste:
                res = deger / payda
                sonuclar.append(res)
        except ZeroDivisionError:
            print("Sıfıra bölme engellendi.")
        return sonuclar

    def sabit_hata_testi(self):
        oran = 100 / 0
        return oran

servis = MathService(multiplier=2)
data = [10, 20, 30]
print(servis.guvenli_bolme(10, 5))
print(servis.riskli_bolme(10, 0))