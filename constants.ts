import { ExpenseCategory } from './types';

// Updated palette for "Cute" theme
export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: '#F87171', // Red 400
  [ExpenseCategory.TRANSPORT]: '#FBBF24', // Amber 400
  [ExpenseCategory.HOUSING]: '#60A5FA', // Blue 400
  [ExpenseCategory.ENTERTAINMENT]: '#A78BFA', // Violet 400
  [ExpenseCategory.SHOPPING]: '#F472B6', // Pink 400
  [ExpenseCategory.HEALTH]: '#34D399', // Emerald 400
  [ExpenseCategory.UTILITIES]: '#818CF8', // Indigo 400
  [ExpenseCategory.OTHER]: '#9CA3AF', // Gray 400
};

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD]: '飲食 🍔',
  [ExpenseCategory.TRANSPORT]: '交通 🚌',
  [ExpenseCategory.HOUSING]: '居住 🏠',
  [ExpenseCategory.ENTERTAINMENT]: '娛樂 🎮',
  [ExpenseCategory.SHOPPING]: '購物 🛍️',
  [ExpenseCategory.HEALTH]: '醫療 💊',
  [ExpenseCategory.UTILITIES]: '帳單 ⚡',
  [ExpenseCategory.OTHER]: '其他 📦',
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