# SyntaxSherlock Standalone Build

Bu klasör, SyntaxSherlock'u tek bir .exe dosyası olarak paketlemek için gerekli dosyaları içerir.

## 🔧 Gereksinimler

- Python 3.11+
- Node.js 18+
- PyInstaller (`pip install pyinstaller`)

## 🚀 Build İşlemi

### Otomatik Build (Önerilen)

```bash
cd standalone
python build.py
```

Bu script:
1. `scanner.py`'yi kopyalar
2. Frontend'i build eder (`npm run build`)
3. Static dosyaları hazırlar
4. PyInstaller ile `.exe` oluşturur

### Manuel Build

```bash
# 1. Frontend build
cd frontend
npm run build
cd ..

# 2. Static dosyaları kopyala
xcopy frontend\dist standalone\static\ /E /I /Y

# 3. Scanner'ı kopyala
copy backend\scanner.py standalone\

# 4. PyInstaller ile exe oluştur
cd standalone
pyinstaller --name "SyntaxSherlock" --onefile --add-data "static;static" --add-data "scanner.py;." app.py
```

## 📁 Çıktı

Build sonrası `standalone/dist/SyntaxSherlock.exe` oluşur.

## ⚠️ Önemli

**Model dosyasını exe ile aynı klasöre kopyalayın!**

```
SyntaxSherlock/
├── SyntaxSherlock.exe
└── syntax_sherlock_model.pkl  ← Bu dosya gerekli!
```

Model dosyasını oluşturmak için:
```bash
cd backend
python train.py
```

## 🎮 Kullanım

1. `SyntaxSherlock.exe`'yi çift tıklayın
2. Tarayıcı otomatik açılacak (http://localhost:8000)
3. Python dosyalarınızı analiz edin
4. Kapatmak için konsol penceresini kapatın veya Ctrl+C yapın

## 📦 Dağıtım

Kullanıcılara şunları verin:
- `SyntaxSherlock.exe`
- `syntax_sherlock_model.pkl`

İkisi aynı klasörde olmalı!

