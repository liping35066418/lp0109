export type ModuleType = 'venue' | 'equipment' | 'package';

export interface PriceItem {
  id: string;
  name: string;
  basePrice: number;
  weekendExtra: number;
  unit: string;
}

export interface BoardModule {
  id: string;
  type: ModuleType;
  title: string;
  titleCn: string;
  x: number;
  y: number;
  width: number;
  height: number;
  items: PriceItem[];
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export type TemplateMode = 'weekday' | 'weekend';

export interface CalculationInput {
  venueSelections: Record<string, { selected: boolean; quantity: number; hours: number }>;
  equipmentSelections: Record<string, { selected: boolean; quantity: number; hours: number }>;
  packageSelections: Record<string, { selected: boolean; quantity: number; people: number }>;
  playHours: number;
  discountAmount: number;
  memberEnabled: boolean;
  memberDiscountRate: number;
}

export interface PageState {
  pageId: string;
  template: TemplateMode;
  modules: BoardModule[];
  calcInput: CalculationInput;
}

export const DEFAULT_VENUE_ITEMS: PriceItem[] = [
  { id: 'v1', name: '标准场地A区', basePrice: 80, weekendExtra: 30, unit: '元/小时' },
  { id: 'v2', name: '标准场地B区', basePrice: 100, weekendExtra: 40, unit: '元/小时' },
  { id: 'v3', name: 'VIP场地', basePrice: 150, weekendExtra: 50, unit: '元/小时' },
  { id: 'v4', name: '豪华包间', basePrice: 200, weekendExtra: 80, unit: '元/小时' },
];

export const DEFAULT_EQUIPMENT_ITEMS: PriceItem[] = [
  { id: 'e1', name: '球拍租赁', basePrice: 20, weekendExtra: 10, unit: '元/支/小时' },
  { id: 'e2', name: '球鞋租赁', basePrice: 15, weekendExtra: 5, unit: '元/双/小时' },
  { id: 'e3', name: '护具套装', basePrice: 25, weekendExtra: 10, unit: '元/套/小时' },
  { id: 'e4', name: '专业球包', basePrice: 10, weekendExtra: 5, unit: '元/个/小时' },
];

export const DEFAULT_PACKAGE_ITEMS: PriceItem[] = [
  { id: 'p1', name: '双人畅玩套餐', basePrice: 299, weekendExtra: 100, unit: '元/2小时' },
  { id: 'p2', name: '四人组队套餐', basePrice: 499, weekendExtra: 150, unit: '元/2小时' },
  { id: 'p3', name: '六人团建套餐', basePrice: 799, weekendExtra: 200, unit: '元/3小时' },
  { id: 'p4', name: 'VIP尊享套餐', basePrice: 1299, weekendExtra: 300, unit: '元/全天' },
];

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 1800;
