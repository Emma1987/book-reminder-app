import { LanguageItemType, ApplicationLanguageEnum, BookApiLanguageEnum, FlagEnum } from '@/types/types';
import i18n from '@/i18n/translations';

export const createLanguageItem = (key: string, value: string): LanguageItemType => {
    return {
        key,
        code: value,
        language: i18n.t(`languages.${value}`),
        country: FlagEnum[key as keyof typeof FlagEnum],
    };
};

export const getLanguageItems = (): LanguageItemType[] => {
    return Array.from(
        new Map(
            [...Object.entries(ApplicationLanguageEnum), ...Object.entries(BookApiLanguageEnum)].map(([key, value]) => [
                value,
                createLanguageItem(key, value),
            ]),
        ).values(),
    ).sort((a, b) => a.language.localeCompare(b.language));
};

export const getLanguageItemByCode = (code: string): LanguageItemType | null => {
    const languages = getLanguageItems();
    const language = languages.find((lang) => lang.code === code);

    return language ?? null;
};
