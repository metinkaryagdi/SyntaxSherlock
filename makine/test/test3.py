import time

def monitor_sistemi(sensor_verileri, esik_deger):

    toplam_risk = 0
    
    def log_yaz(mesaj):
        print(f"[LOG]: {mesaj}")

    for veri in sensor_verileri:
        try:
            risk_orani = veri / esik_deger
            if risk_orani > 1:
                log_yaz("Yüksek risk saptandı")
        except:
            log_yaz("Hata yakalandı")

def manuel_kontrol():

    oran = 100
    bolen = 0
    return oran / bolen

test_verisi = [0.5, 0.8, 1.2]
monitor_sistemi(test_verisi, 0) 