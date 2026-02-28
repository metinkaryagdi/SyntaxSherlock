import axios from 'axios'
import TurkishCodeAnalyzer from './TurkishCodeAnalyzer'

const API_BASE_URL = 'http://localhost:5000/api'

// API Response Types
export interface ReportSummary {
  submissionId: string
  language: string
  errors: number
  warnings: number
  infos: number
  codeQualityScore: number
  grade: string
  calculatedAt: string
}

export interface Issue {
  code: string
  message: string
  line: number
  column: number
  severity: 'error' | 'warning' | 'info'
  turkishExplanation?: string
  badExample?: string
  goodExample?: string
  fixSuggestion?: string
  actualCode?: string // Dosyadan gelen gerçek kod satırı
}

export interface DetailedReport {
  submissionId: string
  language: string
  calculatedAt: string
  fileContent?: string // Yüklenen dosyanın içeriği
  summary: {
    errors: number
    warnings: number
    infos: number
    totalIssues: number
    codeQuality: string
    grade: string
    evaluation: string
  }
  issues: Issue[]
}

// API Service Class
export class ReportService {
  // Tüm raporları getir
  static async getAllReports(): Promise<ReportSummary[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/Reports`)
      return response.data
    } catch (error) {
      console.error('Error fetching reports:', error)
      throw error
    }
  }

  // Belirli bir submission ID'ye ait detaylı raporu getir
  static async getReportById(submissionId: string): Promise<DetailedReport> {
    try {
      const response = await axios.get(`${API_BASE_URL}/Reports/${submissionId}`)
      const report = response.data
      
      // Issues'ları Türkçeleştir ve gerçek kod satırlarını ekle
      const turkishIssues = report.issues.map((issue: Issue) => {
        const turkishDetails = TurkishCodeAnalyzer.getIssueDetails(issue.code)
        
        // Dosya içeriğinden ilgili satırı çıkar
        let actualCode = 'Kod satırı bulunamadı'
        if (report.fileContent) {
          const lines = report.fileContent.split('\n')
          if (issue.line > 0 && issue.line <= lines.length) {
            actualCode = lines[issue.line - 1] || 'Satır bulunamadı'
          }
        }
        
        return {
          ...issue,
          turkishExplanation: turkishDetails.turkishExplanation || issue.message,
          badExample: turkishDetails.badExample || 'Örnek kod bulunamadı', // Sabit örnek göster
          goodExample: turkishDetails.goodExample || 'Düzeltilmiş kod bulunamadı',
          fixSuggestion: turkishDetails.fixSuggestion || 'Kodunuzu kontrol edin',
          actualCode: actualCode
        }
      })
      
      return {
        ...report,
        issues: turkishIssues
      }
    } catch (error) {
      console.error('Error fetching report by ID:', error)
      throw error
    }
  }

  // Raporu polling ile kontrol et (dosya yükleme sonrası)
  static async pollForReport(submissionId: string, maxAttempts: number = 30): Promise<DetailedReport> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const report = await this.getReportById(submissionId)
        return report
      } catch (error) {
        if (attempt === maxAttempts) {
          throw new Error('Rapor hazırlanırken zaman aşımı oluştu')
        }
        // 2 saniye bekle
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    throw new Error('Rapor alınamadı')
  }
}

export default ReportService
