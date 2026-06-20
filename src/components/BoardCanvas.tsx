import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/types/priceBoard';
import { usePriceBoardStore } from '@/store/priceBoardStore';
import DraggableModule from './DraggableModule';

export default function BoardCanvas() {
  const modules = usePriceBoardStore((s) => s.modules);
  const template = usePriceBoardStore((s) => s.template);
  const pageId = usePriceBoardStore((s) => s.pageId);
  const setSelectedModule = usePriceBoardStore((s) => s.setSelectedModule);

  const bgGradient =
    template === 'weekend'
      ? 'linear-gradient(180deg, #7f1d1d 0%, #991b1b 30%, #78350f 70%, #451a03 100%)'
      : 'linear-gradient(180deg, #0c4a6e 0%, #075985 30%, #134e4a 70%, #042f2e 100%)';

  const accentColor = template === 'weekend' ? '#fbbf24' : '#38bdf8';
  const dateLabel = template === 'weekend' ? '周末价目表 · WEEKEND' : '平日价目表 · WEEKDAY';

  return (
    <div className="flex-1 overflow-auto bg-slate-900 p-8 flex items-start justify-center">
      <div className="relative shrink-0" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
        <div
          onClick={() => setSelectedModule(null)}
          className="absolute inset-0 rounded-3xl shadow-2xl overflow-hidden"
          style={{ background: bgGradient }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 20%, ${accentColor} 0%, transparent 40%),
                               radial-gradient(circle at 80% 80%, ${accentColor} 0%, transparent 40%)`,
            }}
          />
          <div className="relative z-10 h-full flex flex-col">
            <div
              className="px-10 pt-12 pb-8 text-center border-b-4"
              style={{ borderColor: accentColor }}
            >
              <div className="inline-block px-8 py-2 rounded-full mb-4 font-bold tracking-widest text-lg"
                style={{ backgroundColor: accentColor, color: '#1e293b' }}
              >
                ⚡ 极速运动馆 · 编号 {pageId} ⚡
              </div>
              <h1
                className="text-7xl font-black mb-3 tracking-tight"
                style={{ color: '#ffffff', textShadow: `0 4px 20px ${accentColor}88` }}
              >
                价目公示牌
              </h1>
              <div
                className="text-3xl font-bold tracking-widest"
                style={{ color: accentColor }}
              >
                PRICE LIST
              </div>
              <div className="mt-4 flex justify-center gap-4 items-center">
                <div className="h-px w-20" style={{ backgroundColor: accentColor }} />
                <div className="text-lg font-semibold" style={{ color: '#ffffff', opacity: 0.9 }}>
                  {dateLabel}
                </div>
                <div className="h-px w-20" style={{ backgroundColor: accentColor }} />
              </div>
            </div>
            <div className="flex-1 relative">
              {modules.map((mod) => (
                <DraggableModule key={mod.id} mod={mod} template={template} />
              ))}
            </div>
            <div
              className="px-10 py-6 text-center border-t-4"
              style={{ borderColor: accentColor }}
            >
              <div className="flex justify-between items-end">
                <div className="text-left">
                  <div className="text-sm opacity-80 mb-1">📞 预订热线</div>
                  <div className="text-2xl font-black" style={{ color: accentColor }}>
                    400-888-{pageId}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm opacity-80 mb-1">⏰ 营业时间</div>
                  <div className="text-xl font-bold">
                    每日 09:00 - 23:00
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-80 mb-1">📍 场馆地址</div>
                  <div className="text-base font-semibold">
                    运动大道88号
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs opacity-60 italic">
                * 价格及优惠最终解释权归本馆所有 · 如有变动以现场公告为准
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
