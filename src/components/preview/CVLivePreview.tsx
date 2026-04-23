import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { usePDF } from '@react-pdf/renderer';
import CVPDFDocument from './CVPDFDocument';
import { cvStore } from '../../stores/cvStores';
import type { CVData } from '../../stores/cvStores';
import { cvStyleStore } from '../../stores/cvStyleStores';
import type { CVStyle } from '../../stores/cvStyleStores';
import { appLanguageStore } from '../../stores/i18nStore';

import { Document as PDFViewer, Page as PDFPage, pdfjs } from 'react-pdf';
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

// Each buffer holds its own PDFViewer with a stable URL — never re-loads
type Buffer = { url: string; pages: number; ready: boolean };

const CVLivePreview: React.FC = () => {
  const rawData = useStore(cvStore);
  const rawStyle = useStore(cvStyleStore);
  const language = useStore(appLanguageStore);

  const debouncedData = useDebounce<CVData>(rawData, 600);
  const debouncedStyle = useDebounce<CVStyle>(rawStyle, 600);

  const doc = useMemo(
    () => <CVPDFDocument data={debouncedData} styleConfig={debouncedStyle} language={language} />,
    [debouncedData, debouncedStyle, language]
  );

  const [instance, updateInstance] = usePDF({ document: doc });

  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    updateInstance(doc);
  }, [doc]); // eslint-disable-line react-hooks/exhaustive-deps

  // === Crossfade double-buffer ===
  const [bufferA, setBufferA] = useState<Buffer | null>(null);
  const [bufferB, setBufferB] = useState<Buffer | null>(null);
  const [activeBuffer, setActiveBuffer] = useState<'A' | 'B'>('A');
  const lastAssignedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!instance.url || instance.loading) return;
    if (instance.url === lastAssignedUrl.current) return;
    lastAssignedUrl.current = instance.url;

    const stagingBuffer = activeBuffer === 'A' ? 'B' : 'A';
    const newBuf: Buffer = { url: instance.url, pages: 0, ready: false };

    if (stagingBuffer === 'A') {
      setBufferA(newBuf);
    } else {
      setBufferB(newBuf);
    }
  }, [instance.url, instance.loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const onLoadSuccessA = useCallback(({ numPages }: { numPages: number }) => {
    setBufferA(prev => prev ? { ...prev, pages: numPages, ready: true } : prev);
    // If A is the staging buffer, promote it after a tick (let CSS transition start)
    setTimeout(() => setActiveBuffer('A'), 50);
  }, []);

  const onLoadSuccessB = useCallback(({ numPages }: { numPages: number }) => {
    setBufferB(prev => prev ? { ...prev, pages: numPages, ready: true } : prev);
    setTimeout(() => setActiveBuffer('B'), 50);
  }, []);

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

  const handleDownload = () => {
    const active = activeBuffer === 'A' ? bufferA : bufferB;
    if (!active?.url) return;
    const userName = debouncedData.personalInfo.fullName?.trim() || 'CV';
    const safeFileName = userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const link = document.createElement('a');
    link.href = active.url;
    link.download = `${safeFileName}_CV.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isReady = !!(bufferA?.ready || bufferB?.ready);
  const isUpdating = instance.loading || (activeBuffer === 'A' ? bufferB !== null && !bufferB.ready : bufferA !== null && !bufferA.ready);

  const renderPages = (pageCount: number) =>
    Array.from(new Array(pageCount), (_el, index) => (
      <PDFPage
        key={`page_${index + 1}`}
        pageNumber={index + 1}
        width={containerWidth}
        className="cv-page-shadow"
        renderTextLayer={true}
        renderAnnotationLayer={false}
      />
    ));

  const renderBuffer = (buffer: Buffer | null, isActive: boolean, onLoad: (args: { numPages: number }) => void) => {
    if (!buffer) return null;
    return (
      <div
        className="cv-buffer-layer"
        style={{
          opacity: isActive && buffer.ready ? 1 : 0,
          zIndex: isActive ? 2 : 1,
        }}
      >
        <PDFViewer
          file={buffer.url}
          onLoadSuccess={onLoad}
          loading=""
          className="flex flex-col items-center gap-6"
        >
          {renderPages(buffer.pages)}
        </PDFViewer>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Toolbar */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{language === 'id' ? 'Pratinjau' : 'Preview'}</h2>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/50">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            LIVE
          </div>
        </div>
        
        <div className="flex items-center gap-3">
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
            <span>{language === 'id' ? 'Unduh CV' : 'Download CV'}</span>
          </button>
        </div>
      </div>

      {/* PDF Viewer — crossfade double buffer */}
      <div
        ref={containerRef}
        className="cv-preview-container"
      >
        <div className="relative w-full flex-1">
          {renderBuffer(bufferA, activeBuffer === 'A', onLoadSuccessA)}
          {renderBuffer(bufferB, activeBuffer === 'B', onLoadSuccessB)}

          {!isReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 z-20">
              <svg className="animate-spin h-8 w-8 mb-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm font-medium text-gray-400">{language === 'id' ? 'Mempersiapkan Pratinjau...' : 'Preparing Preview...'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVLivePreview;
