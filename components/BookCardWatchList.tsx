import React, { useContext } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { BookType, NotificationType } from '@/components/types';
import { Colors } from '@/constants/Colors';
import { isPublished } from '@/helpers/BookHelper';
import { scheduleBookReleaseNotification } from '@/helpers/BookNotificationHelper';
import { formatDateStr } from '@/helpers/DateHelper';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';
import { NotificationContext } from '@/storage/NotificationContext';

type BookCardWatchListProps = {
    book: BookType;
};

export function BookCardWatchList({ book }: BookCardWatchListProps) {
    const { removeFavorite } = useContext(FavoriteBooksContext);
    const { addNotification, removeNotification, getNotificationByBookId } = useContext(NotificationContext);

    const notification: NotificationType | undefined = getNotificationByBookId(book.id);

    const getNotified = () => {
        const alertContent = `📚 The book "${book.title}" is set to be released on ${formatDateStr(book.releaseDateRaw, 'monthFirst')}.\n\nWould you like to receive a notification on the release date?`;

        Alert.alert('Stay Updated!', alertContent, [
            {
                text: 'No, thanks',
                style: 'cancel',
                onPress: () => console.log('Notification declined'),
            },
            {
                text: 'Yes, notify me!',
                style: 'default',
                onPress: async () => {
                    scheduleBookReleaseNotification(book, addNotification);
                },
            },
        ]);
    };

    const handleToggleNotification = () => {
        if (!notification) {
            getNotified();

            return;
        }

        removeNotification(notification.id);
    };

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
                onPress: () => {
                    if (notification) {
                        removeNotification(notification.id);
                    }

                    removeFavorite(book.id);
                },
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
                <ThemedText type="info">Release date: {formatDateStr(book.releaseDateRaw)}</ThemedText>
            </View>

            {/* Action Icons */}
            <View style={styles.actions}>
                {!isPublished(book) && (
                    <TouchableOpacity
                        onPress={handleToggleNotification}
                        accessibilityLabel="Notify me when the book is released"
                    >
                        <Ionicons
                            name={notification ? 'notifications' : 'notifications-off'}
                            size={20}
                            color={notification ? Colors.gold : Colors.gray}
                        />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={handleRemoveFavorite}
                    accessibilityLabel="Remove this book from your favorite list"
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
        gap: 5,
        alignItems: 'center',
    },
});
