import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SelectDropdown from 'react-native-select-dropdown';
import CountryFlag from 'react-native-country-flag';

import { Header } from '@/components/Header';
import { Separator } from '@/components/Separator';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import i18n from '@/i18n/translations';
import { getLanguageItems, getLanguageItemByCode } from '@/helpers/LanguageHelper';
import { SettingsContext } from '@/storage/SettingsContext';
import { LanguageItemType, ApplicationLanguageEnum, BookApiLanguageEnum } from '@/types/types';

export default function SettingsScreen() {
    const { applicationLanguage, updateApplicationLanguage, bookApiLanguage, updateBookApiLanguage } =
        useContext(SettingsContext);
    const [languages, setLanguages] = useState<LanguageItemType[]>(getLanguageItems());
    const [appLangDropdownItem, setAppLangDropdownItem] = useState<LanguageItemType | null>(null);
    const [bookApiLangDropdownItem, setBookApiLangDropdownItem] = useState<LanguageItemType | null>(null);

    const appLangItems = Object.entries(ApplicationLanguageEnum)
        .map(([_, value]) => languages.find((lang) => lang.code === value))
        .filter(Boolean) as LanguageItemType[];

    const bookApiLangItems = Object.entries(BookApiLanguageEnum)
        .map(([_, value]) => languages.find((lang) => lang.code === value))
        .filter(Boolean) as LanguageItemType[];

    const renderSelectLanguageButton = (selectedItem: LanguageItemType, isOpened: boolean) => {
        return (
            <View style={styles.dropdownButtonStyle}>
                {selectedItem ? (
                    <>
                        <CountryFlag isoCode={selectedItem.country} size={18} />
                        <Text>{selectedItem.language}</Text>
                    </>
                ) : (
                    <Text>{i18n.t('settings_screen.select_placeholder')}</Text>
                )}
                <Ionicons name={isOpened ? 'chevron-up' : 'chevron-down'} size={15} />
            </View>
        );
    };

    const renderSelectLanguageItem = (item: LanguageItemType, index: number, isSelected: boolean) => {
        const style = isSelected
            ? [styles.dropdownItemStyle, styles.dropdownSelectedItemStyle]
            : styles.dropdownItemStyle;

        return (
            <View style={style}>
                <CountryFlag isoCode={item.country} size={10} style={styles.flag} />
                <Text style={styles.dropdownItemTxtStyle}>{item.language}</Text>
            </View>
        );
    };

    useEffect(() => {
        setLanguages(getLanguageItems());
        setAppLangDropdownItem(applicationLanguage === null ? null : getLanguageItemByCode(applicationLanguage));
        setBookApiLangDropdownItem(bookApiLanguage === null ? null : getLanguageItemByCode(bookApiLanguage));
    }, [applicationLanguage, bookApiLanguage]);

    return (
        <SafeAreaView style={styles.container}>
            <Header subHeaderText={i18n.t('settings_screen.subheader')} subHeaderIcon={'settings'} />

            <View style={styles.contentContainer}>
                <View>
                    <ThemedText type="defaultSemiBold">{i18n.t('settings_screen.app_title')}</ThemedText>

                    <View style={styles.settingContainer}>
                        <ThemedText type="default">{i18n.t('settings_screen.app_language_label')}</ThemedText>
                        <SelectDropdown
                            data={appLangItems}
                            onSelect={(selectedItem) => selectedItem && updateApplicationLanguage(selectedItem.code)}
                            renderButton={renderSelectLanguageButton}
                            renderItem={renderSelectLanguageItem}
                            showsVerticalScrollIndicator={false}
                            dropdownStyle={styles.dropdownMenuStyle}
                            defaultValue={appLangDropdownItem}
                        />
                    </View>
                </View>

                <Separator />

                <View>
                    <ThemedText type="defaultSemiBold">{i18n.t('settings_screen.book_api_title')}</ThemedText>
                    <View style={styles.settingContainer}>
                        <ThemedText type="default">{i18n.t('settings_screen.book_api_language_label')}</ThemedText>
                        <SelectDropdown
                            data={bookApiLangItems}
                            onSelect={(selectedItem) => selectedItem && updateBookApiLanguage(selectedItem.code)}
                            renderButton={renderSelectLanguageButton}
                            renderItem={renderSelectLanguageItem}
                            showsVerticalScrollIndicator={false}
                            dropdownStyle={styles.dropdownMenuStyle}
                            disableAutoScroll
                            defaultValue={bookApiLangDropdownItem}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 10,
    },
    settingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
    },
    dropdownButtonStyle: {
        width: '40%',
        backgroundColor: Colors.secondaryColor,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    dropdownMenuStyle: {
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownSelectedItemStyle: {
        backgroundColor: Colors.secondaryColor,
    },
    dropdownItemTxtStyle: {
        flex: 1,
    },
    flag: {
        marginRight: 5,
    },
});
