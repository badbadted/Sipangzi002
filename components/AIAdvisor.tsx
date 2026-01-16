import React, { useState } from 'react';
import { Sparkles, BrainCircuit, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Expense, User } from '../types';
import { analyzeExpenses } from '../services/gemini';

interface AIAdvisorProps {
  expenses: Expense[];
  users: User[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ expenses, users }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeExpenses(expenses, users);
    setAnalysis(result);
    setLoading(false);
    setHasAnalyzed(true);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">AI 理財顧問</h2>
                    <p className="text-indigo-200 text-sm">由 Gemini 3 Flash 驅動</p>
                </div>
            </div>
            
            <button
                onClick={handleAnalyze}
                disabled={loading || expenses.length === 0}
                className="bg-white text-indigo-900 hover:bg-indigo-50 disabled:bg-white/20 disabled:text-indigo-300 disabled:cursor-not-allowed px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg flex items-center gap-2"
            >
                {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                    <BrainCircuit className="w-4 h-4" />
                )}
                {loading ? '分析中...' : hasAnalyzed ? '更新分析' : '分析開銷'}
            </button>
        </div>

        {loading ? (
           <div className="animate-pulse space-y-4 py-8">
               <div className="h-4 bg-white/10 rounded w-3/4"></div>
               <div className="h-4 bg-white/10 rounded w-1/2"></div>
               <div className="h-4 bg-white/10 rounded w-5/6"></div>
           </div>
        ) : analysis ? (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-inner prose prose-invert max-w-none text-indigo-50 prose-headings:text-white prose-strong:text-yellow-200">
                <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
        ) : (
            <div className="text-center py-12 text-indigo-200 bg-white/5 rounded-xl border border-white/5">
                <BrainCircuit className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>點擊「分析開銷」以獲取針對您支出的個人化見解。</p>
                {expenses.length === 0 && (
                    <p className="text-xs mt-2 text-yellow-300/80">請先新增一些支出紀錄！</p>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;