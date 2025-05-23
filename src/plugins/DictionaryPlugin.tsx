import React from 'react';
import { Plugin, PluginResult } from '../types';
import { BookOpen } from 'lucide-react';

interface DictionaryResult {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: string[];
  }[];
}

export const dictionaryPlugin: Plugin = {
  name: 'Dictionary',
  description: 'Look up word definitions',
  icon: 'book-open',
  triggers: ['define', 'dictionary', 'meaning'],
  keywords: ['what does', 'mean', 'definition of', 'define'],
  
  execute: async (word: string): Promise<PluginResult> => {
    try {
      const cleanWord = word.trim().toLowerCase().replace(/[^a-z]/g, '');
      
      if (!cleanWord) {
        throw new Error('Invalid word');
      }
      
      // In a real app, you would call a dictionary API
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      // Mock dictionary data
      const mockDictionary: Record<string, DictionaryResult> = {
        happy: {
          word: 'happy',
          phonetic: '/ˈhæpi/',
          meanings: [
            {
              partOfSpeech: 'adjective',
              definitions: [
                'Feeling or showing pleasure or contentment.',
                'Fortunate and convenient.',
              ],
            },
          ],
        },
        code: {
          word: 'code',
          phonetic: '/kəʊd/',
          meanings: [
            {
              partOfSpeech: 'noun',
              definitions: [
                'A system of words, letters, figures, or other symbols substituted for other words, letters, etc.',
                'A system of signals, such as sounds, light flashes, or flags, used to send messages.',
                'A series of instructions to be fed into a computer.',
              ],
            },
            {
              partOfSpeech: 'verb',
              definitions: [
                'Convert into a particular code in order to convey a secret meaning.',
                'Write code for a computer program.',
              ],
            },
          ],
        },
      };
      
      // Default mock result for any word not in our mock dictionary
      const defaultResult: DictionaryResult = {
        word: cleanWord,
        phonetic: `/ˈ${cleanWord}/`,
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: ['A word with meaning and purpose.'],
          },
        ],
      };
      
      const result = mockDictionary[cleanWord] || defaultResult;
      
      // Create a readable content string
      const definitionsText = result.meanings
        .map(m => `(${m.partOfSpeech}) ${m.definitions[0]}`)
        .join('; ');
      
      return {
        content: `${result.word}: ${definitionsText}`,
        pluginData: result,
      };
    } catch (error) {
      console.error('Dictionary error:', error);
      throw new Error(`Couldn't find definition for "${word}". Please try another word.`);
    }
  },
  
  renderResult: (data: DictionaryResult) => (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold text-purple-800">{data.word}</h3>
          {data.phonetic && <div className="text-sm text-purple-600">{data.phonetic}</div>}
        </div>
        <BookOpen size={24} className="text-purple-500" />
      </div>
      
      <div className="mt-2">
        {data.meanings.map((meaning, index) => (
          <div key={index} className="mb-2">
            <div className="text-sm font-medium text-purple-700 italic">
              {meaning.partOfSpeech}
            </div>
            <ol className="mt-1 list-decimal list-inside">
              {meaning.definitions.map((def, i) => (
                <li key={i} className="text-gray-700">{def}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  ),
};