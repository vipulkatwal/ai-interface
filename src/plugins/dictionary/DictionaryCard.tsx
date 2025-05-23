import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

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

interface DictionaryCardProps {
  data: DictionaryData;
}

export const DictionaryCard: React.FC<DictionaryCardProps> = ({ data }) => {
  const { word, phonetic, phonetics, meanings, source } = data;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const handleAudioPlay = async () => {
    if (!phonetics?.[0]?.audio) return;

    setIsLoading(true);
    setAudioError(false);

    try {
      const audio = new Audio(phonetics[0].audio);
      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      audio.onended = () => {
        setIsPlaying(false);
      };
      audio.onerror = () => {
        setAudioError(true);
        setIsLoading(false);
      };
      await audio.play();
    } catch {
      setAudioError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <div className="flex items-baseline gap-2">
        <div className="text-xl font-semibold">{word}</div>
        {phonetic && <div className="text-gray-600">{phonetic}</div>}
        {phonetics?.[0]?.audio && (
          <button
            onClick={handleAudioPlay}
            disabled={isLoading}
            className={`p-1 rounded-full hover:bg-blue-100 transition-colors ${
              isPlaying ? 'text-blue-600' : 'text-gray-500'
            }`}
            title={isPlaying ? 'Playing...' : 'Play pronunciation'}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : audioError ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {meanings.map((meaning, index) => (
          <div key={index} className="border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
            <div className="text-sm font-medium text-gray-500">
              {meaning.partOfSpeech}
            </div>
            <ul className="mt-2 space-y-3">
              {meaning.definitions.map((def, defIndex) => (
                <li key={defIndex} className="text-gray-700">
                  <div className="flex gap-2">
                    <span className="text-gray-500">{defIndex + 1}.</span>
                    <div>
                      <div>{def.definition}</div>
                      {def.example && (
                        <div className="text-sm text-gray-500 italic mt-1">
                          Example: {def.example}
                        </div>
                      )}
                      {def.synonyms && def.synonyms.length > 0 && (
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Synonyms:</span> {def.synonyms.join(', ')}
                        </div>
                      )}
                      {def.antonyms && def.antonyms.length > 0 && (
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Antonyms:</span> {def.antonyms.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {meaning.synonyms.length > 0 && (
              <div className="text-sm text-gray-500 mt-2">
                <span className="font-medium">Synonyms:</span> {meaning.synonyms.join(', ')}
              </div>
            )}
            {meaning.antonyms.length > 0 && (
              <div className="text-sm text-gray-500 mt-1">
                <span className="font-medium">Antonyms:</span> {meaning.antonyms.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {source && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
          Source: <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {source.name}
          </a>
        </div>
      )}
    </div>
  );
};