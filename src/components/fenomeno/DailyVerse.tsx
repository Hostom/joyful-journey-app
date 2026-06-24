import { useEffect, useState } from "react";

export type VerseData = {
  text: string;
  reference: string;
};

/** Curated list of complete, uplifting Bible references using Portuguese book names for bible-api.com */
export const VERSE_REFS = [
  "Salmos 23:1",
  "João 3:16",
  "Filipenses 4:13",
  "Romanos 8:28",
  "Isaías 40:31",
  "Salmos 46:1",
  "Mateus 5:16",
  "Provérbios 3:5",
  "Josué 1:9",
  "Mateus 6:33",
  "Salmos 119:105",
  "João 14:6",
];

/** Static fallbacks matching the exact curated list above — always complete */
export const BIBLE_FALLBACKS: Record<string, string> = {
  "Salmos 23:1": "O Senhor é o meu pastor; nada me faltará.",
  "João 3:16": "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
  "Filipenses 4:13": "Tudo posso naquele que me fortalece.",
  "Romanos 8:28": "Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.",
  "Isaías 40:31": "Mas os que esperam no Senhor renovam as suas forças, sobem com asas como águias, correm e não se cansam, caminham e não se fatigam.",
  "Salmos 46:1": "Deus é o nosso refúgio e fortaleza, socorro bem presente nas tribulações.",
  "Mateus 5:16": "Assim brilhe a luz de vocês diante dos homens, para que vejam as suas boas obras e glorifiquem ao Pai de vocês, que está nos céus.",
  "Provérbios 3:5": "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento.",
  "Josué 1:9": "Não te mandei eu? Esforça-te, e tem bom ânimo; não temas, nem te espantes; porque o Senhor teu Deus é contigo, por onde quer que andares.",
  "Mateus 6:33": "Buscai, pois, em primeiro lugar, o seu reino e a sua justiça, e todas estas coisas vos serão acrescentadas.",
  "Salmos 119:105": "Lâmpada para os meus pés é a tua palavra, e luz para os meus caminhos.",
  "João 14:6": "Disse-lhe Jesus: Eu sou o caminho, e a verdade e a vida; ninguém vem ao Pai, senão por mim.",
};

/** Pick today's verse deterministically by day of year using local timezone calendar values */
export function getTodaysRef(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonths = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let dayOfYear = date;
  for (let i = 0; i < month; i++) {
    dayOfYear += daysInMonths[i];
  }

  // Use 0-based index so the 1st day of the year resolves to index 0 (Salmos 23:1)
  return VERSE_REFS[(dayOfYear - 1) % VERSE_REFS.length];
}

/** Fetch today's verse from bible-api.com with almeida translation */
export async function fetchDailyVerse(): Promise<VerseData> {
  const reference = getTodaysRef();
  const fallbackText = BIBLE_FALLBACKS[reference] ?? BIBLE_FALLBACKS["João 3:16"];

  try {
    const response = await fetch(
      `https://bible-api.com/${encodeURIComponent(reference)}?translation=almeida`
    );
    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    if (data?.text && !data?.error) {
      return {
        text: data.text.trim(),
        reference: data.reference ?? reference,
      };
    }
  } catch (err) {
    console.warn("bible-api.com failed, using fallback", err);
  }

  return { text: fallbackText, reference };
}

type VerseState =
  | { status: "loading" }
  | { status: "ready"; verse: VerseData };

type VariantType = "light" | "dark";

export function DailyVerse({ variant = "dark" }: { variant?: VariantType }) {
  const [state, setState] = useState<VerseState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchDailyVerse().then((verse) => {
      if (!cancelled) setState({ status: "ready", verse });
    });
    return () => { cancelled = true; };
  }, []);

  const isDark = variant === "dark";
  const containerCls = isDark
    ? "border-t border-gold-champagne/20 pt-8"
    : "border-t border-forest-deep/10 pt-8";
  const labelCls = isDark
    ? "text-[10px] uppercase tracking-[0.3em] text-gold-champagne/80 mb-3 flex items-center gap-2"
    : "text-[10px] uppercase tracking-[0.3em] text-gold-classic mb-3 flex items-center gap-2";
  const textCls = isDark
    ? "font-display italic text-base md:text-lg leading-relaxed text-cream-foundation/90"
    : "font-display italic text-base md:text-lg leading-relaxed text-forest-deep";
  const refCls = isDark
    ? "mt-3 text-[11px] uppercase tracking-[0.2em] text-gold-champagne font-semibold font-sans"
    : "mt-3 text-[11px] uppercase tracking-[0.2em] text-gold-classic font-semibold font-sans";

  if (state.status === "loading") {
    return (
      <div className={containerCls}>
        <div className={labelCls}>
          <span className="material-symbols-outlined text-xs">auto_stories</span>
          Versículo do Dia
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-gold-champagne/40 animate-bounce [animation-delay:0ms]" />
          <div className="w-2 h-2 rounded-full bg-gold-champagne/40 animate-bounce [animation-delay:150ms]" />
          <div className="w-2 h-2 rounded-full bg-gold-champagne/40 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  return (
    <div className={containerCls}>
      <div className={labelCls}>
        <span className="material-symbols-outlined text-xs">auto_stories</span>
        Versículo do Dia
      </div>
      <blockquote>
        <p className={textCls}>"{state.verse.text}"</p>
        <footer className={refCls}>{state.verse.reference}</footer>
      </blockquote>
    </div>
  );
}
