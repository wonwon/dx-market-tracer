import React, { type ReactNode } from 'react';

type Props = {
  header: ReactNode;
  chart: ReactNode;
  sidebar: ReactNode;
};

const Layout: React.FC<Props> = ({ header, chart, sidebar }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header Area */}
      <div className="flex-none z-10">
        {header}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Chart Area (Only render if chart is provided) */}
        {chart && (
          <div className="flex-[7] bg-gray-800 rounded-xl shadow-inner border border-gray-700 overflow-hidden relative">
            {chart}
          </div>
        )}

        {/* Sidebar Area (Expand if chart is missing) */}
        <div className={`flex flex-col min-w-[300px] overflow-y-auto pr-2 ${chart ? 'flex-[3]' : 'flex-1 max-w-4xl mx-auto w-full'}`}>
          {sidebar}
        </div>
      </div>
    </div>
  );
};

export default Layout;
