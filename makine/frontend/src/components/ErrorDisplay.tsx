import React, { useState, useRef, useEffect } from 'react';
import type { RuntimeError } from '../types';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
    errors: RuntimeError[];
    code: string;
    filename: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors, code, filename }) => {
    const codeLines = code.split('\n');
    const [selectedError, setSelectedError] = useState<number | null>(null);
    const codeLineRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const codeContentRef = useRef<HTMLDivElement | null>(null);

    const scrollToLine = (lineNumber: number) => {
        const lineElement = codeLineRefs.current[lineNumber];
        const codeContent = codeContentRef.current;
        
        if (lineElement && codeContent) {
            // Önce line element'in container içindeki konumunu al
            const containerRect = codeContent.getBoundingClientRect();
            const lineRect = lineElement.getBoundingClientRect();
            
            // Line'ın container içindeki relative pozisyonu
            const relativeTop = lineRect.top - containerRect.top;
            
            // Mevcut scroll pozisyonu
            const currentScroll = codeContent.scrollTop;
            
            // Container yüksekliği
            const containerHeight = codeContent.clientHeight;
            
            // Line'ı ortaya getirmek için gerekli scroll pozisyonu
            const targetScroll = currentScroll + relativeTop - (containerHeight / 2) + (lineRect.height / 2);
            
            codeContent.scrollTo({
                top: Math.max(0, targetScroll),
                behavior: 'smooth'
            });
        }
    };

    const handleErrorClick = (index: number, lineNumber: number) => {
        setSelectedError(index);
        // Scroll işlemini biraz geciktir ki state güncellensin
        setTimeout(() => scrollToLine(lineNumber), 100);
    };

    useEffect(() => {
        // İlk hatayı otomatik seç ve scroll et
        if (errors.length > 0 && selectedError === null) {
            setSelectedError(0);
            // İlk hatanın satırına scroll et
            setTimeout(() => scrollToLine(errors[0].line), 200);
        }
    }, [errors, selectedError]);

    const getErrorIcon = (type: string) => {
        switch (type) {
            case 'ZeroDivisionError':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                );
            case 'IndexError':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                );
            default:
                return null;
        }
    };

    // ÖNEMLİ: Renk hata TİPİNE göre değil, SEVERITY'ye (kritiklik seviyesi) göre belirlenir!
    // Aynı tip hata (örn: ZeroDivisionError) farklı renklerde olabilir.
    // Backend'den gelen severity değerine göre renk seçilir.
    const getErrorColor = (severity: 'critical' | 'suspicious') => {
        switch (severity) {
            case 'critical':
                return '#dc3545'; // Kırmızı - Kritik hatalar (%80+ emin)
            case 'suspicious':
                return '#ffc107'; // Sarı - Şüpheli hatalar (%50-80 arası)
            default:
                return '#dc3545';
        }
    };

    return (
        <div className="error-display-container animate-fade-in">
            {/* Header */}
            <div className="error-header glass-card">
                <div className="error-header-content">
                    <div className="file-info">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <div>
                            <h3>{filename}</h3>
                            <p>{codeLines.length} satır • {errors.length} hata</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="error-display-grid">
                {/* Left Side - Errors List */}
                <div className="errors-panel">
                    <h3 className="panel-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Hatalar ({errors.length})
                    </h3>

                    <div className="errors-list">
                        {errors.map((error, index) => (
                            <div
                                key={index}
                                className={`error-item ${selectedError === index ? 'error-item-selected' : ''}`}
                                onClick={() => handleErrorClick(index, error.line)}
                            >
                                <div className="error-item-header">
                                    <div className="error-type-badge" style={{ 
                                        background: `${getErrorColor(error.severity)}15`, 
                                        color: getErrorColor(error.severity),
                                        borderColor: getErrorColor(error.severity)
                                    }}>
                                        {getErrorIcon(error.type)}
                                        <span>{error.type}</span>
                                    </div>
                                    <div className="error-line-badge" style={{
                                        background: `${getErrorColor(error.severity)}10`,
                                        color: getErrorColor(error.severity),
                                        borderLeft: `2px solid ${getErrorColor(error.severity)}`
                                    }}>
                                        Satır {error.line}
                                    </div>
                                </div>
                                <div className="error-item-message">
                                    {error.message}
                                </div>
                                {error.context && (
                                    <div className="error-item-context">
                                        <code>{error.context}</code>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Code Viewer */}
                <div className="code-panel">
                    <div className="code-panel-header">
                        <h3 className="panel-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="16 18 22 12 16 6" />
                                <polyline points="8 6 2 12 8 18" />
                            </svg>
                            Kaynak Kod
                        </h3>
                    </div>

                    <div className="code-content" ref={codeContentRef}>
                        {codeLines.map((line, index) => {
                            const lineNumber = index + 1;
                            const errorIndex = errors.findIndex(err => err.line === lineNumber);
                            const hasError = errorIndex !== -1;
                            const isSelectedError = hasError && selectedError === errorIndex;
                            const errorForLine = hasError ? errors[errorIndex] : null;

                            return (
                                <div
                                    key={index}
                                    ref={(el) => { codeLineRefs.current[lineNumber] = el; }}
                                    className={`code-line ${hasError ? 'code-line-error' : ''} ${isSelectedError ? 'code-line-selected' : ''}`}
                                    style={hasError && errorForLine ? {
                                        background: `${getErrorColor(errorForLine.severity)}08`,
                                        borderLeftColor: getErrorColor(errorForLine.severity)
                                    } : {}}
                                >
                                    <span className="code-line-number">{lineNumber}</span>
                                    <span className="code-line-content">{line || ' '}</span>
                                    {hasError && errorForLine && (
                                        <div className="inline-error-indicator" style={{ background: getErrorColor(errorForLine.severity) }}>
                                            {getErrorIcon(errorForLine.type)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;
