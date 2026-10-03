'use client';

import { useState, useEffect } from 'react';
import { Clipboard, CheckCircle2 } from 'lucide-react';
import ToolShell from '@/components/ui/ToolShell';

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
  ["([ंँ])([ािीुूृेैोः]*)", "$2$1"],
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
    output = output.replace(new RegExp(postRules[r][0], 'g'), postRules[r][1]);
  }
  return output;
}

export default function UnicodeConverter() {
  const [activeTab, setActiveTab] = useState<'preeti' | 'romanized'>('preeti');
  const [preetiInput, setPreetiInput] = useState('');
  const [romanizedInput, setRomanizedInput] = useState('');
  const [transliteratedOutput, setTransliteratedOutput] = useState('');
  const [transliterating, setTransliterating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (activeTab !== 'romanized') return;

    const timer = setTimeout(async () => {
      try {
        if (!romanizedInput.trim()) {
          setTransliteratedOutput('');
          return;
        }
        setTransliterating(true);
        const response = await fetch(
          `https://inputtools.google.com/request?text=${encodeURIComponent(
            romanizedInput
          )}&itc=ne-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`
        );
        const data = await response.json();

        if (data && data[0] === 'SUCCESS') {
          const words = data[1].map((result: [unknown, [string | null, ...string[]]]) => result?.[1]?.[0] || result?.[0] || '');
          setTransliteratedOutput(words.join(''));
        }
      } catch (err) {
        console.error('Transliteration API failed:', err);
      } finally {
        setTransliterating(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [romanizedInput, activeTab]);

  const unicodeOutput = activeTab === 'preeti' ? convertPreetiToUnicode(preetiInput) : transliteratedOutput;

  const handleCopy = () => {
    navigator.clipboard.writeText(unicodeOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabClass = (active: boolean) =>
    `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
      active ? 'bg-surface-raised text-ink shadow-sm' : 'text-ink-faint hover:text-ink-soft'
    }`;

  return (
    <ToolShell
      category="Utilities"
      title="Preeti to Unicode"
      badge="Nepali typing"
      description="Convert legacy Preeti font text to Unicode — or type Romanized English and get proper Nepali script in real time."
    >
      {/* Mode */}
      <div className="inline-flex p-1 gap-1 bg-paper-deep rounded-xl border border-line self-start">
        <button onClick={() => setActiveTab('preeti')} className={tabClass(activeTab === 'preeti')}>
          Preeti → Unicode
        </button>
        <button onClick={() => setActiveTab('romanized')} className={tabClass(activeTab === 'romanized')}>
          Type Romanized Nepali
        </button>
      </div>

      {/* Side-by-side editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        <section className="bg-surface border border-line rounded-2xl p-5 flex flex-col gap-3">
          <label className="text-[13px] font-medium text-ink-soft">
            {activeTab === 'preeti'
              ? <>Preeti font text <span className="text-ink-faint">— try “cfdf”</span></>
              : <>Type as it sounds <span className="text-ink-faint">— try “mero nam ram ho”</span></>}
          </label>
          {activeTab === 'preeti' ? (
            <textarea
              value={preetiInput}
              onChange={(e) => setPreetiInput(e.target.value)}
              placeholder="Paste Preeti text here…"
              className="flex-1 min-h-[240px] p-4 text-sm font-mono bg-surface-raised border border-line rounded-xl text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:border-simrik/60 focus-visible:ring-3 focus-visible:ring-simrik/10 resize-y transition-all"
            />
          ) : (
            <textarea
              value={romanizedInput}
              onChange={(e) => setRomanizedInput(e.target.value)}
              placeholder="nepal mero desh ho…"
              className="flex-1 min-h-[240px] p-4 text-base bg-surface-raised border border-line rounded-xl text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:border-simrik/60 focus-visible:ring-3 focus-visible:ring-simrik/10 resize-y transition-all"
            />
          )}
        </section>

        <section className="bg-surface border border-line rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <label className="text-[13px] font-medium text-ink-soft">
              Nepali Unicode
              {transliterating && (
                <span className="ml-2 text-[11px] text-brass animate-pulse">transliterating…</span>
              )}
            </label>
            {unicodeOutput && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 py-1 px-3 rounded-lg border border-line text-xs font-semibold text-ink-soft hover:text-simrik hover:border-simrik/40 transition-colors"
              >
                {copied
                  ? <><CheckCircle2 className="h-3.5 w-3.5 text-pine" /> Copied</>
                  : <><Clipboard className="h-3.5 w-3.5" /> Copy</>}
              </button>
            )}
          </div>
          <textarea
            readOnly
            value={unicodeOutput}
            placeholder="नेपाली यहाँ देखिनेछ…"
            className="flex-1 min-h-[240px] p-4 text-base bg-paper-deep/40 border border-line rounded-xl text-ink placeholder:text-ink-faint focus-visible:outline-none resize-y"
          />
        </section>
      </div>

      {/* Help */}
      <section className="border-t border-line pt-8 pb-10 max-w-xl space-y-3">
        <h2 className="font-display text-xl font-semibold text-ink">Typing tips</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-[13px] leading-relaxed text-ink-soft">
          <li>Romanized mode converts live as you type — spell words phonetically (“namaste” → “नमस्ते”).</li>
          <li>Preeti mode works instantly offline using the standard Preeti character map.</li>
          <li>Copy the result straight into Word, email or social posts — Unicode renders everywhere.</li>
        </ul>
      </section>
    </ToolShell>
  );
}
