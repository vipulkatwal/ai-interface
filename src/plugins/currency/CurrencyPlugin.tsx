import React from 'react';
import axios from 'axios';
import { BasePlugin } from '../base/BasePlugin';
import { PluginResponse } from '../../types';

interface CurrencyData {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
}

export class CurrencyPlugin extends BasePlugin {
  constructor() {
    super(
      'currency',
      'currency',
      'Convert between currencies (e.g., /currency 50 USD to EUR)'
    );
  }

  async execute(args: string[]): Promise<PluginResponse<CurrencyData | null>> {
    // args: [amount, from, 'to', to]
    if (args.length < 4 || args[2].toLowerCase() !== 'to') {
      return {
        success: false,
        data: null,
        error: 'Usage: /currency <amount> <from> to <to>'
      };
    }
    const amount = parseFloat(args[0]);
    const from = args[1].toUpperCase();
    const to = args[3].toUpperCase();
    if (isNaN(amount)) {
      return { success: false, data: null, error: 'Invalid amount' };
    }
    try {
      const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
      const res = await axios.get(url);
      if (!res.data || !res.data.result) {
        return { success: false, data: null, error: 'Conversion failed' };
      }
      return {
        success: true,
        data: {
          from,
          to,
          amount,
          result: res.data.result,
          rate: res.data.info.rate
        }
      };
    } catch {
      return { success: false, data: null, error: 'API error' };
    }
  }

  protected renderSuccess(data: PluginResponse<CurrencyData | null>): React.ReactNode {
    if (!data.data) return null;
    const { from, to, amount, result, rate } = data.data;
    return (
      <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow">
        <div className="text-lg font-semibold mb-1">{amount} {from} = {result.toFixed(2)} {to}</div>
        <div className="text-xs text-gray-500">Rate: 1 {from} = {rate.toFixed(4)} {to}</div>
      </div>
    );
  }
}