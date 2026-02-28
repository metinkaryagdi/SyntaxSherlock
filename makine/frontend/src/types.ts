// Runtime hata tipi tanımı
export interface RuntimeError {
    type: 'ZeroDivisionError' | 'IndexError';
    message: string;
    line: number;
    column?: number;
    context?: string;
    severity: 'critical' | 'suspicious'; // Backend'den gelecek: kritik (kırmızı) veya şüpheli (sarı)
}

// Analiz sonucu tipi
export interface AnalysisResult {
    id: string;              // Benzersiz dosya ID'si
    filename: string;
    code: string;
    errors: RuntimeError[];
    analyzedAt: string;
}

// Analiz durumu tipi
export interface AnalysisState {
    isAnalyzing: boolean;
    result: AnalysisResult | null;
    error: string | null;
}
