'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Clipboard, CheckCircle2, Info, Sparkles, Languages } from 'lucide-react';

const charMap: Record<string, string> = {
  "÷": "/", "v": "ख", "r": "च", "\"": "ू", "~": "ञ्", "z": "श", "ç": "ॐ", "f": "ा", 
  "b": "द", "n": "ल", "j": "व", "×": "×", "V": "ख्", "R": "च्", "ß": "द्म", "^": "६", 
  "Û": "!", "Z": "श्", "F": "ँ", "B": "द्य", "N": "ल्", "Ë": "ङ्ग", "J": "व्", "6": "ट", 
  "2": "द्द", "¿": "रू", ">": "श्र", ":": "स्", "§": "ट्ट", "&": "७", "£": "घ्", "•": "ड्ड", 
  ".": "।", "«": "्र", "*": "८", "„": "ध्र", "w": "ध", "s": "क", "g": "न", "æ": "“", 
  "c": "अ", "o": "य", "k": "प", "W": "ध्", "Ö": "=", "S": "क्", "Ò": "¨", "_": ")", 
  "[": "ृ", "Ú": "’", "G": "न्", "ˆ": "फ्", "C": "ऋ", "O": "इ", "Î": "ङ्ख", "K": "प्", 
  "7": "ठ", "¶": "ठ्ठ", "3": "घ", "9": "ढ", "?": "रु", ";": "स", "'": "ु", "#": "३", 
  "¢": "द्घ", "/": "र", "+": "ं", "ª": "ङ", "t": "त", "p": "उ", "|": "्र", "x": "ह", 
  "å": "द्व", "d": "म", "`": "ञ", "l": "ि", "h": "ज", "T": "त्", "P": "ए", "Ý": "ट्ठ", 
  "\\": "्", "Ù": ";", "X": "ह्", "Å": "हृ", "D": "म्", "@": "२", "Í": "ङ्क", "L": "ी", 
  "H": "ज्", "4": "द्ध", "±": "+", "0": "ण्", "<": "?", "8": "ड", "¥": "र्‍", "$": "४", 
  "¡": "ज्ञ्", ",": ",", "©": "र", "(": "९", "‘": "ॅ", "u": "ग", "q": "त्र", "}": "ै", 
  "y": "थ", "e": "भ", "a": "ब", "i": "ष्", "‰": "झ्", "U": "ग्", "Q": "त्त", "]": "े", 
  "˜": "ऽ", "Y": "थ्", "Ø": "्य", "E": "भ्", "A": "ब्", "M": "ः", "Ì": "न्न", "I": "क्ष्", 
  "5": "छ", "´": "झ", "1": "ज्ञ", "°": "ङ्ढ", "=": ".", "Æ": "”", "‹": "ङ्घ", "%": "५", 
  "¤": "झ्", "!": "१", "-": "(", "›": "द्र", ")": "०", "…": "‘", "Ü": "%"
};

const postRules: [string, string][] = [
  ["्ा", ""], 
  ["(त्र|त्त)([^उभप]+?)m", "$1m$2"], 
  ["त्रm", "क्र"], 
  ["त्तm", "क्त"], 
  ["([^उभप]+?)m", "m$1"], 
  ["उm", "ऊ"], 
  ["भm", "झ"], 
  ["पm", "फ"], 
  ["इ{", "ई"], 
  ["ि((.्)*[^्])", "$1ि"], 
  ["(.[ािीुूृेैोौंःँ]*?){", "{$1"], 
  ["((.्)*){", "{$1"], 
  ["{", "र्"], 
  ["([ाीुूृेैोौंःँ]+?)(्(.्)*[^्])", "$2$1"], 
  ["्([ाीुूृेैोौंःँ]+?)((.्)*[^्])", "्$2$1"], 
  ["([ंँ])([ािीुूृेैोौः]*)", "$2$1"], 
  ["ँँ", "ँ"], 
  ["ंं", "ं"], 
  ["ेे", "े"], 
  ["ैै", "ै"], 
  ["ुु", "ु"], 
  ["ूू", "ू"], 
  ["^ः", ":"], 
  ["टृ", "ट्ट"], 
  ["ेा", "ाे"], 
  ["ैा", "ाै"], 
  ["अाे", "ओ"], 
  ["अाै", "औ"], 
  ["अा", "आ"], 
  ["एे", "ऐ"], 
  ["ाे", "ो"], 
  ["ाै", "ौ"]
];

