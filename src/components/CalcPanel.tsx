import { usePriceBoardStore, calculateTotal } from '@/store/priceBoardStore';
import { TemplateMode } from '@/types/priceBoard';
import { Calculator, Sun, CloudMoon, AlertCircle, Clock, Users, ShoppingBag } from 'lucide-react';

export default function CalcPanel() {
  const modules = usePriceBoardStore((s) => s.modules);
  const template = usePriceBoardStore((s) => s.template);
  const setTemplate = usePriceBoardStore((s) => s.setTemplate);
  const toggleTemplate = usePriceBoardStore((s) => s.toggleTemplate);
  const calcInput = usePriceBoardStore((s) => s.calcInput);
  const setCalcInput = usePriceBoardStore((s) => s.setCalcInput);

  const result = calculateTotal(modules, template, calcInput);
  const discountOverLimit = calcInput.discountAmount > result.originalTotal;

  const updateVenueSelection = (itemId: string, updates: Partial<{ selected: boolean; quantity: number; hours: number }>) => {
    const current = calcInput.venueSelections[itemId] || { selected: false, quantity: 1, hours: calcInput.playHours };
    setCalcInput({
      venueSelections: {
        ...calcInput.venueSelections,
        [itemId]: { ...current, ...updates },
      },
    });
  };

  const updateEquipmentSelection = (itemId: string, updates: Partial<{ selected: boolean; quantity: number; hours: number }>) => {
    const current = calcInput.equipmentSelections[itemId] || { selected: false, quantity: 1, hours: calcInput.playHours };
    setCalcInput({
      equipmentSelections: {
        ...calcInput.equipmentSelections,
        [itemId]: { ...current, ...updates },
      },
    });
  };

  const updatePackageSelection = (itemId: string, updates: Partial<{ selected: boolean; quantity: number; people: number }>) => {
    const current = calcInput.packageSelections[itemId] || { selected: false, quantity: 1, people: 1 };
    setCalcInput({
      packageSelections: {
        ...calcInput.packageSelections,
        [itemId]: { ...current, ...updates },
      },
    });
  };

  const renderTemplateToggle = () => (
    <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Calculator size={16} /> 模板切换
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setTemplate('weekday' as TemplateMode)}
          className={`p-3 rounded-xl border-2 transition-all ${
            template === 'weekday'
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sun size={18} className={template === 'weekday' ? 'text-yellow-500' : 'text-slate-400'} />
            <span className={`font-bold ${template === 'weekday' ? 'text-blue-700' : 'text-slate-600'}`}>
              平日模板
            </span>
          </div>
          <div className="text-[11px] text-slate-500">周一至周五</div>
        </button>
        <button
          onClick={() => setTemplate('weekend' as TemplateMode)}
          className={`p-3 rounded-xl border-2 transition-all ${
            template === 'weekend'
              ? 'border-orange-500 bg-orange-50 shadow-md'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <CloudMoon size={18} className={template === 'weekend' ? 'text-orange-500' : 'text-slate-400'} />
            <span className={`font-bold ${template === 'weekend' ? 'text-orange-700' : 'text-slate-600'}`}>
              周末模板
            </span>
          </div>
          <div className="text-[11px] text-slate-500">周六周日节假日</div>
        </button>
      </div>
      <button
        onClick={toggleTemplate}
        className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all"
      >
        🔄 一键切换模板
      </button>
    </div>
  );

  const renderSelectionSection = (
    title: string,
    icon: React.ReactNode,
    type: 'venue' | 'equipment' | 'package',
    color: string
  ) => {
    const mod = modules.find((m) => m.type === type);
    if (!mod || mod.items.length === 0) return null;
    const selections =
      type === 'venue'
        ? calcInput.venueSelections
        : type === 'equipment'
        ? calcInput.equipmentSelections
        : calcInput.packageSelections;
    const updater =
      type === 'venue'
        ? updateVenueSelection
        : type === 'equipment'
        ? updateEquipmentSelection
        : updatePackageSelection;

    return (
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
        <h4 className={`font-bold flex items-center gap-2 mb-3 ${color}`}>
          {icon} {title}
        </h4>
        <div className="space-y-2">
          {mod.items.map((item) => {
            const sel = selections[item.id] || { selected: false, quantity: 1, hours: calcInput.playHours, people: 1 };
            const price = item.basePrice + (template === 'weekend' ? item.weekendExtra : 0);
            return (
              <div
                key={item.id}
                className={`p-3 rounded-lg border transition-all ${
                  sel.selected
                    ? 'border-blue-300 bg-white shadow-sm'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={sel.selected}
                      onChange={(e) => updater(item.id, { selected: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                  </label>
                  <span className="text-base font-black text-blue-600">¥{price}</span>
                </div>
                {sel.selected && (
                  <div className="grid grid-cols-2 gap-2 pl-6">
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">
                        {type === 'package' ? <Users size={10} className="inline" /> : <ShoppingBag size={10} className="inline" />}{' '}
                        {type === 'package' ? '套数' : '数量'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={sel.quantity || 1}
                        onChange={(e) =>
                          updater(item.id, { quantity: Math.max(1, Number(e.target.value) || 1) })
                        }
                        className="w-full px-2 py-1 rounded border border-slate-200 text-sm font-bold focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    {type !== 'package' ? (
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-0.5">
                          <Clock size={10} className="inline" /> 时长(时)
                        </label>
                        <input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={(sel as { hours?: number }).hours || calcInput.playHours}
                          onChange={(e) =>
                            updater(item.id, { hours: Math.max(0.5, Number(e.target.value) || 1) })
                          }
                          className="w-full px-2 py-1 rounded border border-slate-200 text-sm font-bold focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="text-[10px] text-slate-500 block mb-0.5">
                          <Users size={10} className="inline" /> 人数
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={(sel as { people?: number }).people || 1}
                          onChange={(e) =>
                            updater(item.id, { people: Math.max(1, Number(e.target.value) || 1) })
                          }
                          className="w-full px-2 py-1 rounded border border-slate-200 text-sm font-bold focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-[420px] bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-emerald-600 to-teal-600">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Calculator size={20} /> 模拟计费中心
        </h2>
        <p className="text-xs text-emerald-100 mt-1">输入参数实时计算应付金额</p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {renderTemplateToggle()}

        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
          <h3 className="text-sm font-bold text-indigo-700 mb-3 flex items-center gap-2">
            <Clock size={16} /> 通用设置
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 block mb-1 font-semibold">游玩时长 (小时)</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={calcInput.playHours}
                onChange={(e) =>
                  setCalcInput({ playHours: Math.max(0.5, Number(e.target.value) || 1) })
                }
                className="w-full px-3 py-2 rounded-lg border-2 border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base font-black text-indigo-700"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 block mb-1 font-semibold flex items-center gap-1">
                优惠金额 (¥)
                {discountOverLimit && (
                  <span className="text-red-500" title="优惠不能超过原价">
                    <AlertCircle size={12} />
                  </span>
                )}
              </label>
              <input
                type="number"
                min="0"
                value={calcInput.discountAmount}
                onChange={(e) =>
                  setCalcInput({ discountAmount: Math.max(0, Number(e.target.value) || 0) })
                }
                className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:border-transparent text-base font-black ${
                  discountOverLimit
                    ? 'border-red-400 bg-red-50 text-red-700 focus:ring-red-500'
                    : 'border-purple-200 text-purple-700 focus:ring-purple-500'
                }`}
              />
            </div>
          </div>
          {discountOverLimit && (
            <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
              <AlertCircle size={14} />
              优惠金额已自动限制为不超过原价 ¥{result.originalTotal}
            </div>
          )}
        </div>

        {renderSelectionSection('🏟️ 场地体验', null, 'venue', 'text-blue-700')}
        {renderSelectionSection('🎾 装备租赁', null, 'equipment', 'text-emerald-700')}
        {renderSelectionSection('🎁 组队套餐', null, 'package', 'text-orange-700')}
      </div>

      <div className="p-4 border-t-2 border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">场地费</span>
            <span className="font-semibold text-blue-700">¥{result.venueTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">装备租赁费</span>
            <span className="font-semibold text-emerald-700">¥{result.equipmentTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">套餐费</span>
            <span className="font-semibold text-orange-700">¥{result.packageTotal.toFixed(2)}</span>
          </div>
          <div className="h-px bg-slate-200 my-2" />
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">订单原价</span>
            <span className="font-bold text-slate-800">¥{result.originalTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-purple-600">优惠抵扣</span>
            <span className="font-bold text-purple-600">-¥{result.discount.toFixed(2)}</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-80">应付总价</div>
              <div className="text-4xl font-black tracking-tight">
                ¥{result.finalTotal.toFixed(2)}
              </div>
            </div>
            <div className="text-right text-xs opacity-80">
              <div>{template === 'weekend' ? '🌙 周末价' : '☀️ 平日价'}</div>
              <div className="mt-1">
                已优惠 ¥{result.discount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
