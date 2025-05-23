import type { Plugin } from '../types/chat';

function safeEval(expression: string): number {
  // Remove any characters that aren't numbers, operators, or spaces
  const sanitizedExpr = expression.replace(/[^0-9+\-*/(). ]/g, '');

  // Validate the expression
  if (!/^[0-9+\-*/(). ]+$/.test(sanitizedExpr)) {
    throw new Error('Invalid expression');
  }

  try {
    // Use Function instead of eval for better security
    const result = new Function(`return ${sanitizedExpr}`)();
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid result');
    }
    return result;
  } catch (error) {
    throw new Error('Invalid expression');
  }
}

export const calculatorPlugin: Plugin = {
  name: 'calculator',
  description: 'Evaluate mathematical expressions',
  command: '/calc',
  regex: /^\/calc\s+(.+)$/i,

  async execute(input: string): Promise<{ result: number }> {
    const result = safeEval(input);
    return { result };
  },

  renderResponse(data: { result: number }) {
    return {
      type: 'calculator',
      result: data.result.toString()
    };
  }
};