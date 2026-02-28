# SyntaxSherlock Frontend

Python Runtime Hata Analizi için modern ve kullanıcı dostu frontend uygulaması.

## 🚀 Özellikler

- ✅ Python dosyası yükleme (drag & drop veya file picker)
- ✅ Runtime hata analizi (ZeroDivisionError, IndexError)
- ✅ **Severity bazlı renklendirme:**
  - 🔴 **Kritik** (critical): %80+ emin olunan hatalar → Kırmızı
  - 🟡 **Şüpheli** (suspicious): %50-80 arası şüpheli durumlar → Sarı
- ✅ İki kolonlu interaktif tasarım (sol: hatalar, sağ: kod)
- ✅ Hatalara tıklayarak kod satırına otomatik scroll
- ✅ Kod satırlarında renkli hata vurgulama
- ✅ Modern, minimal ve responsive tasarım

## 🛠️ Teknolojiler

- React 19
- TypeScript
- Vite
- CSS3 (Modern animasyonlar)

## 📦 Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Environment değişkenlerini ayarlayın (opsiyonel):

Varsayılan backend URL: `http://localhost:8000`

Değiştirmek için proje kök dizininde `.env` dosyası oluşturun:
```env
VITE_API_URL=http://localhost:8000
```

## 🚀 Kullanım

### Development Server

```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

### Production Build

```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşacaktır.

### Preview Production Build

```bash
npm run preview
```

## 🔌 Backend Entegrasyonu

Frontend uygulaması backend API'sine bağlanır. Backend'in sağlaması gereken endpoint'ler:

### 1. Health Check
```
GET /
```

Response:
```json
{
  "message": "SyntaxSherlock API is running! Use POST /analyze to scan files."
}
```

### 2. Analiz Endpoint
```
POST /analyze
Content-Type: multipart/form-data
Body: files[] (Bir veya birden fazla Python dosyası)
```

Response:
```json
{
  "results": [
    {
      "filename": "test.py",
      "status": "success",
      "risks": [
        {
          "lineno": 5,
          "code": "result = x / y",
          "type": "Division",
          "risk_score": 0.95,
          "message": "SIFIRLA BÖLME (Literal)",
          "definite_error": true
        }
      ]
    }
  ]
}
```

**NOT:** Frontend her dosyayı AYRI AYRI backend'e gönderir. Kullanıcı 3 dosya seçerse, 3 ayrı API isteği yapılır.

## 📁 Proje Yapısı

```
src/
├── components/
│   ├── FileUpload.tsx       # Dosya yükleme bileşeni
│   ├── FileUpload.css
│   ├── ErrorDisplay.tsx     # Hata gösterme bileşeni
│   └── ErrorDisplay.css
├── services/
│   └── api.ts               # Backend API servisi
├── types.ts                 # TypeScript tip tanımlamaları
├── App.tsx                  # Ana uygulama bileşeni
├── App.css
├── main.tsx                 # Giriş noktası
└── index.css                # Global stiller
```

## 🎨 Özellikler Detay

### Dosya Yükleme
- Drag & drop desteği
- File picker ile dosya seçimi
- Sadece `.py` uzantılı dosyalar kabul edilir
- Yükleme sırasında animasyonlu loading göstergesi

### Hata Gösterimi
- Hata tipi badgeleri (ZeroDivisionError, IndexError)
- Satır ve kolon numarası gösterimi
- Hatalı kod satırları vurgulanır
- Detaylı hata mesajları
- Kod context gösterimi

### Backend Bağlantı
- Otomatik backend durumu kontrolü
- Bağlantı durumu göstergesi (bağlı/bağlı değil)
- Hata durumunda kullanıcı bilgilendirme

## 🎯 Kullanım Adımları

1. Uygulamayı başlatın
2. Python dosyanızı yükleyin (drag & drop veya tıklayarak)
3. Backend dosyayı analiz edecek
4. Tespit edilen runtime hatalar ekranda gösterilecek
5. Hatalı satırlar kod görüntüleyicide işaretlenecek
6. Yeni analiz için "Yeni Analiz" butonuna tıklayın

## 🐛 Hata Ayıklama

### Backend bağlanamıyor hatası

1. Backend'in çalıştığından emin olun
2. CORS ayarlarını kontrol edin
3. Backend URL'ini `.env` dosyasında kontrol edin

### Dosya yüklenmiyor

1. Dosyanın `.py` uzantılı olduğundan emin olun
2. Dosya boyutunun makul olduğundan emin olun
3. Tarayıcı konsolunu kontrol edin
