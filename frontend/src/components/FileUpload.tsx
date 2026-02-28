import React, { useState } from 'react'
import axios from 'axios'
import { 
  FiUpload, 
  FiX, 
  FiCheckCircle, 
  FiBarChart, 
  FiSearch,
  FiZap,
  FiTarget,
  FiStar
} from 'react-icons/fi'
import Report from './Report'
import './FileUpload.css'

interface FileUploadProps {}

interface ApiResponse {
  submissionId: string
  language: string
  fileName: string
  message: string
}

const FileUpload: React.FC<FileUploadProps> = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python')
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadResult, setUploadResult] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showReport, setShowReport] = useState(false)
  const API_BASE_URL = 'http://localhost:5000/api/submissions'

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setUploadResult(null)
      setShowReport(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      setError(null)
      setUploadResult(null)
      setShowReport(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile || !selectedLanguage) {
      setError('Lütfen bir dosya seçin!')
      return
    }

    setIsLoading(true)
    setError(null)
    setUploadResult(null)
    setShowReport(false)

    try {
      const formData = new FormData()
      formData.append('language', selectedLanguage)
      formData.append('file', selectedFile)

      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.status === 202) {
        setUploadResult(response.data)
      }
      
      setSelectedFile(null)
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Dosya yükleme sırasında bir hata oluştu.')
      } else {
        setError('Beklenmeyen bir hata oluştu.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setError(null)
    setUploadResult(null)
    setShowReport(false)
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleViewReport = () => {
    if (uploadResult) {
      setShowReport(true)
    }
  }

  return (
    <>
      <div className="file-upload-container">
        <div className="file-upload-card">
          <div className="upload-header">
            <h2 className="upload-title">
              <FiZap />
              Kod Analizi
            </h2>
            <p className="upload-subtitle">Python dosyanızı yükleyerek profesyonel kod kalitesi analizi yapın</p>
          </div>
          
          {uploadResult && !showReport && (
            <div className="success-overlay">
              <div className="success-message">
                <button 
                  className="close-success-btn"
                  onClick={() => {
                    setUploadResult(null)
                    setShowReport(false)
                  }}
                  aria-label="Kapat"
                >
                  <FiX />
                </button>
                <div className="success-icon">
                  <FiCheckCircle />
                </div>
                <div className="success-content">
                  <h3>Başarılı!</h3>
                  <p>{uploadResult.message}</p>
                  <div className="success-details">
                    <span><strong>Dosya:</strong> {uploadResult.fileName}</span>
                    <span><strong>Dil:</strong> {uploadResult.language}</span>
                    <span><strong>ID:</strong> {uploadResult.submissionId}</span>
                  </div>
                  <button onClick={handleViewReport} className="view-report-btn">
                    <FiBarChart />
                    Detaylı Raporu Görüntüle
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p className="error-text">{error}</p>
            </div>
          )}
          
          {!showReport && (
            <div 
              className={`drag-drop-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                type="file"
                id="file-input"
                className="file-input"
                onChange={handleFileChange}
                accept=".py"
                disabled={isLoading}
              />
              {selectedFile ? (
                <div className="file-info">
                  <div className="file-info-header">
                    <div className="file-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                        <text x="12" y="16" fontSize="6" fill="currentColor" textAnchor="middle">PY</text>
                      </svg>
                    </div>
                    <span className="file-name">{selectedFile.name}</span>
                    <span className="file-size">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                    <button 
                      type="button" 
                      className="remove-file"
                      onClick={removeFile}
                      aria-label="Dosyayı kaldır"
                      disabled={isLoading}
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="upload-icon">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                  </div>
                  <div className="upload-text">
                    {dragActive ? (
                      <>
                        <FiTarget />
                        Dosyayı buraya bırakın!
                      </>
                    ) : (
                      <>
                        <FiUpload />
                        Dosya seçin veya sürükleyin
                      </>
                    )}
                  </div>
                  <div className="upload-hint">
                    <FiStar />
                    Python dosyası (.py) yükleyin
                  </div>
                </div>
              )}
            </div>
          )}

          {!showReport && (
            <div className="language-selection">
              <label htmlFor="language-select" className="language-label">
                Programlama Dili
              </label>
              <select
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="language-select"
                disabled={isLoading}
              >
                <option value="python">Python</option>
              </select>
            </div>
          )}

          {!showReport && (
            <button
              type="button"
              onClick={handleSubmit}
              className="upload-button"
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  <FiSearch />
                  Analiz ediliyor...
                </>
              ) : (
                <>
                  <FiZap />
                  Analizi Başlat
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {showReport && uploadResult && (
        <Report 
          submissionId={uploadResult.submissionId} 
        />
      )}
    </>
  )
}

export default FileUpload
