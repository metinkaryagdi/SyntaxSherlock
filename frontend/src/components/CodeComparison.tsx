import React, { useState } from 'react'
import { CodeIssue } from '@/services/TurkishCodeAnalyzer'
import { FiX, FiChevronRight, FiSettings, FiList, FiTarget, FiZap, FiMapPin, FiAlertCircle, FiAlertTriangle, FiInfo, FiTag, FiSearch, FiCheck } from 'react-icons/fi'
import './CodeComparison.css'

interface CodeComparisonProps {
  issue: CodeIssue
  onClose: () => void
}

const CodeComparison: React.FC<CodeComparisonProps> = ({ issue, onClose }) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'comparison' | 'fix'>('explanation')

  const formatCodeWithLineNumbers = (code: string, startLine: number = 1) => {
    const lines = code.split('\n')
    return lines.map((line, index) => (
      <div key={index} className="code-line">
        <span className="line-number">{startLine + index}</span>
        <span className="line-content">{line || ' '}</span>
      </div>
    ))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return '#ef4444'
      case 'warning': return '#f59e0b'
      case 'info': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <FiAlertCircle />
      case 'warning': return <FiAlertTriangle />
      case 'info': return <FiInfo />
      default: return <FiInfo />
    }
  }

  const getSeverityTurkish = (severity: string) => {
    switch (severity) {
      case 'error': return 'HATA'
      case 'warning': return 'UYARI'
      case 'info': return 'BİLGİ'
      default: return 'BİLGİ'
    }
  }

  return (
    <div className="code-comparison-overlay">
      <div className="code-comparison-modal">
        <div className="comparison-header">
          <div className="header-left">
            <div className="issue-badge" style={{ backgroundColor: getSeverityColor(issue.severity) }}>
              {getSeverityIcon(issue.severity)}
              <span>{getSeverityTurkish(issue.severity)}</span>
            </div>
            <div className="issue-details">
              <h2 className="issue-title">{issue.code}</h2>
              <p className="issue-location"><FiMapPin /> Satır {issue.line}:{issue.column}</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="comparison-nav">
          <button 
            className={`nav-item ${activeTab === 'explanation' ? 'active' : ''}`}
            onClick={() => setActiveTab('explanation')}
          >
            <span className="nav-icon"><FiZap /></span>
            <span>Açıklama</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            <span className="nav-icon"><FiChevronRight /></span>
            <span>Karşılaştırma</span>
          </button>
            <button 
              className={`nav-item ${activeTab === 'fix' ? 'active' : ''}`}
              onClick={() => setActiveTab('fix')}
            >
              <span className="nav-icon"><FiSettings /></span>
              <span>Çözüm</span>
            </button>
        </div>

        <div className="comparison-content">
          {activeTab === 'explanation' && (
            <div className="explanation-section">
              <div className="section-header">
                <h3><FiSearch /> Sorun Detayları</h3>
                <div className="section-divider"></div>
              </div>
              
              <div className="info-cards">
                <div className="info-card">
                  <div className="card-icon"><FiTag /></div>
                  <div className="card-content">
                    <h4>Hata Kodu</h4>
                    <p>{issue.code}</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="card-icon"><FiZap /></div>
                  <div className="card-content">
                    <h4>Açıklama</h4>
                    <p>{issue.turkishExplanation}</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="card-icon"><FiMapPin /></div>
                  <div className="card-content">
                    <h4>Konum</h4>
                    <p>Satır {issue.line}, Sütun {issue.column}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="comparison-section">
              <div className="section-header">
                <h3><FiChevronRight /> Kod Karşılaştırması</h3>
                <div className="section-divider"></div>
              </div>
              
              <div className="code-comparison-grid">
                <div className="code-card bad-code-card">
                  <div className="code-card-header">
                    <div className="code-status bad">
                      <span className="status-icon"><FiX /></span>
                      <span>Yanlış Kod</span>
                    </div>
                    <div className="code-location">Satır {issue.line}</div>
                  </div>
                  <div className="code-content">
                    <pre className="code-block">
                      <code>
                        {formatCodeWithLineNumbers(issue.badExample, issue.line)}
                      </code>
                    </pre>
                  </div>
                </div>
                
                <div className="comparison-arrow">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M13 7L18 12L13 17M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div className="code-card good-code-card">
                  <div className="code-card-header">
                    <div className="code-status good">
                      <span className="status-icon"><FiCheck /></span>
                      <span>Doğru Kod</span>
                    </div>
                    <div className="code-location">Düzeltilmiş</div>
                  </div>
                  <div className="code-content">
                    <pre className="code-block">
                      <code>
                        {formatCodeWithLineNumbers(issue.goodExample, 1)}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fix' && (
            <div className="fix-section">
              <div className="section-header">
                <h3><FiSettings /> Nasıl Düzeltilir?</h3>
                <div className="section-divider"></div>
              </div>
              
              <div className="fix-content">
                <div className="fix-card steps-card">
                  <div className="card-header">
                    <span className="card-icon"><FiList /></span>
                    <h4>Adım Adım Rehber</h4>
                  </div>
                  <div className="card-body">
                    <ol className="steps-list">
                      {issue.fixSuggestion.split('\n').map((step, index) => (
                        step.trim() && (
                          <li key={index}>
                            {step.replace(/^\d+\.\s*/, '')}
                          </li>
                        )
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="fix-card tips-card">
                  <div className="card-header">
                    <span className="card-icon"><FiTarget /></span>
                    <h4>Genel İpuçları</h4>
                  </div>
                  <div className="card-body">
                    <ul className="tips-list">
                      <li>IDE'nizin linting özelliklerini kullanın</li>
                      <li>Black formatter gibi araçları kullanın</li>
                      <li>Kod standartlarınıza uygun yazın</li>
                      <li>Düzenli olarak kod analizi yapın</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="comparison-footer">
          <button onClick={onClose} className="close-modal-btn">
            <span>Kapat</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CodeComparison
