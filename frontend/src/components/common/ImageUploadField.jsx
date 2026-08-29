import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, X, Link as LinkIcon, Check, AlertCircle, FileImage } from 'lucide-react';
import { validateImageFile, MAX_FILE_SIZE_BYTES } from '../../services/storageService';

/**
 * 🎨 ImageUploadField Component
 * Mendukung Upload File Fisik (Drag & Drop + Picker) dan Direct URL Input
 * Terhubung langsung dengan Supabase Storage Architecture
 */
export default function ImageUploadField({ 
  value = '', 
  file = null, 
  onChangeFile, 
  onChangeUrl, 
  required = false,
  label = 'Foto Dokumentasi Karya Seni',
  maxSizeMB = 2 
}) {
  const [activeMode, setActiveMode] = useState(file ? 'file' : (value && !value.startsWith('data:') ? 'url' : 'file'));
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileDetails, setFileDetails] = useState(null);

  const fileInputRef = useRef(null);

  // Generate preview when file or url changes
  useEffect(() => {
    if (file && (file instanceof File || file instanceof Blob)) {
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
      setFileDetails({
        name: file.name || 'image.png',
        sizeMB: (file.size / (1024 * 1024)).toFixed(2),
        type: file.type || 'image/jpeg',
      });
      return () => URL.revokeObjectURL(objUrl);
    } else if (value) {
      setPreviewUrl(value);
      setFileDetails(null);
    } else {
      setPreviewUrl('');
      setFileDetails(null);
    }
  }, [file, value]);

  const handleFileSelect = (selectedFile) => {
    setValidationError(null);
    if (!selectedFile) return;

    const validation = validateImageFile(selectedFile, maxSizeMB * 1024 * 1024);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    onChangeFile && onChangeFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClearImage = () => {
    onChangeFile && onChangeFile(null);
    onChangeUrl && onChangeUrl('');
    setPreviewUrl('');
    setFileDetails(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      
      {/* Header Label & Mode Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <label className="block text-xs font-bold text-black">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Mode Toggle (File Upload vs Direct URL) */}
        <div className="flex items-center bg-[#FAF7EE] p-1 rounded-xl border border-black/30 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMode('file')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeMode === 'file'
                ? 'bg-black text-[#FFE600] shadow-retro-sm'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File (Storage)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeMode === 'url'
                ? 'bg-black text-[#FFE600] shadow-retro-sm'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Link URL</span>
          </button>
        </div>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-3 bg-red-100 border-2 border-red-400 rounded-xl text-xs text-red-800 font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* MODE 1: FILE DRAG & DROP / PICKER */}
      {activeMode === 'file' && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          {!previewUrl ? (
            <div
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-[#FF3388] bg-[#FF3388]/10 scale-[1.01]'
                  : 'border-black/40 bg-white hover:bg-[#FAF7EE] hover:border-black'
              }`}
            >
              <div className="w-12 h-12 bg-[#FAF7EE] border-2 border-black rounded-2xl mx-auto flex items-center justify-center shadow-retro-sm mb-3">
                <UploadCloud className="w-6 h-6 text-neutral-700" />
              </div>
              <div className="space-y-1">
                <p className="font-display font-black text-sm text-black">
                  Tarik & Letakkan Foto di Sini, atau <span className="text-[#FF3388] underline">Pilih File</span>
                </p>
                <p className="text-[11px] text-neutral-500 font-medium">
                  Format: JPG, PNG, WEBP, GIF (Maks. {maxSizeMB} MB). File otomatis diunggah ke Supabase Storage.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white border-2 border-black rounded-2xl flex flex-col sm:flex-row items-center gap-4 shadow-retro-sm">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-black bg-neutral-900 shrink-0 relative group">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="space-y-1.5 flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="bg-[#22C55E] text-white text-[10px] font-black px-2 py-0.5 rounded border border-black inline-flex items-center gap-1">
                    <Check className="w-3 h-3" /> SIAP UNGGAH
                  </span>
                  {fileDetails?.sizeMB && (
                    <span className="text-[11px] font-mono font-bold text-neutral-600 bg-[#FAF7EE] px-2 py-0.5 rounded border border-black/20">
                      {fileDetails.sizeMB} MB
                    </span>
                  )}
                </div>

                <h5 className="font-display font-bold text-sm text-black truncate">
                  {fileDetails?.name || 'Foto Karya Terpilih'}
                </h5>
                <p className="text-[11px] text-neutral-500">
                  Gambar akan otomatis disimpan ke Supabase Storage saat Anda menekan tombol simpan.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="btn-retro-yellow text-xs px-3 py-1.5 font-bold"
                >
                  Ganti File
                </button>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200"
                  title="Hapus Gambar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: DIRECT URL INPUT */}
      {activeMode === 'url' && (
        <div className="space-y-3">
          <input
            type="url"
            value={value || ''}
            onChange={(e) => {
              setValidationError(null);
              onChangeUrl && onChangeUrl(e.target.value);
            }}
            placeholder="https://images.unsplash.com/photo-... atau https://xyz.supabase.co/storage/..."
            required={required && !file}
            className="input-retro text-xs sm:text-sm bg-white font-mono"
          />

          {value && (
            <div className="p-3 bg-white border-2 border-black rounded-xl flex items-center gap-3">
              <img 
                src={value} 
                alt="Direct Preview" 
                className="w-14 h-14 object-cover rounded-lg border border-black shrink-0" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80';
                }}
              />
              <div className="text-[11px] text-neutral-600 flex-1 min-w-0">
                <span className="font-bold text-black block">Live URL Preview</span>
                <span className="font-mono text-[10px] text-neutral-400 truncate block">{value}</span>
              </div>
              <button
                type="button"
                onClick={handleClearImage}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200"
                title="Hapus URL"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
