
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 font-serif">
        AI 스타트업 뉴스 브리핑
      </h1>
      <p className="text-slate-500 mt-2">
        매일 아침, AI가 분석한 대한민국 창업 뉴스 요약
      </p>
    </header>
  );
};

export default Header;
