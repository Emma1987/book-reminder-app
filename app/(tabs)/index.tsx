import React, { useContext, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { BookCardWatchList } from '@/components/BookCardWatchList';
import { EmptyState } from '@/components/EmptyState';
import { Header } from '@/components/Header';
import { ThemedText } from '@/components/ThemedText';
import { BookType } from '@/components/types';
import { Colors } from '@/constants/Colors';
import { sortFavorites } from '@/helpers/BookHelper';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';

enum MenuEnum {
    COMING_SOON = 'comming-soon',
    AVAILABLE = 'available',
}

export default function WatchlistScreen() {
    const { favorites } = useContext(FavoriteBooksContext);
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
            <Header />

            <View style={styles.subHeaderContainer}>
                <ThemedText type="defaultSemiBold" style={styles.subHeaderContainerText}>
                    Stay updated on the latest releases!
                </ThemedText>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.menu}>
                    <TouchableOpacity
                        onPress={() => setMenu(MenuEnum.COMING_SOON)}
                        accessibilityLabel="See all the books coming soon"
                        style={getMenuItemStyle(MenuEnum.COMING_SOON)}
                    >
                        <Text style={styles.menuItemText}>Coming Soon ({upcoming.length})</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setMenu(MenuEnum.AVAILABLE)}
                        accessibilityLabel="See the books already available"
                        style={getMenuItemStyle(MenuEnum.AVAILABLE)}
                    >
                        <Text style={styles.menuItemText}>Available Now ({published.length})</Text>
                    </TouchableOpacity>
                </View>

                {menu === MenuEnum.COMING_SOON && (
                    <FlatList
                        data={upcoming}
                        keyExtractor={(item: BookType) => item.id}
                        renderItem={({ item }) => <BookCardWatchList book={item} />}
                        ListEmptyComponent={
                            <EmptyState
                                title="No upcoming books here!"
                                description="Add some books to your watchlist to see their release dates here."
                                imageSource={require('@/assets/images/no-book.png')}
                                buttonText="Browse Books"
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
                                title="No books already published!"
                                description="None of the books in your watchlist are already published."
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
    subHeaderContainer: {
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        padding: 20,
    },
    subHeaderContainerText: {
        color: Colors.whitesmoke,
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
