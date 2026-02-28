import { DetailedReport, Issue } from './ReportService'
import TurkishCodeAnalyzer from './TurkishCodeAnalyzer'

// Mock data generator
export class MockReportService {
  // Rastgele submission ID oluştur
  static generateSubmissionId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // Backend'deki tüm hata kodlarından rastgele sorunlar oluştur
  static generateMockIssues(): Issue[] {
    const issueTypes = [
      // E kodları (pycodestyle - PEP 8 hataları)
      { code: 'E101', message: 'indentation contains mixed spaces and tabs', severity: 'error' as const },
      { code: 'E111', message: 'indentation is not a multiple of four', severity: 'error' as const },
      { code: 'E112', message: 'expected an indented block', severity: 'error' as const },
      { code: 'E113', message: 'unexpected indentation', severity: 'error' as const },
      { code: 'E114', message: 'indentation is not a multiple of four (comment)', severity: 'error' as const },
      { code: 'E115', message: 'expected an indented block (comment)', severity: 'error' as const },
      { code: 'E116', message: 'expected an indented block (comment)', severity: 'error' as const },
      { code: 'E117', message: 'over-indented', severity: 'error' as const },
      { code: 'E201', message: 'whitespace after \'(\'', severity: 'error' as const },
      { code: 'E202', message: 'whitespace before \')\'', severity: 'error' as const },
      { code: 'E203', message: 'whitespace before \':\'', severity: 'error' as const },
      { code: 'E211', message: 'whitespace before \'(\'', severity: 'error' as const },
      { code: 'E221', message: 'multiple spaces before operator', severity: 'error' as const },
      { code: 'E222', message: 'multiple spaces after operator', severity: 'error' as const },
      { code: 'E223', message: 'tab before operator', severity: 'error' as const },
      { code: 'E224', message: 'tab after operator', severity: 'error' as const },
      { code: 'E225', message: 'missing whitespace around operator', severity: 'error' as const },
      { code: 'E226', message: 'missing whitespace around arithmetic operator', severity: 'error' as const },
      { code: 'E227', message: 'missing whitespace around bitwise or shift operator', severity: 'error' as const },
      { code: 'E228', message: 'missing whitespace around modulo operator', severity: 'error' as const },
      { code: 'E231', message: 'missing whitespace after \',\'', severity: 'error' as const },
      { code: 'E241', message: 'multiple spaces after \',\'', severity: 'error' as const },
      { code: 'E242', message: 'tab after \',\'', severity: 'error' as const },
      { code: 'E251', message: 'unexpected spaces around keyword / parameter equals', severity: 'error' as const },
      { code: 'E261', message: 'at least two spaces before inline comment', severity: 'error' as const },
      { code: 'E262', message: 'inline comment should start with \'# \'', severity: 'error' as const },
      { code: 'E265', message: 'block comment should start with \'# \'', severity: 'error' as const },
      { code: 'E266', message: 'too many leading \'#\' for block comment', severity: 'error' as const },
      { code: 'E271', message: 'multiple spaces after keyword', severity: 'error' as const },
      { code: 'E272', message: 'multiple spaces before keyword', severity: 'error' as const },
      { code: 'E273', message: 'tab after keyword', severity: 'error' as const },
      { code: 'E274', message: 'tab before keyword', severity: 'error' as const },
      { code: 'E275', message: 'missing whitespace after keyword', severity: 'error' as const },
      { code: 'E301', message: 'expected 1 blank line, found 0', severity: 'error' as const },
      { code: 'E302', message: 'expected 2 blank lines, found 0', severity: 'error' as const },
      { code: 'E303', message: 'too many blank lines (3)', severity: 'error' as const },
      { code: 'E304', message: 'blank lines found after function decorator', severity: 'error' as const },
      { code: 'E305', message: 'expected 2 blank lines after class or function definition', severity: 'error' as const },
      { code: 'E306', message: 'expected 1 blank line before a nested definition', severity: 'error' as const },
      { code: 'E401', message: 'multiple imports on one line', severity: 'error' as const },
      { code: 'E402', message: 'module level import not at top of file', severity: 'error' as const },
      { code: 'E501', message: 'line too long (89 > 79 characters)', severity: 'error' as const },
      { code: 'E502', message: 'the backslash is redundant between brackets', severity: 'error' as const },
      { code: 'E701', message: 'multiple statements on one line (colon)', severity: 'error' as const },
      { code: 'E702', message: 'multiple statements on one line (semicolon)', severity: 'error' as const },
      { code: 'E703', message: 'statement ends with a semicolon', severity: 'error' as const },
      { code: 'E704', message: 'multiple statements on one line (def)', severity: 'error' as const },
      { code: 'E711', message: 'comparison to None should be \'if cond is None:\'', severity: 'error' as const },
      { code: 'E712', message: 'comparison to True should be \'if cond is True:\' or \'if cond:\'', severity: 'error' as const },
      { code: 'E713', message: 'test for membership should be \'not in\'', severity: 'error' as const },
      { code: 'E714', message: 'test for object identity should be \'is not\'', severity: 'error' as const },
      { code: 'E721', message: 'do not compare types, use \'isinstance()\'', severity: 'error' as const },
      { code: 'E722', message: 'do not use bare \'except\'', severity: 'error' as const },
      { code: 'E731', message: 'do not assign a lambda expression, use a def', severity: 'error' as const },
      { code: 'E741', message: 'do not use variables named \'l\', \'O\', or \'I\'', severity: 'error' as const },
      { code: 'E742', message: 'do not define classes named \'l\', \'O\', or \'I\'', severity: 'error' as const },
      { code: 'E743', message: 'do not define functions named \'l\', \'O\', or \'I\'', severity: 'error' as const },
      { code: 'E901', message: 'SyntaxError or IndentationError', severity: 'error' as const },
      { code: 'E902', message: 'IOError', severity: 'error' as const },
      { code: 'E999', message: 'SyntaxError: invalid syntax', severity: 'error' as const },

      // F kodları (pyflakes - kullanılmayan import'lar, tanımlanmamış değişkenler)
      { code: 'F401', message: '\'module\' imported but unused', severity: 'error' as const },
      { code: 'F402', message: 'import \'module\' from line X shadowed by loop of line Y', severity: 'error' as const },
      { code: 'F403', message: 'star import used; unable to detect undefined names', severity: 'error' as const },
      { code: 'F404', message: 'future import(s) \'name\' after other statements', severity: 'error' as const },
      { code: 'F405', message: '\'name\' may be undefined, or defined from star imports: module', severity: 'error' as const },
      { code: 'F406', message: '\'name\' may be undefined, or defined from star imports: module', severity: 'error' as const },
      { code: 'F407', message: 'an undefined __future__ feature name was imported', severity: 'error' as const },
      { code: 'F601', message: 'dictionary key \'name\' repeated with different values', severity: 'error' as const },
      { code: 'F602', message: 'dictionary key \'name\' repeated with different values', severity: 'error' as const },
      { code: 'F621', message: 'too many expressions in an except clause', severity: 'error' as const },
      { code: 'F622', message: 'too many expressions in an except clause', severity: 'error' as const },
      { code: 'F631', message: 'except classes or tuples or BaseException subclasses expected, got \'name\'', severity: 'error' as const },
      { code: 'F632', message: 'except classes or tuples or BaseException subclasses expected, got \'name\'', severity: 'error' as const },
      { code: 'F701', message: 'a break statement outside of a for or while loop', severity: 'error' as const },
      { code: 'F702', message: 'a continue statement outside of a for or while loop', severity: 'error' as const },
      { code: 'F703', message: 'a break statement outside of a for or while loop', severity: 'error' as const },
      { code: 'F704', message: 'a continue statement outside of a for or while loop', severity: 'error' as const },
      { code: 'F705', message: 'a break statement outside of a for or while loop', severity: 'error' as const },
      { code: 'F706', message: 'a continue statement outside of a for or while loop', severity: 'error' as const },
      { code: 'F707', message: 'an except clause without a try', severity: 'error' as const },
      { code: 'F721', message: 'SyntaxError in doctest', severity: 'error' as const },
      { code: 'F722', message: 'SyntaxError in doctest', severity: 'error' as const },
      { code: 'F731', message: 'SyntaxError in doctest', severity: 'error' as const },
      { code: 'F732', message: 'SyntaxError in doctest', severity: 'error' as const },
      { code: 'F741', message: 'SyntaxError in doctest', severity: 'error' as const },
      { code: 'F742', message: 'SyntaxError in doctest', severity: 'error' as const },
      { code: 'F743', message: 'SyntaxError in doctest', severity: 'error' as const },
      { code: 'F811', message: 'redefinition of unused \'name\' from line X', severity: 'error' as const },
      { code: 'F812', message: 'redefinition of unused \'name\' from line X', severity: 'error' as const },
      { code: 'F821', message: 'undefined name \'name\'', severity: 'error' as const },
      { code: 'F822', message: 'undefined name \'name\'', severity: 'error' as const },
      { code: 'F823', message: 'undefined name \'name\'', severity: 'error' as const },
      { code: 'F831', message: 'undefined name \'name\'', severity: 'error' as const },
      { code: 'F841', message: 'local variable \'name\' is assigned to but never used', severity: 'error' as const },

      // W kodları (pycodestyle - uyarılar)
      { code: 'W191', message: 'indentation contains tabs', severity: 'warning' as const },
      { code: 'W291', message: 'trailing whitespace', severity: 'warning' as const },
      { code: 'W292', message: 'no newline at end of file', severity: 'warning' as const },
      { code: 'W293', message: 'blank line contains whitespace', severity: 'warning' as const },
      { code: 'W391', message: 'blank line at end of file', severity: 'warning' as const },
      { code: 'W503', message: 'line break before binary operator', severity: 'warning' as const },
      { code: 'W504', message: 'line break after binary operator', severity: 'warning' as const },
      { code: 'W505', message: 'line break before binary operator', severity: 'warning' as const },
      { code: 'W601', message: '.has_key() is deprecated, use \'in\'', severity: 'warning' as const },
      { code: 'W602', message: 'deprecated form of raising exception', severity: 'warning' as const },
      { code: 'W603', message: '\'<>\' is deprecated, use \'!=\'', severity: 'warning' as const },
      { code: 'W604', message: 'backticks are deprecated, use \'repr()\'', severity: 'warning' as const },
      { code: 'W605', message: 'invalid escape sequence \'x\'', severity: 'warning' as const },
      { code: 'W606', message: '\'async\' and \'await\' not allowed with \'as\'', severity: 'warning' as const },
      { code: 'W607', message: '\'async\' and \'await\' not allowed with \'as\'', severity: 'warning' as const },
      { code: 'W608', message: '\'async\' and \'await\' not allowed with \'as\'', severity: 'warning' as const },
      { code: 'W609', message: '\'async\' and \'await\' not allowed with \'as\'', severity: 'warning' as const },

      // C kodları (mccabe - kod karmaşıklığı)
      { code: 'C901', message: '\'function\' is too complex (10)', severity: 'warning' as const },

      // N kodları (naming conventions)
      { code: 'N801', message: 'class names should use CapWords convention', severity: 'naming' as const },
      { code: 'N802', message: 'function name should be lowercase', severity: 'naming' as const },
      { code: 'N803', message: 'argument name should be lowercase', severity: 'naming' as const },
      { code: 'N804', message: 'first argument of a classmethod should be named \'cls\'', severity: 'naming' as const },
      { code: 'N805', message: 'first argument of a method should be named \'self\'', severity: 'naming' as const },
      { code: 'N806', message: 'variable in function should be lowercase', severity: 'naming' as const },
      { code: 'N811', message: 'constant imported as non constant', severity: 'naming' as const },
      { code: 'N812', message: 'lowercase imported as non lowercase', severity: 'naming' as const },
      { code: 'N813', message: 'camelcase imported as lowercase', severity: 'naming' as const },
      { code: 'N814', message: 'camelcase imported as constant', severity: 'naming' as const },
      { code: 'N815', message: 'mixedCase variable in class scope', severity: 'naming' as const },
      { code: 'N816', message: 'mixedCase variable in global scope', severity: 'naming' as const },
      { code: 'N817', message: 'camelcase imported as acronym', severity: 'naming' as const },
      { code: 'N818', message: 'error suffix in exception names', severity: 'naming' as const },

      // Backend'deki özel hata kodları
      { code: 'E404', message: 'File not found', severity: 'error' as const },
      { code: 'E998', message: 'flake8 not found in container', severity: 'error' as const },
      { code: 'W000', message: 'No issues detected', severity: 'info' as const }
    ]

    // Backend'deki classify_severity fonksiyonuna uygun severity mapping
    const classifySeverity = (code: string): string => {
      if (!code) return "info"
      const prefix = code[0].toUpperCase()
      if (prefix === "F" || prefix === "E") return "error"
      else if (prefix === "W") return "warning"
      else if (prefix === "C") return "convention"
      else if (prefix === "N") return "naming"
      else return "info"
    }

    const issues: Issue[] = []
    const issueCount = Math.floor(Math.random() * 15) + 5 // 5-19 arası sorun

    for (let i = 0; i < issueCount; i++) {
      const issueType = issueTypes[Math.floor(Math.random() * issueTypes.length)]
      const turkishDetails = TurkishCodeAnalyzer.getIssueDetails(issueType.code)
      
      issues.push({
        code: issueType.code,
        message: issueType.message,
        line: Math.floor(Math.random() * 200) + 1,
        column: Math.floor(Math.random() * 80) + 1,
        severity: classifySeverity(issueType.code) as any,
        turkishExplanation: turkishDetails.turkishExplanation || issueType.message,
        badExample: turkishDetails.badExample || 'Örnek kod bulunamadı',
        goodExample: turkishDetails.goodExample || 'Düzeltilmiş kod bulunamadı',
        fixSuggestion: turkishDetails.fixSuggestion || 'Kodunuzu kontrol edin'
      })
    }

    return issues
  }

