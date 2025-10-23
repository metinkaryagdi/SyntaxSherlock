import React, { useState, useEffect } from 'react'
import { 
  FiAlertCircle, 
  FiAlertTriangle, 
  FiInfo, 
  FiBarChart, 
  FiCopy, 
  FiPlay, 
  FiMapPin,
  FiTarget,
  FiChevronRight,
  FiRefreshCw,
  FiCheckCircle,
  FiThumbsUp,
  FiClock,
  FiAlertOctagon,
  FiXCircle,
  FiStar,
  FiAward,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiZap,
  FiSettings,
  FiX,
  FiCheck
} from 'react-icons/fi'
import CircularProgressBar from './CircularProgressBar'
import ReportService, { DetailedReport, Issue } from '@/services/ReportService'
import CodeComparison from './CodeComparison'
import TurkishCodeAnalyzer from '@/services/TurkishCodeAnalyzer'
import './Report.css'

interface ReportProps {
  submissionId: string
}

const Report: React.FC<ReportProps> = ({ submissionId }) => {
  const [report, setReport] = useState<DetailedReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [showCodeComparison, setShowCodeComparison] = useState(false)
  const [viewMode, setViewMode] = useState<'all' | 'sequential'>('all')
  const [currentIssueIndex, setCurrentIssueIndex] = useState(0)

  const formatCodeWithLineNumbers = (code: string, startLine: number = 1) => {
    const lines = code.split('\n')
    return lines.map((line, index) => (
      <div key={index} className="code-line">
        <span className="line-number">{startLine + index}</span>
        <span className="line-content">{line || ' '}</span>
      </div>
    ))
  }

  useEffect(() => {
    fetchReport()
  }, [submissionId])

  const fetchReport = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const reportData = await ReportService.pollForReport(submissionId)
      setReport(reportData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rapor alınırken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <div className="severity-icon error"><FiAlertCircle /></div>
      case 'warning': return <div className="severity-icon warning"><FiAlertTriangle /></div>
      case 'info': return <div className="severity-icon info"><FiInfo /></div>
      default: return <div className="severity-icon default"><FiInfo /></div>
    }
  }

  const getScoreColor = (score: string) => {
    const numericScore = parseInt(score.split('/')[0])
    if (numericScore >= 80) return '#10b981'
    if (numericScore >= 60) return '#3b82f6'
    if (numericScore >= 40) return '#f59e0b'
    return '#ef4444'
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return '#10b981'
      case 'B': return '#3b82f6'
      case 'C': return '#f59e0b'
      case 'D': return '#f97316'
      case 'F': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getGradeIcon = (grade: string) => {
    switch (grade) {
      case 'A': return <FiStar className="grade-icon excellent" />
      case 'B': return <FiAward className="grade-icon good" />
      case 'C': return <FiTrendingUp className="grade-icon average" />
      case 'D': return <FiTrendingDown className="grade-icon poor" />
      case 'F': return <FiXCircle className="grade-icon critical" />
      default: return <FiMinus className="grade-icon default" />
    }
  }

  const getEvaluationIcon = (evaluation: string) => {
    const turkishEvaluation = TurkishCodeAnalyzer.getEvaluationTurkish(evaluation)
    
    if (turkishEvaluation.includes('Mükemmel') || turkishEvaluation.includes('Çok iyi')) {
      return <FiCheckCircle className="evaluation-icon excellent" />
    } else if (turkishEvaluation.includes('İyi') || turkishEvaluation.includes('Yeterli')) {
      return <FiThumbsUp className="evaluation-icon good" />
    } else if (turkishEvaluation.includes('İyileştirme') || turkishEvaluation.includes('Orta')) {
      return <FiClock className="evaluation-icon warning" />
    } else if (turkishEvaluation.includes('Kötü')) {
      return <FiAlertOctagon className="evaluation-icon poor" />
    } else if (turkishEvaluation.includes('Kritik')) {
      return <FiXCircle className="evaluation-icon critical" />
    } else {
      return <FiInfo className="evaluation-icon default" />
    }
  }

  const handleIssueClick = (issue: Issue) => {
    if (viewMode === 'all') {
      setSelectedIssue(issue)
      setShowCodeComparison(true)
    }
  }

  const handleCloseComparison = () => {
    setShowCodeComparison(false)
    setSelectedIssue(null)
  }

  const handleViewModeChange = (mode: 'all' | 'sequential') => {
    setViewMode(mode)
    setCurrentIssueIndex(0)
  }

  const handleNextIssue = () => {
    if (report && currentIssueIndex < report.issues.length - 1) {
      setCurrentIssueIndex(currentIssueIndex + 1)
    }
  }

  const handlePrevIssue = () => {
    if (currentIssueIndex > 0) {
      setCurrentIssueIndex(currentIssueIndex - 1)
    }
  }

  const getDisplayIssues = () => {
    if (!report) return []
    if (viewMode === 'all') return report.issues
    return [report.issues[currentIssueIndex]]
  }

  if (loading) {
    return (
      <div className="report-container loading-container">
        <div className="loading-screen">
          <div className="loading-animation">
            <div className="loading-circle"></div>
            <div className="loading-text">Kod Analizi Yapılıyor...</div>
            <div className="loading-subtitle">Lütfen bekleyin</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="report-container error-container">
        <div className="error-screen">
          <div className="error-icon"><FiAlertTriangle /></div>
          <h2>Hata Oluştu</h2>
          <p>{error}</p>
          <button onClick={fetchReport} className="retry-button">
            <FiRefreshCw />
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  if (!report) return null

  return (
    <div className="report-container">
      <div className="main-content">
        <div className="sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">
              Sonuçlar
            </h2>
          </div>
          
          <div className="score-section">
            <div className="score-main">
              <div className="score-circle-container">
                <CircularProgressBar
                  percentage={parseInt(report.summary.codeQuality.split('/')[0])}
                  color={getScoreColor(report.summary.codeQuality)}
                  trackColor="rgba(255, 255, 255, 0.1)"
                  text={report.summary.codeQuality}
                  showPercentage={false}
                  textStyle={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                  }}
                  size={12}
                  radius={48}
                />
              </div>
              <div className="score-details">
                <div className="grade-display">
                  <span className="grade-icon-wrapper">
                    {getGradeIcon(report.summary.grade)}
                  </span>
                  <span className="grade-letter" style={{ color: getGradeColor(report.summary.grade) }}>
                    {TurkishCodeAnalyzer.getGradeTurkish(report.summary.grade)}
                  </span>
                  <span className="grade-text">({report.summary.grade})</span>
                </div>
                <div className="evaluation-text">
                  <span className="evaluation-icon-wrapper">
                    {getEvaluationIcon(report.summary.evaluation)}
                  </span>
                  <span className="evaluation-text-content">
                    {TurkishCodeAnalyzer.getEvaluationTurkish(report.summary.evaluation)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <h3 className="stats-title">İstatistikler</h3>
            <div className="stats-list">
              <div className="stat-item error-item">
                <div className="stat-icon error"><FiAlertCircle /></div>
                <div className="stat-info">
                  <div className="stat-label">Hatalar</div>
                  <div className="stat-number">{report.summary.errors}</div>
                </div>
                <div className="stat-percentage">
                  {Math.round((report.summary.errors / report.summary.totalIssues) * 100)}%
                </div>
              </div>
              
              <div className="stat-item warning-item">
                <div className="stat-icon warning"><FiAlertTriangle /></div>
                <div className="stat-info">
                  <div className="stat-label">Uyarılar</div>
                  <div className="stat-number">{report.summary.warnings}</div>
                </div>
                <div className="stat-percentage">
                  {Math.round((report.summary.warnings / report.summary.totalIssues) * 100)}%
                </div>
              </div>
              
              <div className="stat-item total-item">
                <div className="stat-icon total"><FiBarChart /></div>
                <div className="stat-info">
                  <div className="stat-label">Toplam</div>
                  <div className="stat-number">{report.summary.totalIssues}</div>
                </div>
                <div className="stat-percentage">100%</div>
              </div>
            </div>
          </div>

          <div className="view-controls-section">
            <h3 className="controls-title">Görünüm</h3>
            <div className="view-controls">
              <button 
                className={`view-btn ${viewMode === 'all' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('all')}
              >
                <div className="btn-icon"><FiCopy /></div>
                <span>Tümü</span>
              </button>
              <button 
                className={`view-btn ${viewMode === 'sequential' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('sequential')}
              >
                <div className="btn-icon"><FiPlay /></div>
                <span>Sırayla</span>
              </button>
            </div>
          </div>
        </div>

        <div className="content-area">
          <div className="content-header">
            <h2 className="content-title">
              <FiAlertCircle className="title-icon" />
              Hatalar
            </h2>
            {viewMode === 'sequential' && (
              <div className="navigation-bar">
                <button 
                  className="nav-button prev" 
                  onClick={handlePrevIssue}
                  disabled={currentIssueIndex === 0}
                >
                  <span>←</span>
                  <span>Önceki</span>
                </button>
                <div className="issue-counter">
                  <span className="current">{currentIssueIndex + 1}</span>
                  <span className="separator">/</span>
                  <span className="total">{report.issues.length}</span>
                </div>
                <button 
                  className="nav-button next" 
                  onClick={handleNextIssue}
                  disabled={currentIssueIndex === report.issues.length - 1}
                >
                  <span>Sonraki</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>

          <div className={`issues-list ${viewMode === 'all' ? 'grid-view' : 'sequential-view'}`}>
            {getDisplayIssues().map((issue, index) => (
              <div key={index} className={`issue-item ${viewMode === 'sequential' ? 'sequential-item' : 'issue-card'}`}>
                {viewMode === 'all' ? (
                  <div 
                    className={`issue-card ${selectedIssue === issue ? 'selected' : ''}`}
                    onClick={() => handleIssueClick(issue)}
                  >
                    <div className="issue-header">
                      <div className="issue-severity">
                        <span className="severity-icon">{getSeverityIcon(issue.severity)}</span>
                        <span className="severity-text">{TurkishCodeAnalyzer.getSeverityTurkish(issue.severity)}</span>
                      </div>
                      <div className="issue-code">{issue.code}</div>
                      <div className="issue-location">
                        <div className="location-icon"><FiMapPin /></div>
                        <span>Satır {issue.line}:{issue.column}</span>
                      </div>
                    </div>
                    <div className="issue-message">
                      {(issue as any).turkishExplanation || issue.message}
                    </div>
                    <div className="issue-action">
                      <span className="action-button">
                        <span>Detayları Gör</span>
                        <FiChevronRight />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="sequential-issue">
                    <div className="sequential-header">
                      <div className="sequential-severity">
                        <span className="severity-icon">{getSeverityIcon(issue.severity)}</span>
                        <span className="severity-text">{TurkishCodeAnalyzer.getSeverityTurkish(issue.severity)}</span>
                        <span className="issue-code">{issue.code}</span>
                        <span className="issue-location">
                          <div className="location-icon"><FiMapPin /></div>
                          <span>Satır {issue.line}:{issue.column}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="sequential-content">
                      <div className="content-section">
                        <h4>
                          <div className="content-icon"><FiZap /></div>
                          Açıklama
                        </h4>
                        <p>{(issue as any).turkishExplanation}</p>
                      </div>
                      
                      <div className="content-section">
                        <h4>
                          <div className="content-icon"><FiChevronRight /></div>
                          Kod Karşılaştırması
                        </h4>
                        <div className="sequential-code-comparison">
                          <div className="sequential-code-card bad-code-card">
                            <div className="sequential-code-header">
                              <div className="sequential-code-status bad">
                                <span className="sequential-status-icon"><FiX /></span>
                                <span>Yanlış Kod</span>
                              </div>
                              <div className="sequential-code-location">Satır {issue.line}</div>
                            </div>
                            <div className="sequential-code-content">
                              <pre className="sequential-code-block">
                                <code>{formatCodeWithLineNumbers((issue as any).badExample, issue.line)}</code>
                              </pre>
                            </div>
                          </div>
                          
                          <div className="sequential-comparison-arrow">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M13 7L18 12L13 17M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          
                          <div className="sequential-code-card good-code-card">
                            <div className="sequential-code-header">
                              <div className="sequential-code-status good">
                                <span className="sequential-status-icon"><FiCheck /></span>
                                <span>Doğru Kod</span>
                              </div>
                              <div className="sequential-code-location">Düzeltilmiş</div>
                            </div>
                            <div className="sequential-code-content">
                              <pre className="sequential-code-block">
                                <code>{formatCodeWithLineNumbers((issue as any).goodExample, 1)}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="content-section">
                        <h4>
                          <div className="content-icon"><FiSettings /></div>
                          Çözüm
                        </h4>
                        <div className="solution-content">
                          <p>{(issue as any).fixSuggestion}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCodeComparison && selectedIssue && (
        <CodeComparison 
          issue={selectedIssue as any} 
          onClose={handleCloseComparison}
        />
      )}
    </div>
  )
}

export default Report
