import { useEffect } from 'react';

export type Fonts =
  | 'Roboto'
  | 'Raleway'
  | 'HankenGrotesk'
  | 'PlayfairDisplay'
  | 'Inter';
export const FONTS: Record<Fonts, { name: string; load: () => void }> = {
  Roboto: {
    name: 'Roboto',
    load: async () => {
      await import('@fontsource/roboto');
    }
  },
  Raleway: {
    name: 'Raleway',
    load: async () => {
      await import('@fontsource/raleway');
    }
  },
  HankenGrotesk: {
    name: 'HankenGrotesk',
    load: async () => {
      await import('@fontsource/hanken-grotesk');
    }
  },
  PlayfairDisplay: {
    name: 'PlayfairDisplay',
    load: async () => {
      await import('@fontsource/playfair-display');
    }
  },

  Inter: {
    name: 'Inter',
    load: async () => {
      await import('@fontsource/inter');
    }
  }

};

export default function Theme() {
  const root = document.documentElement.style;
  useEffect(() => {
    const fontRaleway = 'Raleway';
    const fontRoboto = 'Roboto';
    const fontHankenGrotesk = 'Hanken Grotesk';
    const fontPlayfairDisplay = 'Playfair Display';
    const fontInter = 'Inter';
    root.setProperty('--font', `"${fontRaleway}"`);
    root.setProperty('--font-raleway', `"${fontRaleway}"`);
    root.setProperty('--font-roboto', `"${fontRoboto}"`);
    root.setProperty('--font-hanken-grotesk', `"${fontHankenGrotesk}", sans-serif`);
    root.setProperty('--font-playfair-display', `"${fontPlayfairDisplay}"`);
    root.setProperty('--font-inter', `"${fontInter}"`);
    try {
      FONTS[fontRaleway]?.load();
      FONTS[fontRoboto]?.load();
      FONTS['HankenGrotesk']?.load();
      FONTS['PlayfairDisplay']?.load();
      FONTS[fontInter]?.load();
    } catch (err) {
      console.error(`Failed to load fonts`);
    }
  }, [root]);
  return null;
}
