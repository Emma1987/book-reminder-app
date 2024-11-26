import React, { useContext } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { BookType } from '@/components/types';
import { Colors } from '@/constants/Colors';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';

type BookCardWatchListProps = {
    book: BookType;
};

export function BookCardWatchList({ book }: BookCardWatchListProps) {
    const { removeFavorite } = useContext(FavoriteBooksContext);

    const handleRemoveFavorite = () => {
        Alert.alert('Remove Favorite', `Are you sure you want to remove "${book.title}" from your favorites?`, [
            {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {},
            },
            {
                text: 'Remove',
                style: 'destructive',
                onPress: () => removeFavorite(book.id),
            },
        ]);
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
                <ThemedText type="defaultSemiBold">{book.title}</ThemedText>
                <ThemedText type="default">{book.authors?.[0] ?? ''}</ThemedText>
                <ThemedText type="info">Publication: {book.publicationDateStr}</ThemedText>
            </View>

            {/* Action Icons */}
            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={handleRemoveFavorite}
                    accessibilityLabel="Remove from favorites"
                    accessibilityHint="Removes this book from your favorites list"
                >
                    <Ionicons name="trash-outline" size={20} color={Colors.red} />
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
        backgroundColor: Colors.whitesmoke,
        borderRadius: 5,
        marginBottom: 5,
    },
    bookCover: {
        width: 40,
        height: 60,
    },
    bookDescription: {
        flex: 1,
        paddingLeft: 10,
    },
    actions: {
        width: 30,
        alignItems: 'center',
    },
});
