import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePriceBoardStore } from '@/store/priceBoardStore';
import BoardCanvas from '@/components/BoardCanvas';
import ConfigPanel from '@/components/ConfigPanel';
import CalcPanel from '@/components/CalcPanel';
import { Layout, Layers, Coins } from 'lucide-react';

export default function PriceBoardEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const setPageId = usePriceBoardStore((s) => s.setPageId);
  const currentPageId = usePriceBoardStore((s) => s.pageId);
  const template = usePriceBoardStore((s) => s.template);

  useEffect(() => {
    if (pageId && pageId !== currentPageId) {
      setPageId(pageId);
    }
  }, [pageId, currentPageId, setPageId]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 flex flex-col">
      <header className="h-14 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Layers className="text-slate-900" size={22} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight leading-none">
                场馆价目公示牌编辑器
              </h1>
              <p className="text-[11px] text-slate-400 leading-none mt-1">
                Venue Price Board Editor · Live Preview
              </p>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-700 mx-2" />
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <Layout size={16} className="text-blue-400" />
            <span className="text-xs text-slate-400">当前页面:</span>
            <span className="text-sm font-black text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              #{pageId}
            </span>
            <span className="text-xs text-slate-500 mx-1">|</span>
            <Link
              to="/page/8879"
              className={`text-xs px-2 py-0.5 rounded-md transition-all ${
                pageId === '8879'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              8879
            </Link>
            <Link
              to="/page/3871"
              className={`text-xs px-2 py-0.5 rounded-md transition-all ${
                pageId === '3871'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              3871
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 font-bold text-sm ${
              template === 'weekend'
                ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                : 'bg-sky-500/20 border-sky-500 text-sky-300'
            }`}
          >
            <Coins size={16} />
            {template === 'weekend' ? '🌙 周末模板 · WEEKEND' : '☀️ 平日模板 · WEEKDAY'}
          </div>
          <div className="text-[11px] text-slate-500 text-right leading-tight">
            <div>💡 拖拽模块自由排版</div>
            <div>💾 数据自动本地存储</div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <CalcPanel />
        <BoardCanvas />
        <ConfigPanel />
      </div>
    </div>
  );
}
