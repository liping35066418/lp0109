import { create } from 'zustand';
import {
  BoardModule,
  TemplateMode,
  CalculationInput,
  DEFAULT_VENUE_ITEMS,
  DEFAULT_EQUIPMENT_ITEMS,
  DEFAULT_PACKAGE_ITEMS,
  PriceItem,
} from '@/types/priceBoard';

interface PriceBoardState {
  pageId: string;
  template: TemplateMode;
  modules: BoardModule[];
  calcInput: CalculationInput;
  selectedModuleId: string | null;
  setPageId: (id: string) => void;
  setTemplate: (t: TemplateMode) => void;
  toggleTemplate: () => void;
  setSelectedModule: (id: string | null) => void;
  updateModulePosition: (id: string, x: number, y: number) => void;
  updateModuleSize: (id: string, width: number, height: number) => void;
  updateModuleStyle: (id: string, updates: Partial<Pick<BoardModule, 'bgColor' | 'textColor' | 'borderColor' | 'title' | 'titleCn'>>) => void;
  addItemToModule: (moduleId: string, item: PriceItem) => void;
  removeItemFromModule: (moduleId: string, itemId: string) => void;
  updateItem: (moduleId: string, itemId: string, updates: Partial<PriceItem>) => void;
  setCalcInput: (updates: Partial<CalculationInput>) => void;
  resetModules: () => void;
}

const createDefaultModules = (): BoardModule[] => [
  {
    id: 'mod-venue',
    type: 'venue',
    title: 'VENUE',
    titleCn: '场地体验',
    x: 40,
    y: 200,
    width: 720,
    height: 480,
    items: [...DEFAULT_VENUE_ITEMS],
    bgColor: '#1e3a5f',
    textColor: '#ffffff',
    borderColor: '#fbbf24',
  },
  {
    id: 'mod-equipment',
    type: 'equipment',
    title: 'EQUIPMENT',
    titleCn: '装备租赁',
    x: 40,
    y: 720,
    width: 720,
    height: 420,
    items: [...DEFAULT_EQUIPMENT_ITEMS],
    bgColor: '#0f766e',
    textColor: '#ffffff',
    borderColor: '#34d399',
  },
  {
    id: 'mod-package',
    type: 'package',
    title: 'PACKAGE',
    titleCn: '组队套餐',
    x: 40,
    y: 1180,
    width: 720,
    height: 500,
    items: [...DEFAULT_PACKAGE_ITEMS],
    bgColor: '#7c2d12',
    textColor: '#ffffff',
    borderColor: '#fb923c',
  },
];

const createDefaultCalcInput = (): CalculationInput => ({
  venueSelections: {},
  equipmentSelections: {},
  packageSelections: {},
  playHours: 2,
  discountAmount: 0,
  memberEnabled: false,
  memberDiscountRate: 0.9,
});

const PAGES_STORAGE_KEY = 'priceBoardPages';

const loadFromStorage = (pageId: string): Partial<PriceBoardState> | null => {
  try {
    const stored = localStorage.getItem(PAGES_STORAGE_KEY);
    if (stored) {
      const all = JSON.parse(stored);
      return all[pageId] || null;
    }
  } catch {
      return null;
    }
    return null;
  };

  const saveToStorage = (pageId: string, state: Partial<PriceBoardState>) => {
    try {
      const stored = localStorage.getItem(PAGES_STORAGE_KEY);
      const all = stored ? JSON.parse(stored) : {};
      all[pageId] = {
        template: state.template,
        modules: state.modules,
        calcInput: state.calcInput,
      };
      localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(all));
    } catch {
      // ignore
    }
  };

