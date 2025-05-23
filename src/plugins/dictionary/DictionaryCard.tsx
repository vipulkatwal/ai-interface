import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2, ExternalLink } from 'lucide-react';

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
    <div className="backdrop-blur-md bg-white/60 border border-blue-100 rounded-2xl shadow-xl p-4 max-w-md animate-fadein-modern relative overflow-hidden">
      {/* Gradient accent bar */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400/60 via-blue-200/40 to-transparent rounded-l-2xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl font-extrabold text-blue-900 capitalize tracking-wide relative pb-1">
            {word}
            <span className="block w-8 h-0.5 bg-gradient-to-r from-blue-400 to-blue-200 rounded-full mt-1 absolute left-0 bottom-0" />
          </span>
          {phonetic && <span className="text-blue-500 text-base font-mono">{phonetic}</span>}
          {phonetics?.[0]?.audio && (
            <button
              onClick={handleAudioPlay}
              disabled={isLoading}
              className={`ml-2 p-1.5 rounded-full bg-white/70 shadow hover:bg-blue-100 transition-colors border border-blue-100 ${isPlaying ? 'text-blue-600' : 'text-blue-400'}`}
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
        <div className="space-y-4">
          {meanings.map((meaning, idx) => (
            <div key={idx}>
              <span className="inline-block bg-gradient-to-r from-blue-200 to-blue-100 text-blue-700 text-[10px] font-bold px-3 py-0.5 rounded-full mb-2 uppercase tracking-widest shadow-sm">
                {meaning.partOfSpeech}
              </span>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                {meaning.definitions.map((def, defIdx) => (
                  <li key={defIdx} className="text-blue-900 text-sm group transition-all">
                    <span className="group-hover:text-blue-700 transition-colors">{def.definition}</span>
                    {def.example && (
                      <div className="italic text-blue-600 text-xs mt-1 pl-2 border-l-4 border-blue-200 bg-blue-50/40 rounded-r-md">“{def.example}”</div>
                    )}
                  </li>
                ))}
              </ol>
              {meaning.synonyms.length > 0 && (
                <div className="mt-2 text-[11px] text-blue-700">
                  <span className="font-semibold">Synonyms:</span> {meaning.synonyms.join(', ')}
                </div>
              )}
              {meaning.antonyms.length > 0 && (
                <div className="text-[11px] text-blue-700 mt-1">
                  <span className="font-semibold">Antonyms:</span> {meaning.antonyms.join(', ')}
                </div>
              )}
              {idx < meanings.length - 1 && <hr className="my-3 border-blue-100" />}
            </div>
          ))}
        </div>
        {source && (
          <div className="mt-4 pt-2 border-t border-blue-100 text-[11px] text-blue-500 flex items-center gap-1">
            <ExternalLink className="w-3 h-3 inline-block mr-1" />
            Source: <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {source.name}
            </a>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadein-modern {
          from { opacity: 0; transform: scale(0.97) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};