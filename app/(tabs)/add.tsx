import React, { useCallback, useEffect, useState, useContext } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect } from 'expo-router';

import { BookCardSearchList } from '@/components/BookCardSearchList';
import { BookDetailModal } from '@/components/BookDetailModal';
import { EmptySearchResult } from '@/components/EmptySearchResult';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { useBookSearch } from '@/hooks/useBookSearch';
import i18n from '@/i18n/translations';
import { SettingsContext } from '@/storage/SettingsContext';
import { BookType } from '@/types/types';

export default function AddBookScreen() {
    const { applicationLanguage, bookApiLanguage } = useContext(SettingsContext);

    const [search, setSearch] = useState<string>('');
    const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    const { books, isLoading } = useBookSearch(search, bookApiLanguage);

    const openModal = (book: BookType) => {
        setSelectedBook(book);
        Keyboard.dismiss();
    };
    const closeModal = () => setSelectedBook(null);

    const searchBook = (text: string) => setSearch(text);
    const resetSearch = () => setSearch('');

    useEffect(() => {
        if (search !== '') {
            const handler = setTimeout(() => {
                setDebouncedSearch(search);
                setSelectedBook(null);
            }, 1000);

            return () => clearTimeout(handler);
        }

        setDebouncedSearch(search);
        setSelectedBook(null);
    }, [search]);

    useFocusEffect(useCallback(() => setSearch(''), []));

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <GestureHandlerRootView>
                <Header />

                {/* Input container */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(search) => searchBook(search)}
                        value={search}
                        placeholder={i18n.t('add_screen.input_placeholder')}
                        accessibilityLabel={i18n.t('add_screen.input_placeholder')}
                        autoCorrect={false}
                    />
                    {search ? (
                        <TouchableOpacity style={styles.icon} onPress={resetSearch}>
                            <Ionicons
                                name="close-outline"
                                size={25}
                                color={Colors.primaryColor}
                                accessibilityLabel={i18n.t('add_screen.clear_input_icon_label')}
                            />
                        </TouchableOpacity>
                    ) : (
                        <Ionicons
                            name="search-outline"
                            size={25}
                            color={Colors.primaryColor}
                            style={styles.icon}
                            accessibilityLabel={i18n.t('add_screen.search_icon_label')}
                        />
                    )}
                </View>

                {/* Results container */}
                {isLoading ? (
                    <View style={styles.spinnerContainer}>
                        <ActivityIndicator
                            size="large"
                            color={Colors.pink}
                            accessibilityHint={i18n.t('add_screen.loading_text')}
                        />
                        <Text style={styles.loadingText}>{i18n.t('add_screen.loading_text')}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={books}
                        keyExtractor={(item: BookType) => item.id}
                        renderItem={({ item }) => (
                            <BookCardSearchList book={item} onSeeDetails={() => openModal(item)} />
                        )}
                        ListEmptyComponent={
                            !(isLoading || debouncedSearch === '') ? <EmptySearchResult /> : <View></View>
                        }
                        refreshing={isLoading}
                        keyboardShouldPersistTaps="handled"
                    />
                )}

                {/* Details modal */}
                {selectedBook && <BookDetailModal visible={!!selectedBook} onClose={closeModal} book={selectedBook} />}
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        padding: 10,
    },
    input: {
        height: 45,
        borderWidth: 2,
        borderColor: Colors.primaryColor,
        color: Colors.primaryColor,
        fontWeight: 500,
        borderRadius: 10,
        padding: 10,
    },
    icon: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: Colors.gray,
    },
    flatlist: {
        flex: 1,
        paddingBottom: 0,
    },
});
