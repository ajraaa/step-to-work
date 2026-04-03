import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { usePDF } from '@react-pdf/renderer';
import CVPDFDocument from './CVPDFDocument';
import { cvStore, cvStyleStore, FONT_OPTIONS, updateCVStyle } from '../../stores/cvStores';
import type { CVData, CVStyle } from '../../stores/cvStores';

// Setup react-pdf for rendering the PDF in the DOM
import { Document as PDFDocument, Page as PDFPage, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Inline simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const CVLivePreview: React.FC = () => {
  const rawData = useStore(cvStore);
  const rawStyle = useStore(cvStyleStore);

  const debouncedData = useDebounce<CVData>(rawData, 500);
  const debouncedStyle = useDebounce<CVStyle>(rawStyle, 500);

  const doc = <CVPDFDocument data={debouncedData} fontFamilyCSS={debouncedStyle.fontFamily} />;
  const [instance, updateInstance] = usePDF({ document: doc });

  useEffect(() => {
    updateInstance(doc);
  }, [debouncedData, debouncedStyle]);

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCVStyle({ fontFamily: e.target.value });
  };

  const handleDownload = () => {
    if (!instance.url) return;
    const userName = debouncedData.personalInfo.fullName?.trim() || 'CV';
    const safeFileName = userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\\s+/g, '_');
    
    const link = document.createElement('a');
    link.href = instance.url;
    link.download = `${safeFileName}_CV.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const [numPages, setNumPages] = useState<number>();
  
  // Responsive container width
  const [containerWidth, setContainerWidth] = useState<number>();
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0] && entries[0].contentRect.width > 0) {
        // Limit max width to 794 (A4) to avoid getting too big on large screens,
        // but shrink if the container is smaller. subtract safe padding.
        setContainerWidth(Math.min(794, entries[0].contentRect.width - 32));
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (instance.url) {
      setDisplayUrl(instance.url);
      setIsIframeLoading(true);
    }
  }, [instance.url]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setIsIframeLoading(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Toolbar */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Preview</h2>
        <div className="flex items-center gap-3">
          <select 
            className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 cursor-pointer transition-colors hover:border-gray-400"
            value={rawStyle.fontFamily}
            onChange={handleFontChange}
          >
            {FONT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          
          <button
            onClick={handleDownload}
            disabled={instance.loading || !instance.url}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md text-white transition-all shadow-sm ${
              (instance.loading || !instance.url)
                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 cursor-pointer'
            }`}
          >
            {instance.loading ? (
              <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            <span>Download CV</span>
          </button>
          
          <div className={`flex items-center gap-1.5 text-xs font-medium ${instance.loading ? 'text-blue-500' : 'text-emerald-600'}`}>
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${instance.loading ? 'bg-blue-400 animate-ping' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${instance.loading ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
            </span>
            {instance.loading ? 'Rendering...' : 'Live'}
          </div>
        </div>
      </div>

      {/* Embedded DOM PDF Viewer */}
      <div 
        ref={containerRef}
        className="w-full aspect-[1/1.414] bg-gray-50/50 rounded-xl overflow-y-auto overflow-x-hidden relative border border-gray-200/60 custom-scrollbar flex flex-col items-center py-6"
      >
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
          .react-pdf__Page__canvas { border-radius: 4px; }
        `}</style>
        
        {displayUrl ? (
          <div className="relative">
            <PDFDocument
              file={displayUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading=""
              className="flex flex-col items-center gap-6"
            >
              {Array.from(new Array(numPages || 0), (el, index) => (
                <PDFPage 
                  key={`page_${index + 1}`} 
                  pageNumber={index + 1} 
                  width={containerWidth}
                  className="shadow-[0_4px_24px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.04)] bg-white rounded-sm overflow-hidden"
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                />
              ))}
            </PDFDocument>

            {/* Loading Overlay */}
            {(instance.loading || isIframeLoading) && (
              <div className="absolute inset-0 bg-gray-50/60 backdrop-blur-[1.5px] flex flex-col items-center justify-center z-10 transition-all rounded-md">
                <div className="bg-white px-6 py-4 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center sticky top-1/2 -translate-y-1/2">
                  <svg className="animate-spin h-8 w-8 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm font-bold text-gray-700 tracking-wide">Merender UI...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-400 flex flex-col items-center justify-center h-full min-h-[400px]">
             <svg className="animate-spin h-8 w-8 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm">Mempersiapkan Pratinjau...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVLivePreview;
