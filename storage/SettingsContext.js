import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { setAppLocale } from '@/i18n/translations';
import { ApplicationLanguageEnum } from '@/types/types';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [applicationLanguage, setApplicationLanguage] = useState('');
    const [bookApiLanguage, setBookApiLanguage] = useState('');

    useEffect(() => {
        const loadSettings = async () => {
            const storedApplicationLanguage = await AsyncStorage.getItem('application-language');
            const storedBookApiLanguage = await AsyncStorage.getItem('book-api-language');

            let appLang = storedApplicationLanguage;
            let bookLang = storedBookApiLanguage;

            // ✅ If no saved language, set default from device locale
            if (!storedApplicationLanguage) {
                const locale = getLocales()[0].languageCode;
                const deviceLanguage = Object.values(ApplicationLanguageEnum).includes(locale)
                    ? locale
                    : ApplicationLanguageEnum.FRENCH;

                await AsyncStorage.setItem('application-language', deviceLanguage);
                appLang = deviceLanguage;
            }

            if (!storedBookApiLanguage) {
                await AsyncStorage.setItem('book-api-language', appLang);
                bookLang = appLang;
            }

            setApplicationLanguage(appLang);
            setBookApiLanguage(bookLang);
            setAppLocale(appLang);
        };

        loadSettings();
    }, []);

    const updateApplicationLanguage = async (language) => {
        setApplicationLanguage(language);
        setAppLocale(language);
        await AsyncStorage.setItem('application-language', language);
    };

    const updateBookApiLanguage = async (language) => {
        setBookApiLanguage(language);
        await AsyncStorage.setItem('book-api-language', language);
    };

    return (
        <SettingsContext.Provider
            value={{
                applicationLanguage,
                bookApiLanguage,
                updateApplicationLanguage,
                updateBookApiLanguage,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};
