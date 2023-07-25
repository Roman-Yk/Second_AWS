import en from './locales/en.json';
import ua from './locales/ua.json';
import nl from './locales/nl.json';


const urlQuery: Record<string, string> = window.location.search.slice(1).split("&").reduce((prev, curr) => {
  const [key, value] = curr.split("=");
  prev[key] = value;
  return prev;
}, {});

export enum Locales {
  en = 'en',
  ua = 'ua',
  nl = 'nl',
}

export const locale = urlQuery.locale in Locales ? urlQuery.locale : Locales.en;

export const dictionary = {
  [Locales.en]: en,
  [Locales.ua]: ua,
  [Locales.nl]: nl,
};
