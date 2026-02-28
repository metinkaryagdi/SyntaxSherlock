# 🕵️ SyntaxSherlock

**Modern Python Kod Analizi Platformu - Türkçe Hata Açıklamaları ve Çözüm Önerileri ile Profesyonel Kod Kalitesi Değerlendirmesi**

SyntaxSherlock, Python kodlarınızı analiz ederek PEP 8 standartlarına uygunluğunu kontrol eden, hataları Türkçe açıklayan ve çözüm önerileri sunan modern bir kod analizi platformudur. Microservices mimarisi ile tasarlanmış, Docker ile containerize edilmiş ve React/TypeScript frontend ile .NET 9 backend servislerinden oluşan kapsamlı bir sistemdir.

## 📋 İçindekiler

- [🎯 Özellikler](#-özellikler)
- [🏗️ Mimari](#️-mimari)
- [📁 Proje Yapısı](#-proje-yapısı)
- [🚀 Kurulum](#-kurulum)
- [💻 Kullanım](#-kullanım)
- [🔧 Geliştirme](#-geliştirme)
- [📊 API Dokümantasyonu](#-api-dokümantasyonu)
- [🐳 Docker](#-docker)
- [🧪 Test](#-test)
- [📈 Performans](#-performans)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📄 Lisans](#-lisans)

## 🎯 Özellikler

### ✨ Ana Özellikler
- **🐍 Python Kod Analizi**: Flake8, pycodestyle, pyflakes ve mccabe araçları ile kapsamlı kod analizi
- **🇹🇷 Türkçe Hata Açıklamaları**: Tüm hatalar Türkçe olarak açıklanır ve çözüm önerileri sunulur
- **📊 Detaylı Raporlama**: Kod kalitesi skoru, hata sayıları ve değerlendirme sistemi
- **🎨 Modern UI**: React/TypeScript ile geliştirilmiş responsive ve kullanıcı dostu arayüz
- **⚡ Gerçek Zamanlı Analiz**: Dosya yükleme sonrası anında analiz ve raporlama
- **🔄 Microservices Mimarisi**: Ölçeklenebilir ve bakımı kolay servis yapısı

### 🛠️ Teknik Özellikler
- **Frontend**: React 18, TypeScript, Vite, Axios, React Icons
- **Backend**: .NET 9, C#, Entity Framework Core, PostgreSQL
- **Message Queue**: RabbitMQ ile asenkron işlem yönetimi
- **Containerization**: Docker ve Docker Compose
- **API Gateway**: YARP reverse proxy ile servis yönlendirme
- **Database**: PostgreSQL ile veri saklama

## 🏗️ Mimari

### Sistem Mimarisi
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Gateway API   │    │   Backend       │
│   (React/TS)    │◄──►│   (YARP Proxy)  │◄──►│   Services      │
│   Port: 3000    │    │   Port: 5000    │    │   (.NET 9)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   RabbitMQ     │
                       │   Message Bus  │
                       │   Port: 5672   │
                       └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │  Submission API  │ │  Report API     │ │  Metrics Worker │
    │  Port: 5033      │ │  Port: 5035     │ │  Background     │
    └─────────────────┘ └─────────────────┘ └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   Port: 5432    │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Linter Worker  │
                       │   (Python)      │
                       └─────────────────┘
```

### Servis Detayları

#### 🌐 Frontend (React/TypeScript)
- **Teknoloji**: React 18, TypeScript, Vite
- **Port**: 3000
- **Özellikler**:
  - Drag & Drop dosya yükleme
  - Gerçek zamanlı analiz durumu
  - Detaylı hata raporlama
  - Kod karşılaştırma modali
  - Responsive tasarım

#### 🚪 Gateway API (.NET 9)
- **Teknoloji**: .NET 9, YARP Reverse Proxy
- **Port**: 5000
- **Özellikler**:
  - API yönlendirme ve load balancing
  - CORS yapılandırması
  - Health check endpoints

#### 📨 Submission API (.NET 9)
- **Teknoloji**: .NET 9, ASP.NET Core
- **Port**: 5033
- **Özellikler**:
  - Dosya yükleme ve validasyon
  - RabbitMQ event publishing
  - Dosya storage yönetimi

#### 📊 Report API (.NET 9)
- **Teknoloji**: .NET 9, Entity Framework Core
- **Port**: 5035
- **Özellikler**:
  - Analiz sonuçlarını saklama
  - Rapor API endpoints
  - RabbitMQ consumer

#### ⚙️ Metrics Worker (.NET 9)
- **Teknoloji**: .NET 9, Background Service
- **Özellikler**:
  - Kod kalitesi metrikleri hesaplama
  - RabbitMQ message consumption
  - PostgreSQL veri saklama

#### 🐍 Linter Worker (Python)
- **Teknoloji**: Python, Flake8, RabbitMQ
- **Özellikler**:
  - Python kod analizi
  - Flake8 entegrasyonu
  - JSON format çıktı

## 📁 Proje Yapısı

```
SyntaxSherlock/
├── 📁 frontend/                    # React/TypeScript Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/          # React bileşenleri
│   │   │   ├── FileUpload.tsx      # Dosya yükleme bileşeni
│   │   │   ├── Report.tsx          # Rapor görüntüleme
│   │   │   ├── CodeComparison.tsx  # Kod karşılaştırma
│   │   │   └── CircularProgressBar.tsx
│   │   ├── 📁 services/            # API servisleri
│   │   │   ├── ReportService.ts    # Rapor API servisi
│   │   │   ├── TurkishCodeAnalyzer.ts # Türkçe hata açıklamaları
│   │   │   └── MockReportService.ts
│   │   ├── App.tsx                 # Ana uygulama
│   │   └── main.tsx                # Giriş noktası
│   ├── package.json                # Frontend bağımlılıkları
│   └── vite.config.ts              # Vite yapılandırması
│
├── 📁 src/                         # Backend Servisleri
│   ├── 📁 Contracts/               # Paylaşılan kontratlar
│   │   └── 📁 Events/              # Event tanımları
│   ├── 📁 Gateway/                 # API Gateway
│   │   └── 📁 Gateway.Api/         # YARP Proxy servisi
│   ├── 📁 Submission/              # Dosya yükleme servisi
│   │   └── 📁 Submission.Api/      # Submission API
│   ├── 📁 Report.Api/             # Rapor servisi
│   │   ├── 📁 Controllers/         # API Controllers
│   │   ├── 📁 Data/               # Entity Framework
│   │   ├── 📁 Models/             # Veri modelleri
│   │   ├── 📁 Repositories/       # Veri erişim katmanı
│   │   └── 📁 Services/           # İş mantığı servisleri
│   ├── 📁 MetricsWorker/          # Metrik hesaplama servisi
│   │   ├── 📁 Data/               # Veritabanı context
│   │   ├── 📁 Models/             # Veri modelleri
│   │   ├── 📁 Repositories/       # Repository pattern
│   │   └── 📁 Services/           # Background servisler
│   └── 📁 LinterWorker/            # Python kod analizi
│       ├── main.py                # Ana Python script
│       └── requirements.txt       # Python bağımlılıkları
│
├── 📁 infra/                       # Docker ve Altyapı
│   └── docker-compose.yml          # Tüm servislerin Docker yapılandırması
│
├── 📁 storage/                     # Yüklenen dosyalar
│   └── [submission-id]/            # Her submission için ayrı klasör
│       └── [filename].py           # Yüklenen Python dosyaları
│
└── README.md                       # Bu dosya
```

## 🚀 Kurulum

### Ön Gereksinimler
- **Docker** ve **Docker Compose**
- **Node.js** 18+ (frontend geliştirme için)
- **.NET 9 SDK** (backend geliştirme için)
- **Python 3.8+** (linter worker için)

### Docker ile Hızlı Başlangıç

1. **Projeyi klonlayın**:
```bash
git clone https://github.com/gokhan/syntaxsherlock.git
cd syntaxsherlock
```

2. **Tüm servisleri başlatın**:
```bash
cd infra
docker-compose up -d
```

3. **Servislerin durumunu kontrol edin**:
```bash
docker-compose ps
```

4. **Frontend'i başlatın** (ayrı terminal):
```bash
cd frontend
npm install
npm run dev
```

5. **Uygulamaya erişin**:
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:5000
   - RabbitMQ Management: http://localhost:15672 (guest/guest)

### Manuel Kurulum

#### Backend Servisleri
```bash
# Her servis için ayrı ayrı
cd src/Submission/Submission.Api
dotnet restore
dotnet run

cd src/Report.Api
dotnet restore
dotnet run

cd src/MetricsWorker
dotnet restore
dotnet run

cd src/Gateway/Gateway.Api
dotnet restore
dotnet run
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Linter Worker
```bash
cd src/LinterWorker
pip install -r requirements.txt
python main.py
```

## 💻 Kullanım

### Web Arayüzü ile Kullanım

1. **Frontend'e erişin**: http://localhost:3000
2. **Python dosyasını yükleyin**:
   - Drag & Drop ile dosyayı sürükleyin
   - Veya "Dosya Seç" butonuna tıklayın
3. **Analizi başlatın**: "Analizi Başlat" butonuna tıklayın
4. **Sonuçları görüntüleyin**:
   - Kod kalitesi skoru
   - Hata, uyarı ve bilgi sayıları
   - Detaylı hata açıklamaları
   - Kod karşılaştırmaları

### API ile Kullanım

#### Dosya Yükleme
```bash
curl -X POST http://localhost:5000/api/submissions/upload \
  -F "language=python" \
  -F "file=@example.py"
```

#### Rapor Alma
```bash
curl http://localhost:5000/api/reports/{submission-id}
```

## 🔧 Geliştirme

### Frontend Geliştirme

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# TypeScript kontrolü
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Build
npm run build
```

### Backend Geliştirme

```bash
# Her servis için
cd src/[ServiceName]

# Bağımlılıkları yükle
dotnet restore

# Geliştirme modunda çalıştır
dotnet run

# Build
dotnet build

# Test
dotnet test
```

### Veritabanı Migration

```bash
# Report API için
cd src/Report.Api
dotnet ef migrations add [MigrationName]
dotnet ef database update

# Metrics Worker için
cd src/MetricsWorker
dotnet ef migrations add [MigrationName]
dotnet ef database update
```

## 📊 API Dokümantasyonu

### Submission API Endpoints

#### POST /api/submissions/upload
Dosya yükleme ve analiz başlatma.

**Request**:
- Content-Type: multipart/form-data
- Fields:
  - `language`: string (örn: "python")
  - `file`: file (.py dosyası)

**Response**:
```json
{
  "submissionId": "guid",
  "language": "python",
  "fileName": "example.py",
  "message": "Dosya başarıyla yüklendi ve analiz başlatıldı"
}
```

### Report API Endpoints

#### GET /api/reports
Tüm raporları listele.

**Response**:
```json
[
  {
    "submissionId": "guid",
    "language": "python",
    "errors": 5,
    "warnings": 3,
    "infos": 1,
    "codeQualityScore": 75,
    "grade": "C",
    "calculatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /api/reports/{submissionId}
Belirli bir submission'ın detaylı raporunu al.

**Response**:
```json
{
  "submissionId": "guid",
  "language": "python",
  "calculatedAt": "2024-01-01T00:00:00Z",
  "fileContent": "print('Hello World')",
  "summary": {
    "errors": 5,
    "warnings": 3,
    "infos": 1,
    "totalIssues": 9,
    "codeQuality": "75/100",
    "grade": "C",
    "evaluation": "İyi kod kalitesi"
  },
  "issues": [
    {
      "code": "E501",
      "message": "line too long (82 > 79 characters)",
      "line": 1,
      "column": 1,
      "severity": "error",
      "turkishExplanation": "Satır çok uzun (79 karakterden fazla)",
      "badExample": "def very_long_function_name_with_many_parameters(param1, param2, param3, param4, param5):",
      "goodExample": "def very_long_function_name_with_many_parameters(\n    param1, param2, param3, param4, param5\n):",
      "fixSuggestion": "Satırı kırın veya değişken adlarını kısaltın"
    }
  ]
}
```

## 🐳 Docker

### Docker Compose Servisleri

#### RabbitMQ
- **Image**: rabbitmq:3.13-management
- **Ports**: 5672 (AMQP), 15672 (Web UI)
- **Credentials**: guest/guest

#### PostgreSQL
- **Image**: postgres:16
- **Port**: 5432
- **Credentials**: ssuser/sspass
- **Databases**: syntaxsherlock_report, syntaxsherlock_metrics

#### Backend Servisleri
- **Submission API**: Port 5033
- **Report API**: Port 5035
- **Gateway API**: Port 5000
- **Metrics Worker**: Background service
- **Linter Worker**: Python container

### Docker Komutları

```bash
# Tüm servisleri başlat
docker-compose up -d

# Belirli servisleri başlat
docker-compose up -d rabbitmq postgres

# Logları görüntüle
docker-compose logs -f [service-name]

# Servisleri durdur
docker-compose down

# Volumes ile birlikte temizle
docker-compose down -v

# Servisleri yeniden build et
docker-compose build --no-cache
```

## 🧪 Test

### Frontend Testleri
```bash
cd frontend
npm test
```

### Backend Testleri
```bash
# Her servis için
cd src/[ServiceName]
dotnet test
```

### Integration Testleri
```bash
# Docker ile test ortamı
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 📈 Performans

### Optimizasyonlar
- **Frontend**: Vite ile hızlı build, React.memo ile re-render optimizasyonu
- **Backend**: Entity Framework Core ile veritabanı optimizasyonu
- **Message Queue**: RabbitMQ ile asenkron işlem yönetimi
- **Caching**: Redis cache entegrasyonu (gelecek sürüm)

### Monitoring
- **Health Checks**: Her servis için health endpoint'leri
- **Logging**: Structured logging ile detaylı log takibi
- **Metrics**: Prometheus metrics entegrasyonu (gelecek sürüm)

## 🤝 Katkıda Bulunma

1. **Fork** yapın
2. **Feature branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. **Commit** yapın (`git commit -m 'Add amazing feature'`)
4. **Push** yapın (`git push origin feature/amazing-feature`)
5. **Pull Request** oluşturun

### Geliştirme Kuralları
- TypeScript strict mode kullanın
- ESLint kurallarına uyun
- Unit testleri yazın
- Commit mesajlarını açıklayıcı yazın
- Code review sürecine katılın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 Katkıda Bulunanlar

- **[@GokhanGuclu](https://github.com/GokhanGuclu)** - Frontend Geliştirici (React/TypeScript)
- **[@metinkaryagdi](https://github.com/metinkaryagdi)** - Backend & Docker Geliştirici (.NET/C#)

## 📞 İletişim

- **Frontend Geliştirici**: [@GokhanGuclu](https://github.com/GokhanGuclu)
- **Backend & Docker Geliştirici**: [@metinkaryagdi](https://github.com/metinkaryagdi)
- **Proje Linki**: [https://github.com/metinkaryagdi/syntaxsherlock](https://github.com/metinkaryagdi/syntaxsherlock)

## 🙏 Teşekkürler

- [Flake8](https://flake8.pycqa.org/) - Python kod analizi
- [React](https://reactjs.org/) - Frontend framework
- [.NET](https://dotnet.microsoft.com/) - Backend framework
- [Docker](https://www.docker.com/) - Containerization
- [RabbitMQ](https://www.rabbitmq.com/) - Message broker
- [PostgreSQL](https://www.postgresql.org/) - Veritabanı

---

**SyntaxSherlock** ile Python kodlarınızı profesyonel standartlara uygun hale getirin! 🐍✨    