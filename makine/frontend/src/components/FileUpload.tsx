import React, { useCallback, useState } from 'react';
import './FileUpload.css';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isAnalyzing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isAnalyzing }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const pyFiles = files.filter(file => file.name.endsWith('.py'));
        
        if (pyFiles.length === 0) {
            alert('Lütfen sadece Python (.py) dosyası yükleyin!');
            return;
        }

        if (pyFiles.length !== files.length) {
            alert('Bazı dosyalar Python dosyası olmadığı için atlandı.');
        }

        // Her dosyayı sırayla yükle
        for (const file of pyFiles) {
            setSelectedFileName(file.name);
            onFileSelect(file);
            // Bir sonraki dosyayı yüklemeden önce kısa bir bekleme
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }, [onFileSelect]);

    const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const pyFiles = fileArray.filter(file => file.name.endsWith('.py'));
        
        if (pyFiles.length === 0) {
            alert('Lütfen sadece Python (.py) dosyası yükleyin!');
            return;
        }

        if (pyFiles.length !== fileArray.length) {
            alert('Bazı dosyalar Python dosyası olmadığı için atlandı.');
        }

        // Her dosyayı sırayla yükle
        for (const file of pyFiles) {
            setSelectedFileName(file.name);
            onFileSelect(file);
            // Bir sonraki dosyayı yüklemeden önce kısa bir bekleme
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Input'u temizle (aynı dosyayı tekrar seçebilmek için)
        e.target.value = '';
    }, [onFileSelect]);

    return (
        <div className="file-upload-container animate-slide-down">
            <div
                className={`file-upload-zone ${isDragging ? 'dragging' : ''} ${isAnalyzing ? 'analyzing' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-input"
                    accept=".py"
                    multiple
                    onChange={handleFileInput}
                    disabled={isAnalyzing}
                    style={{ display: 'none' }}
                />

                <div className="upload-icon">
                    {isAnalyzing ? (
                        <div className="spinner"></div>
                    ) : (
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    )}
                </div>

                <h2 className="upload-title">
                    {isAnalyzing ? 'Kod Analiz Ediliyor...' : 'Python Dosyası Yükle'}
                </h2>

                <p className="upload-description">
                    {isAnalyzing
                        ? 'Runtime hataları tespit ediliyor'
                        : 'Dosyalarınızı sürükleyip bırakın veya tıklayarak seçin (birden fazla dosya seçebilirsiniz)'
                    }
                </p>

                {selectedFileName && !isAnalyzing && (
                    <div className="selected-file animate-scale-in">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span>{selectedFileName}</span>
                    </div>
                )}

                {!isAnalyzing && (
                    <label htmlFor="file-input" className="btn btn-primary">
                        <span>Dosya Seç</span>
                    </label>
                )}

                {isAnalyzing && (
                    <div className="analyzing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
            </div>

            <div className="supported-formats">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Desteklenen format: <strong>.py</strong> (Python dosyaları)</span>
            </div>
        </div>
    );
};

export default FileUpload;
