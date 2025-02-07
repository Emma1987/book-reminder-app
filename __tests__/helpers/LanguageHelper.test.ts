import { createLanguageItem, getLanguageItems, getLanguageItemByCode } from '@/helpers/LanguageHelper';
import { LanguageItemType } from '@/types/types';

jest.mock('@/i18n/translations', () => ({
    t: (key: string) => key, // Return key as value for simplicity
}));

jest.mock('@/types/types', () => ({
    FlagEnum: {
        EN: '🇬🇧',
        FR: '🇫🇷',
        ES: '🇪🇸',
        IT: '🇮🇹',
    },
    ApplicationLanguageEnum: {
        EN: 'en',
        FR: 'fr',
    },
    BookApiLanguageEnum: {
        EN: 'en',
        FR: 'fr',
        ES: 'es',
        IT: 'it',
    },
}));

describe('LanguageHelper', () => {
    it('should create a valid language item', () => {
        const key = 'EN';
        const value = 'en';
        const expected: LanguageItemType = {
            key: 'EN',
            code: 'en',
            language: 'languages.en',
            country: '🇬🇧',
        };

        expect(createLanguageItem(key, value)).toEqual(expected);
    });

    it('should return a sorted list of language items', () => {
        const languageItems = getLanguageItems();
        
        expect(Array.isArray(languageItems)).toBe(true);
        expect(languageItems).toHaveLength(4);

        // Ensure sorting order
        const expectedSortedLanguages = [
            { key: 'EN', code: 'en', language: 'languages.en', country: '🇬🇧' },
            { key: 'ES', code: 'es', language: 'languages.es', country: '🇪🇸' },
            { key: 'FR', code: 'fr', language: 'languages.fr', country: '🇫🇷' },
            { key: 'IT', code: 'it', language: 'languages.it', country: '🇮🇹' },
        ];
        expect(languageItems).toEqual(expectedSortedLanguages);
    });

    it('should return the correct language item by code', () => {
        const languageItem = getLanguageItemByCode('it');
        const expected: LanguageItemType = {
            key: 'IT',
            code: 'it',
            language: 'languages.it',
            country: '🇮🇹',
        };

        expect(languageItem).not.toBeNull();
        expect(languageItem).toEqual(expected);
    });

    it('should return null for an invalid language code', () => {
        expect(getLanguageItemByCode('invalid_code')).toBeNull();
    });
});
