import { GoogleGenAI } from "@google/genai";
import { Expense, User, ExpenseCategory } from '../types';
import { CATEGORY_LABELS } from '../constants';

// Safely retrieve API key from environment
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

export const analyzeExpenses = async (
  expenses: Expense[], 
  users: User[]
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Filter last 30 days for relevance
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentExpenses = expenses.filter(e => new Date(e.date) >= thirtyDaysAgo);

  // Summarize data to reduce token count
  const summary = recentExpenses.map(e => {
    const user = users.find(u => u.id === e.userId)?.name || '未知使用者';
    const category = CATEGORY_LABELS[e.category] || e.category;
    return `${e.date}: ${user} 花費了 ${e.amount} 元在 ${category} (${e.description})`;
  }).join('\n');

  const prompt = `
    你是一位專業的理財顧問。以下是一個家庭過去 30 天的支出清單。
    
    數據:
    ${summary}

    請使用繁體中文 (Traditional Chinese) 提供以下分析：
    1. 用兩句話簡短總結近期的消費習慣。
    2. 分析哪位使用者花費最多，以及主要花在哪裡。
    3. 針對這些具體的消費項目，提供三個具體且可行的省錢建議。
    
    請使用清晰的 Markdown 格式輸出。重點部分請使用粗體。
    如果沒有數據，請回答 "近期沒有支出紀錄。"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "無法產生分析報告。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，目前無法分析您的支出，請稍後再試。";
  }
};