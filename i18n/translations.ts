import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import fr from '@/i18n/app.fr.json';
import en from '@/i18n/app.en.json';

const i18n = new I18n({ ...en, ...fr });

i18n.locale = getLocales()[0].languageCode ?? 'fr';
i18n.enableFallback = true;

export const setAppLocale = (locale: string) => {
    i18n.locale = locale;
};

export default i18n;
