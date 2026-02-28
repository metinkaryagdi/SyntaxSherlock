import type { AnalysisResult, RuntimeError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Backend'den gelen RiskDetail formatı
export interface RiskDetail {
    lineno: number;
    code: string;
    type: string; // Division / Index
    risk_score: number;
    message: string;
    definite_error: boolean;
}

// Backend'den gelen FileAnalysisResult formatı
export interface FileAnalysisResult {
    filename: string;
    status: string; // success / error
    risks: RiskDetail[];
    error?: string;
}

// Backend'den gelen AnalysisResponse formatı
export interface BackendAnalysisResponse {
    results: FileAnalysisResult[];
}

/**
 * Backend RiskDetail'i Frontend RuntimeError'a dönüştürür
 */
const convertRiskToError = (risk: RiskDetail): RuntimeError => {
    // Hata tipini belirle
    let errorType: 'ZeroDivisionError' | 'IndexError';
    if (risk.type === 'Division') {
        errorType = 'ZeroDivisionError';
    } else {
        errorType = 'IndexError';
    }

    // Severity'yi risk skoruna göre belirle
    let severity: 'critical' | 'suspicious';
    if (risk.definite_error || risk.risk_score >= 0.8) {
        severity = 'critical';
    } else {
        severity = 'suspicious';
    }

    return {
        type: errorType,
        message: risk.message,
        line: risk.lineno,
        context: risk.code,
        severity: severity
    };
};

/**
 * Backend'e Python dosyası gönderir ve runtime hata analizi yapar
 * Her dosya için AYRI AYRI istek atar
 */
export const analyzePythonCode = async (file: File): Promise<AnalysisResult> => {
    try {
        const formData = new FormData();
        formData.append('files', file);

        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.detail || 
                errorData.message || 
                `Backend hatası: ${response.status} ${response.statusText}`
            );
        }

        const data: BackendAnalysisResponse = await response.json();

        // İlk dosyanın sonucunu al (tek dosya gönderdiğimiz için)
        const fileResult = data.results[0];

        if (!fileResult) {
            throw new Error('Backend\'ten sonuç alınamadı');
        }

        // Eğer backend'de hata varsa
        if (fileResult.status === 'error') {
            throw new Error(fileResult.error || 'Dosya analiz edilemedi');
        }

        // Dosya içeriğini oku
        const code = await file.text();

        // Risk'leri RuntimeError'a dönüştür
        const errors: RuntimeError[] = fileResult.risks
            .filter(risk => risk.risk_score >= 0.3 || risk.definite_error) // Sadece önemli riskleri göster
            .map(convertRiskToError);

        return {
            id: `${file.name}-${Date.now()}`,
            filename: fileResult.filename || file.name,
            code: code,
            errors: errors,
            analyzedAt: new Date().toISOString(),
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Analiz hatası: ${error.message}`);
        }
        throw new Error('Bilinmeyen bir hata oluştu');
    }
};

/**
 * Backend'in çalışıp çalışmadığını kontrol eder
 */
export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/`, {
            method: 'GET',
        });
        return response.ok;
    } catch {
        return false;
    }
};

