import axios from 'axios';
import type { Plugin } from '../types';
import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';

const BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

interface Definition {
  definition: string;
  example?: string;
}

interface DictionaryData {
  word: string;
  phonetic: string;
  meanings: {
    partOfSpeech: string;
    definitions: Definition[];
  }[];
}

const DictionaryPlugin: Plugin = {
  name: 'dictionary',
  description: 'Get definitions for words',
  triggerPattern: /^\/define\s+(.+)$/,

  async execute(args: string[]): Promise<DictionaryData> {
    const word = args[0].toLowerCase();
    try {
      const response = await axios.get(`${BASE_URL}/${word}`);
      const data = response.data[0];

      return {
        word: data.word,
        phonetic: data.phonetic || '',
        meanings: data.meanings.map((meaning: any) => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions.map((def: any) => ({
            definition: def.definition,
            example: def.example
          }))
        }))
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`No definition found for "${word}"`);
      }
      throw new Error('Failed to fetch definition');
    }
  },

  render(data: DictionaryData) {
    return (
      <Card variant="outlined" sx={{ maxWidth: 400, mt: 1 }}>
        <CardContent>
          <Typography variant="h6" component="div">
            {data.word}
            {data.phonetic && (
              <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                {data.phonetic}
              </Typography>
            )}
          </Typography>

          {data.meanings.map((meaning, index) => (
            <div key={index} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" color="primary" sx={{ mt: 2 }}>
                {meaning.partOfSpeech}
              </Typography>
              <List dense>
                {meaning.definitions.map((def, defIndex) => (
                  <ListItem key={defIndex}>
                    <ListItemText
                      primary={def.definition}
                      secondary={def.example}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
};

export default DictionaryPlugin;