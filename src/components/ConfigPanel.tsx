import { usePriceBoardStore } from '@/store/priceBoardStore';
import { PriceItem } from '@/types/priceBoard';
import { Plus, Trash2, Palette, Type } from 'lucide-react';

const MODULE_TYPE_LABELS: Record<string, string> = {
  venue: '场地体验',
  equipment: '装备租赁',
  package: '组队套餐',
};

const TYPE_ICONS: Record<string, string> = {
  venue: '🏟️',
  equipment: '🎾',
  package: '🎁',
};

const COLOR_PRESETS = [
  { bg: '#1e3a5f', border: '#fbbf24', text: '#ffffff' },
  { bg: '#0f766e', border: '#34d399', text: '#ffffff' },
  { bg: '#7c2d12', border: '#fb923c', text: '#ffffff' },
  { bg: '#581c87', border: '#c084fc', text: '#ffffff' },
  { bg: '#831843', border: '#f472b6', text: '#ffffff' },
  { bg: '#1e293b', border: '#64748b', text: '#ffffff' },
];

export default function ConfigPanel() {
  const modules = usePriceBoardStore((s) => s.modules);
  const selectedModuleId = usePriceBoardStore((s) => s.selectedModuleId);
  const setSelectedModule = usePriceBoardStore((s) => s.setSelectedModule);
  const updateModuleStyle = usePriceBoardStore((s) => s.updateModuleStyle);
  const updateItem = usePriceBoardStore((s) => s.updateItem);
  const addItemToModule = usePriceBoardStore((s) => s.addItemToModule);
  const removeItemFromModule = usePriceBoardStore((s) => s.removeItemFromModule);
  const resetModules = usePriceBoardStore((s) => s.resetModules);

  const selected = modules.find((m) => m.id === selectedModuleId);

  const addNewItem = () => {
    if (!selected) return;
    const typePrefix = selected.type === 'venue' ? 'v' : selected.type === 'equipment' ? 'e' : 'p';
    const newItem: PriceItem = {
      id: `${typePrefix}-${Date.now()}`,
      name: '新项目',
      basePrice: 100,
      weekendExtra: 0,
      unit: '元/小时',
    };
    addItemToModule(selected.id, newItem);
  };

  return (
    <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Type size={20} /> 模块配置面板
        </h2>
        <p className="text-xs text-blue-100 mt-1">点击左侧画布中的模块进行编辑</p>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-600 mb-3 flex items-center gap-2">
            <Palette size={16} /> 模块列表
          </h3>
          <div className="space-y-2">
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModule(m.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedModuleId === m.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{TYPE_ICONS[m.type]}</span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-800">{MODULE_TYPE_LABELS[m.type]}</div>
                    <div className="text-xs text-slate-500">
                      {m.items.length} 个项目 · {m.width}×{m.height}
                    </div>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full border-2"
                    style={{ backgroundColor: m.bgColor, borderColor: m.borderColor }}
                  />
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={resetModules}
            className="mt-3 w-full text-xs py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            🔄 重置为默认布局
          </button>
        </div>

        {selected ? (
          <div className="p-4 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-600 mb-3">📝 模块标题</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">英文标题</label>
                  <input
                    type="text"
                    value={selected.title}
                    onChange={(e) =>
                      updateModuleStyle(selected.id, { title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold tracking-wider"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">中文标题</label>
                  <input
                    type="text"
                    value={selected.titleCn}
                    onChange={(e) =>
                      updateModuleStyle(selected.id, { titleCn: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-600 mb-3">🎨 配色方案</h3>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {COLOR_PRESETS.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      updateModuleStyle(selected.id, {
                        bgColor: c.bg,
                        borderColor: c.border,
                        textColor: c.text,
                      })
                    }
                    className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                      selected.bgColor === c.bg && selected.borderColor === c.border
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="w-full h-8 rounded mb-1 flex">
                      <div className="flex-1 rounded-l" style={{ backgroundColor: c.bg }} />
                      <div
                        className="w-2 rounded-r"
                        style={{ backgroundColor: c.border }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 text-center">预设{idx + 1}</div>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">背景色</label>
                  <input
                    type="color"
                    value={selected.bgColor}
                    onChange={(e) =>
                      updateModuleStyle(selected.id, { bgColor: e.target.value })
                    }
                    className="w-full h-9 rounded cursor-pointer border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">边框色</label>
                  <input
                    type="color"
                    value={selected.borderColor}
                    onChange={(e) =>
                      updateModuleStyle(selected.id, { borderColor: e.target.value })
                    }
                    className="w-full h-9 rounded cursor-pointer border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">文字色</label>
                  <input
                    type="color"
                    value={selected.textColor}
                    onChange={(e) =>
                      updateModuleStyle(selected.id, { textColor: e.target.value })
                    }
                    className="w-full h-9 rounded cursor-pointer border border-slate-200"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-600">💰 项目列表 ({selected.items.length})</h3>
                <button
                  onClick={addNewItem}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors"
                >
                  <Plus size={14} /> 添加
                </button>
              </div>
              <div className="space-y-3">
                {selected.items.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm italic">
                    暂无项目，点击上方"添加"按钮
                  </div>
                ) : (
                  selected.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            updateItem(selected.id, item.id, { name: e.target.value })
                          }
                          className="flex-1 px-2 py-1 rounded border border-slate-200 text-sm font-semibold focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => removeItemFromModule(selected.id, item.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">基础价(¥)</label>
                          <input
                            type="number"
                            min="0"
                            value={item.basePrice}
                            onChange={(e) =>
                              updateItem(selected.id, item.id, {
                                basePrice: Math.max(0, Number(e.target.value) || 0),
                              })
                            }
                            className="w-full px-2 py-1 rounded border border-slate-200 text-sm font-bold text-blue-600 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">周末+¥</label>
                          <input
                            type="number"
                            min="0"
                            value={item.weekendExtra}
                            onChange={(e) =>
                              updateItem(selected.id, item.id, {
                                weekendExtra: Math.max(0, Number(e.target.value) || 0),
                              })
                            }
                            className="w-full px-2 py-1 rounded border border-slate-200 text-sm font-bold text-orange-600 focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">单位</label>
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) =>
                              updateItem(selected.id, item.id, { unit: e.target.value })
                            }
                            className="w-full px-2 py-1 rounded border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">
            <div className="text-5xl mb-3">👆</div>
            <div className="text-sm">在左侧画布中点击选择模块<br />或从上方列表中选择</div>
          </div>
        )}
      </div>
    </div>
  );
}
