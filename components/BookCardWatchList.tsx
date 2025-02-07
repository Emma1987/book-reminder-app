import React, { useContext } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { BookType, NotificationType } from '@/types/types';
import { Colors } from '@/constants/Colors';
import { isPublished } from '@/helpers/BookHelper';
import { scheduleBookReleaseNotification } from '@/helpers/BookNotificationHelper';
import { formatDateStr } from '@/helpers/DateHelper';
import i18n from '@/i18n/translations';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';
import { NotificationContext } from '@/storage/NotificationContext';
import { SettingsContext } from '@/storage/SettingsContext';

type BookCardWatchListProps = {
    book: BookType;
};

export function BookCardWatchList({ book }: BookCardWatchListProps) {
    const { removeFavorite } = useContext(FavoriteBooksContext);
    const { addNotification, removeNotification, getNotificationByBookId } = useContext(NotificationContext);
    const { applicationLanguage } = useContext(SettingsContext);

    const notification: NotificationType | undefined = getNotificationByBookId(book.id);

    const getNotified = () => {
        const alertContent = i18n.t('book_notification.content', {
            bookTitle: book.title,
            bookReleaseDateRaw: formatDateStr(book.releaseDateRaw, applicationLanguage),
        });

        Alert.alert(i18n.t('book_notification.title'), alertContent, [
            {
                text: i18n.t('book_notification.cancel_button'),
                style: 'cancel',
                onPress: () => console.log('Notification declined'),
            },
            {
                text: i18n.t('book_notification.accept_button'),
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
        Alert.alert(i18n.t('remove_favorites.title'), i18n.t('remove_favorites.content', { bookTitle: book.title }), [
            {
                text: i18n.t('remove_favorites.cancel_button'),
                style: 'cancel',
                onPress: () => {},
            },
            {
                text: i18n.t('remove_favorites.accept_button'),
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
                <ThemedText type="info">
                    {i18n.t('book_details.release_date', {
                        releaseDate: formatDateStr(book.releaseDateRaw, applicationLanguage),
                    })}
                </ThemedText>
            </View>

            {/* Action Icons */}
            <View style={styles.actions}>
                {!isPublished(book) && (
                    <TouchableOpacity
                        onPress={handleToggleNotification}
                        accessibilityLabel={i18n.t('book_notification.button_label')}
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
                    accessibilityLabel={i18n.t('remove_favorites.button_label')}
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
