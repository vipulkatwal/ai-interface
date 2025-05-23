import React from 'react';
import { evaluate } from 'mathjs';
import { BasePlugin } from '../base/BasePlugin';
import { PluginResponse } from '../../types';

export class CalculatorPlugin extends BasePlugin {
  constructor() {
    super(
      'calculator',
      'calc',
      'Evaluate mathematical expressions (e.g., /calc 2 + 2)'
    );
  }

  async execute(args: string[]): Promise<PluginResponse> {
    try {
      const expression = args.join(' ');
      const result = evaluate(expression);
      return {
        success: true,
        data: {
          expression,
          result
        }
      };
    } catch (_error) {
      return {
        success: false,
        data: null,
        error: 'Invalid mathematical expression'
      };
    }
  }

  protected renderSuccess(data: PluginResponse): React.ReactNode {
    const { expression, result } = data.data;
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="text-sm text-gray-600">Expression: {expression}</div>
        <div className="text-lg font-semibold mt-2">Result: {result}</div>
      </div>
    );
  }
}