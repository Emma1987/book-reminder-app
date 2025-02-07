import React, { useContext, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { BookCardWatchList } from '@/components/BookCardWatchList';
import { EmptyState } from '@/components/EmptyState';
import { Header } from '@/components/Header';
import i18n from '@/i18n/translations';
import { Colors } from '@/constants/Colors';
import { sortFavorites } from '@/helpers/BookHelper';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';
import { SettingsContext } from '@/storage/SettingsContext';
import { BookType } from '@/types/types';

enum MenuEnum {
    COMING_SOON = 'comming-soon',
    AVAILABLE = 'available',
}

export default function WatchlistScreen() {
    const { favorites } = useContext(FavoriteBooksContext);
    const { applicationLanguage } = useContext(SettingsContext);
    const { published, upcoming } = useMemo(() => sortFavorites(favorites), [favorites]);
    const [menu, setMenu] = useState<MenuEnum>(MenuEnum.COMING_SOON);

    const getMenuItemStyle = (menuEnum: MenuEnum) => {
        if (menuEnum === menu) {
            return [styles.menuItem, styles.selectedMenu];
        }

        return [styles.menuItem];
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header subHeaderText={i18n.t('index.subheader')} />

            <View style={styles.contentContainer}>
                <View style={styles.menu}>
                    <TouchableOpacity
                        onPress={() => setMenu(MenuEnum.COMING_SOON)}
                        accessibilityLabel={i18n.t('index.coming_soon_placeholder')}
                        style={getMenuItemStyle(MenuEnum.COMING_SOON)}
                    >
                        <Text style={styles.menuItemText}>
                            {i18n.t('index.coming_soon', { number: upcoming.length })}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setMenu(MenuEnum.AVAILABLE)}
                        accessibilityLabel={i18n.t('index.available_placeholder')}
                        style={getMenuItemStyle(MenuEnum.AVAILABLE)}
                    >
                        <Text style={styles.menuItemText}>
                            {i18n.t('index.available', { number: published.length })}
                        </Text>
                    </TouchableOpacity>
                </View>

                {menu === MenuEnum.COMING_SOON && (
                    <FlatList
                        data={upcoming}
                        keyExtractor={(item: BookType) => item.id}
                        renderItem={({ item }) => <BookCardWatchList book={item} />}
                        ListEmptyComponent={
                            <EmptyState
                                title={i18n.t('empty_state_coming_soon.title')}
                                description={i18n.t('empty_state_coming_soon.description')}
                                imageSource={require('@/assets/images/no-book.png')}
                                buttonText={i18n.t('empty_state_coming_soon.button_text')}
                                onButtonPress={() => router.replace('/add')}
                            />
                        }
                    />
                )}

                {menu === MenuEnum.AVAILABLE && (
                    <FlatList
                        data={published}
                        keyExtractor={(item: BookType) => item.id}
                        renderItem={({ item }) => <BookCardWatchList book={item} />}
                        ListEmptyComponent={
                            <EmptyState
                                title={i18n.t('empty_state_available.title')}
                                description={i18n.t('empty_state_available.description')}
                                imageSource={require('@/assets/images/no-book.png')}
                            />
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    menuItem: {
        flex: 1,
        paddingBottom: 10,
        marginBottom: 20,
    },
    selectedMenu: {
        borderBottomWidth: 5,
        borderBottomColor: Colors.primaryColor,
    },
    menuItemText: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 500,
    },
});
