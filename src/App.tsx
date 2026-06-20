import { useEffect, useState } from 'react';
import PriceBoardEditor from "@/pages/PriceBoardEditor";

function App() {
  const [pageId, setPageId] = useState('8879');
  
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/#\/page\/(\d+)/);
    if (match) {
      setPageId(match[1]);
    }
    
    const handleHashChange = () => {
      const newHash = window.location.hash;
      const newMatch = newHash.match(/#\/page\/(\d+)/);
      if (newMatch) {
        setPageId(newMatch[1]);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!pageId) {
    return <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white text-xl">加载中...</div>;
  }

  return <PriceBoardEditorWrapper pageId={pageId} />;
}

function PriceBoardEditorWrapper({ pageId }: { pageId: string }) {
  return <PriceBoardEditor key={pageId} />;
}

export default App;