function convertPreetiToUnicode(text: string): string {
  let output = '';
  for (let i = 0; i < text.length; i++) {
    const letter = text[i];
    output += charMap[letter] || letter;
  }
  for (let r = 0; r < postRules.length; r++) {
    const rule = postRules[r];
    output = output.replace(new RegExp(rule[0], 'g'), rule[1]);
  }
  return output;
}

export default function UnicodeConverter() {
  const [activeTab, setActiveTab] = useState<'preeti' | 'romanized'>('preeti');
  
  // Preeti Converter State
  const [preetiInput, setPreetiInput] = useState('');
  
  // Romanized Transliteration State
  const [romanizedInput, setRomanizedInput] = useState('');
  const [transliteratedOutput, setTransliteratedOutput] = useState('');
  const [transliterating, setTransliterating] = useState(false);

  const [copied, setCopied] = useState(false);

  // Debounced Transliteration Effect for Romanized Nepali
  useEffect(() => {
    if (activeTab !== 'romanized' || !romanizedInput.trim()) {
      setTransliteratedOutput('');
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setTransliterating(true);
        // Call Google Input Tools Transliteration API for Nepali
        const response = await fetch(
          `https://inputtools.google.com/request?text=${encodeURIComponent(
            romanizedInput
          )}&itc=ne-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`
        );
        const data = await response.json();
        
        if (data && data[0] === 'SUCCESS') {
          // Parse dynamic words
          const results = data[1];
          const words = results.map((result: any) => result[1][0] || result[0]);
          setTransliteratedOutput(words.join(''));
        }
      } catch (err) {
        console.error('Transliteration API failed:', err);
      } finally {
        setTransliterating(false);
      }
    }, 450); // 450ms debounce window

    return () => clearTimeout(timer);
  }, [romanizedInput, activeTab]);

  const unicodeOutput = activeTab === 'preeti' ? convertPreetiToUnicode(preetiInput) : transliteratedOutput;

  const handleCopy = () => {
    navigator.clipboard.writeText(unicodeOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Languages className="h-3.5 w-3.5" /> Language & Typography
        </div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Nepali Type & Unicode Converter
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl font-medium">
          Convert legacy Preeti font text to Unicode, or type in Romanized English (e.g. "nepal") to get Nepali Unicode ("नेपाल") in real-time.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('preeti')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${activeTab === 'preeti' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Preeti to Unicode
        </button>
        <button
          onClick={() => setActiveTab('romanized')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-all ${activeTab === 'romanized' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Romanized Nepali (English → Nepali)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Input Column */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
            {activeTab === 'preeti' 
              ? 'Paste Preeti Font Text (e.g. "cfdf")' 
              : 'Type in Romanized English (e.g. "mero nam ram ho")'}
          </label>
          {activeTab === 'preeti' ? (
            <textarea
              value={preetiInput}
              onChange={(e) => setPreetiInput(e.target.value)}
              placeholder="Type or paste Preeti text here..."
              className="flex-1 w-full min-h-[220px] p-4 text-sm font-semibold border border-gray-250 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-y"
            />
          ) : (
            <textarea
              value={romanizedInput}
              onChange={(e) => setRomanizedInput(e.target.value)}
              placeholder="Type in Romanized English (e.g. sanchai hunuhunchha?)..."
              className="flex-1 w-full min-h-[220px] p-4 text-base font-semibold border border-gray-250 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          )}
        </div>

        {/* Output Column */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                Nepali Unicode Output
                {transliterating && (
                  <span className="text-[10px] text-blue-500 animate-pulse font-normal lowercase">transliterating...</span>
                )}
              </label>
              {unicodeOutput && (
                <button
                  onClick={handleCopy}
                  className="py-1 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Copied!
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-3.5 w-3.5 text-gray-400" /> Copy Text
                    </>
                  )}
                </button>
              )}
            </div>
            
            <textarea
              readOnly
              value={unicodeOutput}
              placeholder="Nepali output will appear here..."
              className="flex-1 w-full min-h-[220px] p-4 text-base font-extrabold border border-gray-250 dark:border-gray-700 rounded-2xl bg-blue-50/5 dark:bg-blue-950/5 focus:outline-none text-gray-900 dark:text-white resize-y"
            />
          </div>
        </div>
      </div>

      {/* Info Reference */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-750 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" /> How to use Romanized Transliteration?
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
          Simply type words as they sound in English. For example, type **"nepal"** to get **"नेपाल"**, or **"mero desh nepal ho"** to get **"मेरो देश नेपाल हो"**. 
          The engine dynamically uses Google's Input Tools transliteration services to suggest and output the correct phonetic Nepali characters.
        </p>
      </div>
    </div>
  );
}
