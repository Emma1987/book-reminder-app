import React, { useCallback, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect } from 'expo-router';

import { BookCardSearchList } from '@/components/BookCardSearchList';
import { BookDetailModal } from '@/components/BookDetailModal';
import { ThemedText } from '@/components/ThemedText';
import { BookType } from '@/components/types';
import { Colors } from '@/constants/Colors';
import { useBookSearch } from '@/hooks/useBookSearch';

export default function AddBookScreen() {
    const [search, setSearch] = useState<string>('');
    const [selectedBook, setSelectedBook] = useState<BookType | null>(null);

    const { books, isLoading } = useBookSearch(search);

    const openModal = (book: BookType) => {
        setSelectedBook(book);
        Keyboard.dismiss();
    };
    const closeModal = () => setSelectedBook(null);

    const searchBook = (text: string) => setSearch(text);
    const resetSearch = () => setSearch('');

    useFocusEffect(useCallback(() => setSearch(''), []));

    return (
        <GestureHandlerRootView style={styles.container}>
            {/* Input container */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={(search) => searchBook(search)}
                    value={search}
                    placeholder="Search book"
                    accessibilityLabel="Search for a book"
                />
                {search ? (
                    <TouchableOpacity style={styles.icon} onPress={resetSearch}>
                        <Ionicons name="close-outline" size={25} color="gray" accessibilityLabel="Clear search input" />
                    </TouchableOpacity>
                ) : (
                    <Ionicons
                        name="search-outline"
                        size={25}
                        color="gray"
                        style={styles.icon}
                        accessibilityLabel="Search icon"
                    />
                )}
            </View>

            {/* Results container */}
            {isLoading ? (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#FF69B4" accessibilityHint="Loading" />
                    <Text style={styles.loadingText}>Loading books...</Text>
                </View>
            ) : (
                <FlatList
                    data={books}
                    keyExtractor={(item: BookType) => item.id}
                    renderItem={({ item }) => <BookCardSearchList book={item} onSeeDetails={() => openModal(item)} />}
                    ListEmptyComponent={
                        !(isLoading || search === '') ? (
                            <View style={styles.empty}>
                                <ThemedText type="info">No results found</ThemedText>
                            </View>
                        ) : (
                            <View></View>
                        )
                    }
                    refreshing={isLoading}
                    keyboardShouldPersistTaps="handled"
                />
            )}

            {/* Details modal */}
            {selectedBook && <BookDetailModal visible={!!selectedBook} onClose={closeModal} book={selectedBook} />}
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputContainer: {
        position: 'relative',
        height: 130,
        backgroundColor: Colors.pink,
        justifyContent: 'flex-end',
        padding: 10,
    },
    input: {
        height: 45,
        borderWidth: 1,
        borderColor: Colors.gray,
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
    empty: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