  // Mock rapor oluştur
  static generateMockReport(submissionId: string): DetailedReport {
    const issues = this.generateMockIssues()
    
    const errors = issues.filter(issue => issue.severity === 'error').length
    const warnings = issues.filter(issue => issue.severity === 'warning').length
    const infos = issues.filter(issue => issue.severity === 'info').length
    const totalIssues = errors + warnings + infos

    // Kalite skoru hesapla
    let codeQualityScore = 100
    codeQualityScore -= errors * 8 // Her hata -8 puan
    codeQualityScore -= warnings * 3 // Her uyarı -3 puan
    codeQualityScore -= infos * 1 // Her bilgi -1 puan
    codeQualityScore = Math.max(0, codeQualityScore)

    // Not hesapla
    let grade = 'F'
    if (codeQualityScore >= 90) grade = 'A'
    else if (codeQualityScore >= 80) grade = 'B'
    else if (codeQualityScore >= 70) grade = 'C'
    else if (codeQualityScore >= 60) grade = 'D'

    // Değerlendirme (Türkçe)
    let evaluation = 'Mükemmel kod kalitesi! 🎉'
    if (grade === 'A') evaluation = 'Mükemmel kod kalitesi! 🎉'
    else if (grade === 'B') evaluation = 'İyi kod kalitesi 👍'
    else if (grade === 'C') evaluation = 'Orta kod kalitesi ⚠️'
    else if (grade === 'D') evaluation = 'Ortalamanın altında kod kalitesi ❌'
    else evaluation = 'Kritik sorunlar ❌'

    return {
      submissionId,
      language: 'python',
      calculatedAt: new Date().toISOString(),
      summary: {
        errors,
        warnings,
        infos,
        totalIssues,
        codeQuality: `${codeQualityScore}/100`,
        grade,
        evaluation
      },
      issues
    }
  }

  // Mock dosya yükleme simülasyonu
  static async simulateFileUpload(file: File): Promise<{
    submissionId: string
    language: string
    fileName: string
    message: string
  }> {
    // 2-3 saniye bekle (gerçekçi yükleme simülasyonu)
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))

    const submissionId = this.generateSubmissionId()
    
    return {
      submissionId,
      language: 'python',
      fileName: file.name,
      message: `Dosya başarıyla yüklendi ve analiz için kuyruğa eklendi.`
    }
  }

  // Mock rapor alma simülasyonu
  static async simulateReportFetch(submissionId: string): Promise<DetailedReport> {
    // 3-5 saniye bekle (analiz simülasyonu)
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000))
    
    return this.generateMockReport(submissionId)
  }
}

export default MockReportService
