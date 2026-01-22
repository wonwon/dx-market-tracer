import { useState } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import AnalysisLinks from './components/AnalysisLinks';
import Notepad from './components/Notepad';

function App() {
  const [stockCode, setStockCode] = useState("7203"); // Default: Toyota

  return (
    <Layout
      header={
        <Header 
          currentCode={stockCode} 
          onCodeChange={setStockCode} 
        />
      }
      chart={null}
      sidebar={
        <div className="flex flex-col h-full">
            <AnalysisLinks code={stockCode} />
            <div className="flex-1 min-h-[300px]">
                <Notepad />
            </div>
        </div>
      }
    />
  );
}

export default App;
