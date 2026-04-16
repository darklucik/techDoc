'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import t, { Lang, Translations } from '@/lib/translations';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  T: Translations;
}

const Ctx = createContext<LangCtx>({
  lang:    'uz',
  setLang: () => {},
  T:       t.uz,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('uz');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved === 'uz' || saved === 'ru') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  return (
    <Ctx.Provider value={{ lang, setLang, T: t[lang] }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang() { return useContext(Ctx); }
