import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ErrorDisplay from './components/ErrorDisplay';
import type { AnalysisResult } from './types';
import { analyzePythonCode } from './services/api';
import './App.css';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    // Aynı dosya zaten yüklü mü kontrol et
    if (analysisResults.some(result => result.filename === file.name)) {
      alert('Bu dosya zaten yüklü!');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Backend API'ye dosyayı gönder ve analiz et
      const result = await analyzePythonCode(file);

      setAnalysisResults(prev => [...prev, result]);
      setActiveFileId(result.id);
    } catch (error) {
      console.error('Dosya analiz hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Dosya analiz edilirken bir hata oluştu!';
      alert(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCloseFile = (fileId: string) => {
    setAnalysisResults(prev => prev.filter(result => result.id !== fileId));
    
    // Eğer kapatılan dosya aktif dosya ise, başka bir dosyayı aktif yap
    if (activeFileId === fileId) {
      const remaining = analysisResults.filter(result => result.id !== fileId);
      setActiveFileId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleReset = () => {
    setAnalysisResults([]);
    setActiveFileId(null);
    setIsAnalyzing(false);
  };

  const activeResult = analysisResults.find(result => result.id === activeFileId);

  return (
    <div className="app">
      <header className="app-header animate-slide-down">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="logo-text">
              <h1>SyntaxSherlock</h1>
              <p>Python Runtime Hata Analizi</p>
            </div>
          </div>

          {analysisResults.length > 0 && (
            <button onClick={handleReset} className="btn btn-primary reset-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Tümünü Temizle
            </button>
          )}
        </div>

        {/* File Tabs */}
        {analysisResults.length > 0 && (
          <div className="file-tabs">
            {analysisResults.map((result) => (
              <div
                key={result.id}
                className={`file-tab ${activeFileId === result.id ? 'file-tab-active' : ''}`}
                onClick={() => setActiveFileId(result.id)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="file-tab-name">{result.filename}</span>
                {result.errors.length > 0 && (
                  <span className="file-tab-badge">{result.errors.length}</span>
                )}
                <button
                  className="file-tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseFile(result.id);
                  }}
                  aria-label="Dosyayı kapat"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </header>

      <main className="app-main container">
        {analysisResults.length === 0 ? (
          <FileUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
        ) : activeResult ? (
          <ErrorDisplay
            errors={activeResult.errors}
            code={activeResult.code}
            filename={activeResult.filename}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
