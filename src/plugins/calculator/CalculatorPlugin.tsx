import React from 'react';
import { BasePlugin } from '../base/BasePlugin.tsx';
import { PluginResponse } from '../../types';
import { evaluate } from 'mathjs';
import { CalculatorCard } from './CalculatorCard';

interface CalculatorData {
  expression: string;
  result: number | string;
}

export class CalculatorPlugin extends BasePlugin {
  constructor() {
    super(
      'calculator',
      'calc',
      'Perform calculations (e.g., /calc 2 + 2)'
    );
  }

  async execute(args: string[]): Promise<PluginResponse<CalculatorData | null>> {
    if (!args.length) {
      return {
        success: false,
        data: null,
        error: 'Please provide a calculation'
      };
    }

    try {
      const expression = args.join(' ');
      const result = evaluate(expression);
      return {
        success: true,
        data: {
          expression,
          result: result.toString()
        }
      };
    } catch {
      return {
        success: false,
        data: null,
        error: 'Invalid calculation'
      };
    }
  }

  protected renderSuccess(data: PluginResponse<CalculatorData | null>): React.ReactNode {
    if (!data.data) return null;
    const { expression, result } = data.data;
    return <CalculatorCard expression={expression} result={result} />;
  }
}