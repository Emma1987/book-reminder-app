import React, { useContext } from 'react';
import { Image, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { BookType } from '@/components/types';
import { Colors } from '@/constants/Colors';
import { formatDateStr } from '@/helpers/DateHelper';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';

type BookCardSearchListProps = {
    book: BookType;
    onSeeDetails: (book: BookType) => void;
};

export function BookCardSearchList({ book, onSeeDetails }: BookCardSearchListProps) {
    const { addFavorite, removeFavorite, isFavorite } = useContext(FavoriteBooksContext);

    const toggleFavorite = () => {
        Keyboard.dismiss();

        if (isFavorite(book.id)) {
            removeFavorite(book.id);
        } else {
            addFavorite(book);
        }
    };

    return (
        <View style={styles.container}>
            {/* Book Cover */}
            <Image
                source={
                    book.coverImage ? { uri: book.coverImage } : require('@/assets/images/book-cover-placeholder.jpg')
                }
                style={styles.bookCover}
                accessibilityRole="image"
                accessibilityLabel="Book cover"
            />

            {/* Book Description */}
            <View style={styles.bookDescription}>
                <ThemedText type="subtitle">{book.title}</ThemedText>
                <ThemedText type="defaultSemiBold">{book.authors?.[0] ?? ''}</ThemedText>
                <Text>Release date: {formatDateStr(book.releaseDateRaw)}</Text>
            </View>

            {/* Action Icons */}
            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={toggleFavorite}
                    accessibilityLabel="Add to favorites"
                    accessibilityHint="Adds this book to your favorites list"
                >
                    {isFavorite(book.id) && <Ionicons name="heart" size={25} color={Colors.red} />}
                    {!isFavorite(book.id) && <Ionicons name="heart-outline" size={25} color={Colors.gray} />}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onSeeDetails(book)}
                    accessibilityLabel="View book details"
                    accessibilityHint={`View more details about ${book.title}`}
                >
                    <Ionicons name="information-circle-outline" size={25} color={Colors.gray} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: Colors.white,
    },
    bookCover: {
        width: 60,
        height: 90,
    },
    bookDescription: {
        flex: 1,
        padding: 10,
    },
    actions: {
        width: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
