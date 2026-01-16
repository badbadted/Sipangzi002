export interface User {
  id: string;
  name: string;
  color: string;
}

// 類別接口（可動態管理）
export interface Category {
  id: string;
  name: string; // 類別名稱（英文，作為唯一標識）
  label: string; // 顯示標籤（中文）
  color: string; // 顏色
  icon?: string; // 可選的圖標
}

// 保留舊的 enum 作為向後兼容（將逐步遷移）
export enum ExpenseCategory {
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  HOUSING = 'Housing',
  ENTERTAINMENT = 'Entertainment',
  SHOPPING = 'Shopping',
  HEALTH = 'Health',
  UTILITIES = 'Utilities',
  OTHER = 'Other'
}

export enum PaymentMethod {
  CASH = 'Cash',
  CREDIT_CARD = 'CreditCard'
}

export interface Expense {
  id: string;
  amount: number;
  date: string; // ISO Date string YYYY-MM-DD
  description: string;
  category: string; // 改為 string，存儲類別 ID 或名稱
  userId: string;
  paymentMethod: PaymentMethod; // 支付方式
  timestamp: number; // For sorting
}

export type ViewMode = 'dashboard' | 'expenses' | 'users' | 'categories' | 'creditcard';

export interface DailyStat {
  date: string;
  total: number;
}

export interface CategoryStat {
  name: string;
  value: number;
  color: string;
}