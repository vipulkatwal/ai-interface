import type { Plugin } from '../types/chat';
import { Card, CardContent, Typography, Divider, Box } from '@mui/material';
import React from 'react';
import axios from 'axios';

interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: Array<{
    definition: string;
    example?: string;
  }>;
  synonyms: string[];
  antonyms: string[];
}

interface DictionaryData {
  word: string;
  phonetic?: string;
  meanings: DictionaryMeaning[];
}

export const dictionaryPlugin: Plugin = {
  name: 'dictionary',
  description: 'Look up word definitions',
  command: '/define',
  regex: /^\/define\s+(.+)$/i,

  async execute(input: string): Promise<DictionaryData> {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(input.trim())}`;

    try {
      const response = await axios.get<DictionaryData[]>(url);
      return response.data[0];
    } catch {
      throw new Error('Could not find the definition for this word. Please check the spelling and try again.');
    }
  },

  renderResponse(data: DictionaryData) {
    return (
      <Card variant="outlined" sx={{ maxWidth: 400, my: 1 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {data.word}
          </Typography>
          {data.phonetic && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {data.phonetic}
            </Typography>
          )}
          {data.meanings.map((meaning, index) => (
            <React.Fragment key={index}>
              {index > 0 && <Divider sx={{ my: 1 }} />}
              <Typography variant="subtitle1" color="primary" sx={{ mt: 1 }}>
                {meaning.partOfSpeech}
              </Typography>
              {meaning.definitions.map((def, defIndex) => (
                <Box key={defIndex} sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    {defIndex + 1}. {def.definition}
                  </Typography>
                  {def.example && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Example: "{def.example}"
                    </Typography>
                  )}
                </Box>
              ))}
              {meaning.synonyms.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Synonyms: {meaning.synonyms.join(', ')}
                </Typography>
              )}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>
    );
  }
};