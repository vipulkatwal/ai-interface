import type { Plugin } from '../types';
import { Card, CardContent, Typography } from '@mui/material';

const safeEval = (expression: string): number => {
  // Remove any non-mathematical characters
  const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');

  // Use Function constructor instead of eval for better security
  const result = new Function(`return ${sanitized}`)();

  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error('Invalid expression');
  }

  return result;
};

const CalculatorPlugin: Plugin = {
  name: 'calculator',
  description: 'Evaluates mathematical expressions',
  triggerPattern: /^\/calc\s+(.+)$/,

  async execute(args: string[]): Promise<{ expression: string; result: number }> {
    const expression = args[0];
    const result = safeEval(expression);
    return { expression, result };
  },

  render(data: { expression: string; result: number }) {
    return (
      <Card variant="outlined" sx={{ maxWidth: 300, mt: 1 }}>
        <CardContent>
          <Typography variant="h6" component="div">
            Calculator
          </Typography>
          <Typography color="text.secondary">
            Expression: {data.expression}
          </Typography>
          <Typography variant="h5" sx={{ mt: 1 }}>
            Result: {data.result}
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default CalculatorPlugin;