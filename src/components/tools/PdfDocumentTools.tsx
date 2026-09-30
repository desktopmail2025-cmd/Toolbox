import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { sounds } from '../../utils/audio';
import { Download, Upload, Trash2, PenTool, Eye, FileText } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const PdfDocumentTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'pdf-images-to-pdf':
      return <ImagesToPdfView />;
    case 'pdf-text-to-pdf':
      return <TextToPdfView />;
    case 'pdf-signature-pad':
      return <SignaturePadView />;
    case 'pdf-viewer-info':
      return <PdfViewerInfoView />;
    default:
      return <ImagesToPdfView />;
  }
};

// 1. Images to PDF Converter
interface ImageDoc {
  id: string;
  name: string;
  dataUrl: string;
}

const ImagesToPdfView: React.FC = () => {
  const [images, setImages] = useState<ImageDoc[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [margin, setMargin] = useState(10); // mm

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    sounds.playClick();

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        setImages(prev => [
          ...prev,
          { id: String(Date.now() + Math.random()), name: file.name, dataUrl: ev.target?.result as string },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImg = (id: string) => {
    sounds.playClick();
    setImages(images.filter(img => img.id !== id));
  };

  const exportPdf = () => {
    if (images.length === 0) return;
    sounds.playSuccess();

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: pageSize,
    });

    const pageWidth = pageSize === 'a4' ? 210 : 215.9;
    const pageHeight = pageSize === 'a4' ? 297 : 279.4;
    const availWidth = pageWidth - margin * 2;
    const availHeight = pageHeight - margin * 2;

    images.forEach((img, idx) => {
      if (idx > 0) pdf.addPage();
      pdf.addImage(img.dataUrl, 'JPEG', margin, margin, availWidth, availHeight, undefined, 'FAST');
    });

    pdf.save('omni-converted-document.pdf');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Upload Photos to Convert into PDF
        </label>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png"
          onChange={handleUpload}
          className="text-xs text-zinc-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white dark:file:bg-zinc-100 dark:file:text-zinc-950"
        />

        <div className="flex gap-4 pt-2">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Page Format</label>
            <select
              value={pageSize}
              onChange={e => setPageSize(e.target.value as any)}
              className="border rounded-xl p-2 text-xs font-semibold bg-white dark:bg-zinc-950 dark:border-zinc-700"
            >
              <option value="a4">Standard A4 (210 × 297 mm)</option>
              <option value="letter">US Letter (8.5 × 11 in)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Page Margins</label>
            <select
              value={margin}
              onChange={e => setMargin(parseInt(e.target.value))}
              className="border rounded-xl p-2 text-xs font-semibold bg-white dark:bg-zinc-950 dark:border-zinc-700"
            >
              <option value={5}>Minimal (5mm)</option>
              <option value={10}>Standard (10mm)</option>
              <option value={20}>Wide (20mm)</option>
            </select>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-zinc-500">Document Pages ({images.length})</span>
            <button
              onClick={exportPdf}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" /> Download PDF Document
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={img.id} className="relative rounded-xl border p-2 bg-zinc-50 dark:bg-zinc-950 group">
                <img src={img.dataUrl} alt="Page" className="h-28 w-full object-cover rounded-lg" />
                <span className="absolute top-3 left-3 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                  #{i + 1}
                </span>
                <button
                  onClick={() => removeImg(img.id)}
                  className="absolute top-3 right-3 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Text & Notes to PDF
const TextToPdfView: React.FC = () => {
  const [docTitle, setDocTitle] = useState('Meeting Notes & Project Action Items');
  const [docBody, setDocBody] = useState(
    'Date: September 2026\n\n1. Project Scope & Architecture\n- Client-side responsive performance for all devices (Android, iOS, PC).\n- Offline privacy and zero telemetry.\n\n2. Key Deliverables\n- Verified calculations across 14 utility categories.\n- Modern aesthetic with clean typography.'
  );

  const exportPdf = () => {
    sounds.playSuccess();
    const pdf = new jsPDF();
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text(docTitle, 15, 20);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    const splitText = pdf.splitTextToSize(docBody, 180);
    pdf.text(splitText, 15, 32);

    pdf.save(`${docTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Document Header / Title</label>
          <input
            type="text"
            value={docTitle}
            onChange={e => setDocTitle(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1">Document Content</label>
          <textarea
            rows={10}
            value={docBody}
            onChange={e => setDocBody(e.target.value)}
            className="w-full border rounded-xl p-3 text-sm font-sans bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>

        <button
          onClick={exportPdf}
          className="w-full py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 hover:opacity-90"
        >
          <Download className="w-4 h-4" /> Export as PDF Document
        </button>
      </div>
    </div>
  );
};

// 3. Digital Signature & Stamp Pad
const SignaturePadView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#09090b');

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearPad = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadSignature = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-zinc-500">Sign with finger or stylus</span>
          <div className="flex items-center gap-2">
            {(['#09090b', '#2563eb', '#16a34a'] as const).map(color => (
              <button
                key={color}
                onClick={() => setPenColor(color)}
                style={{ backgroundColor: color }}
                className={`w-6 h-6 rounded-full border-2 ${penColor === color ? 'border-zinc-400 scale-110' : 'border-transparent'}`}
              />
            ))}
          </div>
        </div>

        {/* Signature Canvas */}
        <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/50 p-2 overflow-hidden touch-none">
          <canvas
            ref={canvasRef}
            width={500}
            height={220}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
            className="w-full h-48 block cursor-crosshair"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={clearPad}
            className="px-3 py-1.5 border rounded-xl text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Clear Signature
          </button>
          <button
            onClick={downloadSignature}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold text-xs rounded-xl"
          >
            <Download className="w-3.5 h-3.5" /> Download Transparent PNG
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. PDF Viewer & Metadata
const PdfViewerInfoView: React.FC = () => {
  const [fileInfo, setFileInfo] = useState<Record<string, string | number> | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sounds.playClick();
    setFileInfo({
      'Document Name': file.name,
      'File Size': `${(file.size / 1024).toFixed(1)} KB`,
      'Type': 'Portable Document Format (.pdf)',
      'Last Modified': new Date(file.lastModified).toLocaleDateString(),
    });
    setFileUrl(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Upload PDF to Inspect Details & Preview
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          className="text-xs text-zinc-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white dark:file:bg-zinc-100 dark:file:text-zinc-950"
        />
      </div>

      {fileInfo && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">PDF Information</h4>
            {Object.entries(fileInfo).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-xs">
                <span className="text-zinc-500">{k}</span>
                <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{v}</span>
              </div>
            ))}
          </div>

          {fileUrl && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden shadow-sm">
              <iframe src={fileUrl} className="w-full h-96 rounded-xl border-0" title="PDF Document Viewer" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
