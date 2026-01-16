export interface User {
  id: string;
  name: string;
  color: string;
}

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

export interface Expense {
  id: string;
  amount: number;
  date: string; // ISO Date string YYYY-MM-DD
  description: string;
  category: ExpenseCategory;
  userId: string;
  timestamp: number; // For sorting
}

export type ViewMode = 'dashboard' | 'expenses' | 'users';

export interface DailyStat {
  date: string;
  total: number;
}

export interface CategoryStat {
  name: string;
  value: number;
  color: string;
}