import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { usePDF } from '@react-pdf/renderer';
import CVPDFDocument from './CVPDFDocument';
import { cvStore } from '../../stores/cvStores';
import type { CVData } from '../../stores/cvStores';
import { cvStyleStore, FONT_OPTIONS, updateCVStyle } from '../../stores/cvStyleStores';
import type { CVStyle } from '../../stores/cvStyleStores';

import { Document as PDFDocument, Page as PDFPage, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const CVLivePreview: React.FC = () => {
  const rawData = useStore(cvStore);
  const rawStyle = useStore(cvStyleStore);

  const debouncedData = useDebounce<CVData>(rawData, 600);
  const debouncedStyle = useDebounce<CVStyle>(rawStyle, 600);

  const doc = useMemo(
    () => <CVPDFDocument data={debouncedData} fontFamilyCSS={debouncedStyle.fontFamily} />,
    [debouncedData, debouncedStyle]
  );

  const [instance, updateInstance] = usePDF({ document: doc });

  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    updateInstance(doc);
  }, [doc]); // eslint-disable-line react-hooks/exhaustive-deps

  // displayUrl hanya diupdate saat PDF selesai generate — tidak pernah null setelah pertama kali
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);

  useEffect(() => {
    if (instance.url && !instance.loading) {
      setDisplayUrl(instance.url);
    }
  }, [instance.url, instance.loading]);

  // Responsive width — throttled
  const [containerWidth, setContainerWidth] = useState<number | undefined>();
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!entries[0] || entries[0].contentRect.width <= 0) return;
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        setContainerWidth(Math.min(794, entries[0].contentRect.width - 20));
      }, 150);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => { observer.disconnect(); if (resizeTimer.current) clearTimeout(resizeTimer.current); };
  }, []);

  const [numPages, setNumPages] = useState<number | undefined>();
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCVStyle({ fontFamily: e.target.value });
  };

  const handleDownload = () => {
    if (!displayUrl) return;
    const userName = debouncedData.personalInfo.fullName?.trim() || 'CV';
    const safeFileName = userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const link = document.createElement('a');
    link.href = displayUrl;
    link.download = `${safeFileName}_CV.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isReady = !!displayUrl;

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
            disabled={!isReady || instance.loading}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md text-white transition-all shadow-sm ${
              (!isReady || instance.loading)
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

      {/* PDF Viewer */}
      <div
        ref={containerRef}
        className="cv-preview-container"
      >
        {isReady ? (
          <div className="relative w-full flex flex-col items-center">
            <PDFDocument
              file={displayUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading=""
              className="flex flex-col items-center gap-6"
            >
              {Array.from(new Array(numPages || 0), (_el, index) => (
                <PDFPage
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={containerWidth}
                  className="cv-page-shadow"
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                />
              ))}
            </PDFDocument>

            {instance.loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-start justify-center pt-20 z-10 pointer-events-none">
                <div className="bg-white px-5 py-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-blue-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm font-semibold text-gray-700">Merender PDF...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-400 flex flex-col items-center justify-center h-full min-h-[600px]">
            <svg className="animate-spin h-8 w-8 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-medium">Mempersiapkan Pratinjau...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVLivePreview;
