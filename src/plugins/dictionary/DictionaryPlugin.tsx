import React from 'react';
import axios from 'axios';
import { BasePlugin } from '../base/BasePlugin.tsx';
import { PluginResponse } from '../../types';
import { DictionaryCard } from './DictionaryCard';

interface DictionaryDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms: string[];
  antonyms: string[];
}

interface DictionaryResponse {
  word: string;
  phonetic: string;
  phonetics: Array<{
    text: string;
    audio?: string;
  }>;
  meanings: DictionaryMeaning[];
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}

interface DictionaryData {
  word: string;
  phonetic: string;
  phonetics: Array<{
    text: string;
    audio?: string;
  }>;
  meanings: DictionaryMeaning[];
  source: {
    name: string;
    url: string;
  };
}

export class DictionaryPlugin extends BasePlugin {
  constructor() {
    super(
      'dictionary',
      'define',
      'Get word definitions (e.g., /define hello)'
    );
  }

  async execute(args: string[]): Promise<PluginResponse<DictionaryData | null>> {
    if (!args.length) {
      return {
        success: false,
        data: null,
        error: 'Please provide a word to define'
      };
    }

    try {
      const word = args.join(' ');
      const response = await axios.get<DictionaryResponse[]>(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = response.data[0];

      return {
        success: true,
        data: {
          word: data.word,
          phonetic: data.phonetic,
          phonetics: data.phonetics,
          meanings: data.meanings.map(meaning => ({
            partOfSpeech: meaning.partOfSpeech,
            definitions: meaning.definitions.map(def => ({
              definition: def.definition,
              example: def.example,
              synonyms: def.synonyms,
              antonyms: def.antonyms
            })),
            synonyms: meaning.synonyms,
            antonyms: meaning.antonyms
          })),
          source: {
            name: data.license.name,
            url: data.sourceUrls[0]
          }
        }
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return {
            success: false,
            data: null,
            error: `Word "${args.join(' ')}" not found in dictionary`
          };
        }
        if (error.response?.status === 429) {
          return {
            success: false,
            data: null,
            error: 'Too many requests. Please try again later.'
          };
        }
      }
      return {
        success: false,
        data: null,
        error: 'Failed to fetch dictionary data. Please try again.'
      };
    }
  }

  protected renderSuccess(data: PluginResponse<DictionaryData | null>): React.ReactNode {
    if (!data.data) return null;
    return <DictionaryCard data={data.data} />;
  }
}