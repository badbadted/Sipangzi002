import { ExpenseCategory, PaymentMethod, Category } from './types';

// 預設類別（初始數據）
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'Food', name: 'Food', label: '飲食 🍔', color: '#F87171' },
  { id: 'Transport', name: 'Transport', label: '交通 🚌', color: '#FBBF24' },
  { id: 'Housing', name: 'Housing', label: '居住 🏠', color: '#60A5FA' },
  { id: 'Entertainment', name: 'Entertainment', label: '娛樂 🎮', color: '#A78BFA' },
  { id: 'Shopping', name: 'Shopping', label: '購物 🛍️', color: '#F472B6' },
  { id: 'Health', name: 'Health', label: '醫療 💊', color: '#34D399' },
  { id: 'Utilities', name: 'Utilities', label: '帳單 ⚡', color: '#818CF8' },
  { id: 'Other', name: 'Other', label: '其他 📦', color: '#9CA3AF' },
];

// 向後兼容：舊的 enum 映射
export const CATEGORY_COLORS: Record<string, string> = {
  [ExpenseCategory.FOOD]: '#F87171',
  [ExpenseCategory.TRANSPORT]: '#FBBF24',
  [ExpenseCategory.HOUSING]: '#60A5FA',
  [ExpenseCategory.ENTERTAINMENT]: '#A78BFA',
  [ExpenseCategory.SHOPPING]: '#F472B6',
  [ExpenseCategory.HEALTH]: '#34D399',
  [ExpenseCategory.UTILITIES]: '#818CF8',
  [ExpenseCategory.OTHER]: '#9CA3AF',
};

export const CATEGORY_LABELS: Record<string, string> = {
  [ExpenseCategory.FOOD]: '飲食 🍔',
  [ExpenseCategory.TRANSPORT]: '交通 🚌',
  [ExpenseCategory.HOUSING]: '居住 🏠',
  [ExpenseCategory.ENTERTAINMENT]: '娛樂 🎮',
  [ExpenseCategory.SHOPPING]: '購物 🛍️',
  [ExpenseCategory.HEALTH]: '醫療 💊',
  [ExpenseCategory.UTILITIES]: '帳單 ⚡',
  [ExpenseCategory.OTHER]: '其他 📦',
};

// 輔助函數：根據類別 ID 獲取顏色
export const getCategoryColor = (categoryId: string, categories: Category[]): string => {
  const category = categories.find(c => c.id === categoryId || c.name === categoryId);
  return category?.color || CATEGORY_COLORS[categoryId] || '#9CA3AF';
};

// 輔助函數：根據類別 ID 獲取標籤
export const getCategoryLabel = (categoryId: string, categories: Category[]): string => {
  const category = categories.find(c => c.id === categoryId || c.name === categoryId);
  return category?.label || CATEGORY_LABELS[categoryId] || categoryId;
};

// Cuter user colors
export const USER_COLORS = [
  '#60A5FA', // Blue
  '#F87171', // Red
  '#34D399', // Green
  '#FBBF24', // Yellow
  '#A78BFA', // Purple
  '#F472B6', // Pink
  '#22D3EE', // Cyan
  '#FB923C', // Orange
];

export const INITIAL_USERS = [
  { id: '1', name: '我', color: USER_COLORS[0] }
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: '現金 💵',
  [PaymentMethod.CREDIT_CARD]: '信用卡 💳',
};
