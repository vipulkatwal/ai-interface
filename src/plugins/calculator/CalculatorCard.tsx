import React from 'react';
import { Calculator } from 'lucide-react';

interface CalculatorCardProps {
  expression: string;
  result: number | string;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ expression, result }) => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 min-w-[220px] max-w-xs mx-auto animate-fadein">
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="w-5 h-5 text-white" />
        <span className="text-white font-semibold text-lg">Calculator</span>
      </div>
      <div className="text-gray-300 text-sm mb-1">{expression}</div>
      <div className="text-3xl font-bold text-white mb-2">{result}</div>
      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};