
import React from 'react';
import type { BriefingData } from '../types';

const BriefingDisplay: React.FC<BriefingData> = ({ briefing, sources }) => {
  const formatBriefingText = (text: string) => {
    // Basic markdown-like formatting for display
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold mt-6 mb-2 text-slate-700">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-8 mb-3 text-slate-800 border-b pb-2">{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) {
            return <h1 key={index} className="text-3xl font-bold mt-4 mb-4 text-slate-900">{line.substring(2)}</h1>;
        }
        if (line.startsWith('* ')) {
          return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        }
        if (line.trim() === '') {
            return <br key={index} />;
        }
        return <p key={index} className="text-slate-600 leading-relaxed mb-4">{line}</p>;
      });
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden animate-fade-in">
      <div className="p-6 md:p-10 font-serif">
        {formatBriefingText(briefing)}
      </div>

      {sources && sources.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 p-6 md:p-8">
          <h3 className="text-lg font-bold text-slate-700 mb-4 font-sans">뉴스 출처 (Powered by Google Search)</h3>
          <ul className="space-y-3">
            {sources.map((source, index) => (
              <li key={index}>
                <a
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 font-sans"
                >
                  {source.web.title}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BriefingDisplay;
