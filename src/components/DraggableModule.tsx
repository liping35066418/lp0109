import { useRef, useEffect, useState, MouseEvent } from 'react';
import { BoardModule, TemplateMode, CANVAS_WIDTH, CANVAS_HEIGHT, PriceItem } from '@/types/priceBoard';
import { usePriceBoardStore } from '@/store/priceBoardStore';

interface Props {
  mod: BoardModule;
  template: TemplateMode;
}

const getItemDisplayPrice = (item: PriceItem, template: TemplateMode) => {
  const isWeekend = template === 'weekend';
  return item.basePrice + (isWeekend ? item.weekendExtra : 0);
};

export default function DraggableModule({ mod, template }: Props) {
  const moduleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, modX: 0, modY: 0, w: 0, h: 0 });
  const updateModulePosition = usePriceBoardStore((s) => s.updateModulePosition);
  const updateModuleSize = usePriceBoardStore((s) => s.updateModuleSize);
  const setSelectedModule = usePriceBoardStore((s) => s.setSelectedModule);
  const selectedModuleId = usePriceBoardStore((s) => s.selectedModuleId);
  const isSelected = selectedModuleId === mod.id;

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.resize-handle')) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setSelectedModule(mod.id);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      modX: mod.x,
      modY: mod.y,
      w: mod.width,
      h: mod.height,
    });
  };

  const onResizeStart = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setSelectedModule(mod.id);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      modX: mod.x,
      modY: mod.y,
      w: mod.width,
      h: mod.height,
    });
  };

  useEffect(() => {
    const handleMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        let newX = dragStart.modX + dx;
        let newY = dragStart.modY + dy;
        newX = Math.max(0, Math.min(CANVAS_WIDTH - mod.width, newX));
        newY = Math.max(0, Math.min(CANVAS_HEIGHT - mod.height, newY));
        updateModulePosition(mod.id, newX, newY);
      }
      if (isResizing) {
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        let newW = Math.max(280, dragStart.w + dx);
        let newH = Math.max(200, dragStart.h + dy);
        if (mod.x + newW > CANVAS_WIDTH) newW = CANVAS_WIDTH - mod.x;
        if (mod.y + newH > CANVAS_HEIGHT) newH = CANVAS_HEIGHT - mod.y;
        updateModuleSize(mod.id, newW, newH);
      }
    };
    const handleUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, isResizing, dragStart, mod.id, mod.x, mod.y, mod.width, mod.height, updateModulePosition, updateModuleSize]);

  const getItemRowHeight = () => {
    const rows = mod.items.length;
    if (rows === 0) return 0;
    const titleArea = 90;
    const available = mod.height - titleArea - 30;
    return Math.max(48, Math.floor(available / rows));
  };

  const rowH = getItemRowHeight();
  const fontSize = Math.max(16, Math.min(22, Math.floor(rowH * 0.38)));
  const priceFontSize = Math.max(20, Math.min(28, Math.floor(rowH * 0.46)));

  return (
    <div
      ref={moduleRef}
      onMouseDown={onMouseDown}
      onClick={(e) => { e.stopPropagation(); setSelectedModule(mod.id); }}
      className={`absolute select-none cursor-move rounded-xl overflow-hidden shadow-2xl transition-shadow ${
        isSelected ? 'ring-4 ring-blue-400 ring-offset-2 z-20' : 'z-10'
      }`}
      style={{
        left: mod.x,
        top: mod.y,
        width: mod.width,
        height: mod.height,
        backgroundColor: mod.bgColor,
        color: mod.textColor,
        border: `4px solid ${mod.borderColor}`,
      }}
    >
      <div
        className="px-6 py-4 border-b-2 flex items-center justify-between"
        style={{ borderColor: mod.borderColor }}
      >
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-black tracking-widest">{mod.title}</span>
          <span className="text-base font-bold opacity-80">{mod.titleCn}</span>
        </div>
        <div
          className="px-3 py-1 rounded-full text-sm font-bold"
          style={{ backgroundColor: mod.borderColor, color: mod.bgColor }}
        >
          {template === 'weekend' ? '周末 WEEKEND' : '平日 WEEKDAY'}
        </div>
      </div>

      <div className="px-6 py-3">
        {mod.items.length === 0 ? (
          <div className="flex items-center justify-center h-32 opacity-60 italic">
            点击配置面板添加项目
          </div>
        ) : (
          <div className="space-y-1">
            {mod.items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-dashed last:border-0"
                style={{
                  height: rowH,
                  borderColor: `${mod.borderColor}55`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: mod.borderColor, color: mod.bgColor }}
                  >
                    {idx + 1}
                  </span>
                  <span style={{ fontSize }} className="font-semibold">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span style={{ fontSize: priceFontSize }} className="font-black">
                    ¥{getItemDisplayPrice(item, template)}
                  </span>
                  <span className="text-xs opacity-70">{item.unit}</span>
                  {template === 'weekend' && item.weekendExtra > 0 && (
                    <span
                      className="text-xs px-2 py-0.5 rounded font-bold"
                      style={{ backgroundColor: '#dc2626', color: '#fff' }}
                    >
                      +¥{item.weekendExtra}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="resize-handle absolute bottom-0 right-0 w-8 h-8 cursor-se-resize flex items-end justify-end p-1"
        onMouseDown={onResizeStart}
        style={{ display: isSelected ? 'flex' : 'none' }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" opacity="0.7">
          <path d="M19 19h-2v-2h-2v-2h-2v-2h-2v-2h-2V9h-2V7h-2V5h-2V3h16v16zM11 15H9v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8-4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
        </svg>
      </div>
    </div>
  );
}
