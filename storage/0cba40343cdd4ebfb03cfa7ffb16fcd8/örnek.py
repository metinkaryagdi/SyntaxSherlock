import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score # mean_absolute_error unutulmuş

# Veri seti oluştur (mantıksal hata: sütun isimleriyle karışıklık)
df = pd.DataFrame({
    "x1": [1, 2, 3, 4, 5],
    "x2": [10, 20, 30, 40, 50],
    "y": [2, 4, 6, 8, 10]
})

# 🔴 Mantıksal hata: y'yi yanlış sütundan alıyor (y yerine x1)
X = df[["x1", "x2"]]
y = df["x1"]  # HATA: Aslında df["y"] olmalıydı

model = LinearRegression()
model.fit(X, y)
y_pred = model.predict(X)

# 🔴 Mantıksal hata: yanlış metrik hesaplanıyor (y ile y_pred aynı değişken)
rmse = np.sqrt(mean_squared_error(y_pred, y_pred)) # her zaman 0 çıkar
r2 = r2_score(y, y_pred) + 0.5  # 🔴 Mantıksal hata: skor manipüle ediliyor

print(f"RMSE: {rmse:.4f}") # çok uzun satır olacak aşağıda
print(f"R2 score: {r2:.4f}")  


# 🔴 Runtime hata: 0’a bölme
try:
    val = 10 / 0
except:
    print("Bir hata oldu ama ne olduğunu belirtmedik")  # kötü hata yönetimi  

# 🔴 Mantıksal hata: yanlış sıralama
nums = [1, 2, 3, 4, 5]
nums.sort(reverse=False)
print("En büyük sayı:", nums[0])  # yanlış, en küçük yazdırıyor

# 🔴 Kod stili hatası: gereksiz boşluklar ve satır sonu boşlukları    
print("Bitti!")    

