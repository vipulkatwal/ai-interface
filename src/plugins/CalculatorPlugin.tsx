import React from 'react';
import { Plugin, PluginResult } from '../types';
import { Calculator } from 'lucide-react';

interface CalculationResult {
  expression: string;
  result: number;
}

export const calculatorPlugin: Plugin = {
  name: 'Calculator',
  description: 'Evaluate mathematical expressions',
  icon: 'calculator',
  triggers: ['calc', 'calculate', 'math'],
  keywords: ['calculate', 'compute', 'what is', 'solve', 'equals', 'equal to'],
  
  execute: async (expression: string): Promise<PluginResult> => {
    try {
      // Clean the expression of potentially unsafe code
      const cleanExpression = expression
        .replace(/[^0-9+\-*/().%\s]/g, '')
        .trim();
      
      if (!cleanExpression) {
        throw new Error('Invalid expression');
      }

      // Safely evaluate the expression
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${cleanExpression})`)();
      
      if (typeof result !== 'number' || isNaN(result)) {
        throw new Error('Expression did not evaluate to a valid number');
      }
      
      const formattedResult = Number.isInteger(result) 
        ? result 
        : parseFloat(result.toFixed(4));
      
      return {
        content: `${cleanExpression} = ${formattedResult}`,
        pluginData: {
          expression: cleanExpression,
          result: formattedResult,
        },
      };
    } catch (error) {
      console.error('Calculation error:', error);
      throw new Error(`Couldn't calculate "${expression}". Please check your expression and try again.`);
    }
  },
  
  renderResult: (data: CalculationResult) => (
    <div className="bg-gray-800 rounded-lg p-4 text-white shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Calculator</h3>
        <Calculator size={20} className="text-gray-400" />
      </div>
      
      <div className="flex flex-col">
        <div className="text-gray-400 text-sm font-mono">{data.expression}</div>
        <div className="text-2xl font-bold mt-1">{data.result}</div>
      </div>
    </div>
  ),
};