import React from 'react';
import { useStore } from '@nanostores/react';
import { cvStyleStore, updateCVStyle, FONT_OPTIONS } from '../../stores/cvStyleStores';

const CVCustomization: React.FC = () => {
  const style = useStore(cvStyleStore);

  return (
    <div className="flex flex-col gap-7 p-5">
      
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-base font-semibold text-gray-800">Visual Styling</h3>
        <p className="text-xs text-gray-500 mt-1">Adjust typography, spacing, and layout to make your CV stand out.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="text-sm font-medium text-gray-700 tracking-wide">Typography / Font Family</label>
        <select
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-gray-400 transition-colors cursor-pointer"
          value={style.fontFamily}
          onChange={(e) => updateCVStyle({ fontFamily: e.target.value })}
        >
          {FONT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700 tracking-wide">Font Size Offset</label>
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            {style.fontSizeOffset > 0 ? `+${style.fontSizeOffset}` : style.fontSizeOffset}
          </span>
        </div>
        <div className="relative pt-1">
          <input 
            type="range" 
            min="-2" max="4" step="0.5" 
            value={style.fontSizeOffset} 
            onChange={(e) => updateCVStyle({ fontSizeOffset: parseFloat(e.target.value) })}
            className="w-full accent-blue-600 cursor-pointer relative z-10"
          />
          <div 
            className="absolute top-0 w-0.5 h-4 bg-gray-300 rounded-full -translate-x-1/2" 
            style={{ left: '33.33%' }} 
            title="Default"
          />
        </div>
        <div className="flex justify-between text-[11px] font-medium text-gray-400 uppercase tracking-wider">
          <span>Smaller</span>
          <span>Larger</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700 tracking-wide">Line Height</label>
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{style.lineHeight}</span>
        </div>
        <div className="relative pt-1">
          <input 
            type="range" 
            min="1.0" max="2.0" step="0.1" 
            value={style.lineHeight} 
            onChange={(e) => updateCVStyle({ lineHeight: parseFloat(e.target.value) })}
            className="w-full accent-blue-600 cursor-pointer relative z-10"
          />
          <div 
            className="absolute top-0 w-0.5 h-4 bg-gray-300 rounded-full -translate-x-1/2" 
            style={{ left: '40%' }} 
            title="Default"
          />
        </div>
        <div className="flex justify-between text-[11px] font-medium text-gray-400 uppercase tracking-wider">
          <span>Compact</span>
          <span>Relaxed</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700 tracking-wide">Page Padding</label>
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{style.pagePadding}px</span>
        </div>
        <div className="relative pt-1">
          <input 
            type="range" 
            min="15" max="50" step="1" 
            value={style.pagePadding} 
            onChange={(e) => updateCVStyle({ pagePadding: parseInt(e.target.value) })}
            className="w-full accent-blue-600 cursor-pointer relative z-10"
          />
          <div 
            className="absolute top-0 w-0.5 h-4 bg-gray-300 rounded-full -translate-x-1/2" 
            style={{ left: '42.86%' }} 
            title="Default"
          />
        </div>
        <div className="flex justify-between text-[11px] font-medium text-gray-400 uppercase tracking-wider">
          <span>Narrow</span>
          <span>Wide</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700 tracking-wide">Section Spacing (Margin)</label>
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{style.sectionSpacing}px</span>
        </div>
        <div className="relative pt-1">
          <input 
            type="range" 
            min="2" max="16" step="1" 
            value={style.sectionSpacing} 
            onChange={(e) => updateCVStyle({ sectionSpacing: parseInt(e.target.value) })}
            className="w-full accent-blue-600 cursor-pointer relative z-10"
          />
          <div 
            className="absolute top-0 w-0.5 h-4 bg-gray-300 rounded-full -translate-x-1/2" 
            style={{ left: '42.86%' }} 
            title="Default"
          />
        </div>
        <div className="flex justify-between text-[11px] font-medium text-gray-400 uppercase tracking-wider">
          <span>Tight</span>
          <span>Spacious</span>
        </div>
      </div>

    </div>
  );
};

export default CVCustomization;
