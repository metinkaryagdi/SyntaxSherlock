class DataProcessor:
    def __init__(self):
        self.raw_data = [1.2, 3.4, 5.6] 

    def indeks_erisim_testi(self, idx):
        val = self.raw_data[idx]
        return val

    def guvenli_dongu(self):
        for i in range(len(self.raw_data)):
            print(f"Veri: {self.raw_data[i]}")

    def tehlikeli_dongu(self):
        for i in range(10):
            print(self.raw_data[i])

    def sabit_indeks_hatasi(self):
        hatali_eleman = self.raw_data[5]
        return hatali_eleman

# İşlem başlatma
proc = DataProcessor()
proc.guvenli_dongu()