export const usePriceBoardStore = create<PriceBoardState>((set, get) => ({
  pageId: '',
  template: 'weekday',
  modules: createDefaultModules(),
  calcInput: createDefaultCalcInput(),
  selectedModuleId: null,
  setPageId: (id) => {
    const saved = loadFromStorage(id);
    const defaultCalc = createDefaultCalcInput();
    if (saved) {
      const savedCalcInput = (saved.calcInput || {}) as Partial<CalculationInput>;
      const mergedCalcInput = {
        ...defaultCalc,
        ...savedCalcInput,
        memberEnabled: savedCalcInput.memberEnabled !== undefined ? savedCalcInput.memberEnabled : false,
        memberDiscountRate: savedCalcInput.memberDiscountRate !== undefined ? savedCalcInput.memberDiscountRate : 0.9,
      };
      set({
        pageId: id,
        template: saved.template || 'weekday',
        modules: saved.modules || createDefaultModules(),
        calcInput: mergedCalcInput,
        selectedModuleId: null,
      });
    } else {
      set({
          pageId: id,
          template: 'weekday',
          modules: createDefaultModules(),
          calcInput: defaultCalc,
          selectedModuleId: null,
      });
    }
  },
  setTemplate: (t) => {
    set({ template: t });
    const s = get();
    saveToStorage(s.pageId, s);
  },
  toggleTemplate: () => {
    const s = get();
    const next = s.template === 'weekday' ? 'weekend' : 'weekday';
    set({ template: next });
    saveToStorage(s.pageId, { ...s, template: next });
  },
  setSelectedModule: (id) => set({ selectedModuleId: id }),
  updateModulePosition: (id, x, y) => {
    set((state) => ({
      modules: state.modules.map((m) => (m.id === id ? { ...m, x, y } : m)),
    }));
    const s = get();
    saveToStorage(s.pageId, s);
  },
  updateModuleSize: (id, width, height) => {
    set((state) => ({
      modules: state.modules.map((m) => (m.id === id ? { ...m, width, height } : m)),
    }));
    const s = get();
    saveToStorage(s.pageId, s);
  },
  updateModuleStyle: (id, updates) => {
    set((state) => ({
      modules: state.modules.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
    const s = get();
    saveToStorage(s.pageId, s);
  },
  addItemToModule: (moduleId, item) => {
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId ? { ...m, items: [...m.items, item] } : m
      ),
    }));
    const s = get();
    saveToStorage(s.pageId, s);
  },
  removeItemFromModule: (moduleId, itemId) => {
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId
          ? { ...m, items: m.items.filter((i) => i.id !== itemId) }
          : m
      ),
    }));
    const s = get();
    saveToStorage(s.pageId, s);
  },
  updateItem: (moduleId, itemId, updates) => {
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              items: m.items.map((i) =>
                i.id === itemId ? { ...i, ...updates } : i
              ),
            }
          : m
      ),
    }));
    const s = get();
    saveToStorage(s.pageId, s);
  },
  setCalcInput: (updates) => {
    set((state) => ({
      calcInput: { ...state.calcInput, ...updates },
    }));
    const s = get();
    saveToStorage(s.pageId, s);
  },
  resetModules: () => {
    set({
      modules: createDefaultModules(),
      calcInput: createDefaultCalcInput(),
    });
    const s = get();
    saveToStorage(s.pageId, s);
  },
}));

export const calculateTotal = (
  modules: BoardModule[],
  template: TemplateMode,
  input: CalculationInput
) => {
  let venueTotal = 0;
  let equipmentTotal = 0;
  let packageTotal = 0;
  const isWeekend = template === 'weekend';

  modules.forEach((mod) => {
    if (mod.type === 'venue') {
      mod.items.forEach((item) => {
        const sel = input.venueSelections[item.id];
        if (sel?.selected) {
          const price = item.basePrice + (isWeekend ? item.weekendExtra : 0);
          venueTotal += price * (sel.quantity || 1) * (sel.hours || input.playHours);
        }
      });
    } else if (mod.type === 'equipment') {
      mod.items.forEach((item) => {
        const sel = input.equipmentSelections[item.id];
        if (sel?.selected) {
          const price = item.basePrice + (isWeekend ? item.weekendExtra : 0);
          equipmentTotal += price * (sel.quantity || 1) * (sel.hours || input.playHours);
        }
      });
    } else if (mod.type === 'package') {
      mod.items.forEach((item) => {
        const sel = input.packageSelections[item.id];
        if (sel?.selected) {
          const price = item.basePrice + (isWeekend ? item.weekendExtra : 0);
          packageTotal += price * (sel.quantity || 1) * (sel.people || 1);
        }
      });
    }
  });

  const originalTotal = venueTotal + equipmentTotal + packageTotal;

  let memberDiscount = 0;
  let afterMemberTotal = originalTotal;
  if (input.memberEnabled) {
    const discountRate = Math.max(0.1, Math.min(0.7, input.memberDiscountRate));
    afterMemberTotal = originalTotal * discountRate;
    memberDiscount = originalTotal - afterMemberTotal;
  }

  const discount = Math.min(input.discountAmount, afterMemberTotal);
  const finalTotal = Math.max(0, afterMemberTotal - discount);

  return {
    venueTotal,
    equipmentTotal,
    packageTotal,
    originalTotal,
    memberDiscount,
    afterMemberTotal,
    discount,
    finalTotal,
    isWeekend,
    memberEnabled: input.memberEnabled,
    memberDiscountRate: input.memberDiscountRate,
  };
};
