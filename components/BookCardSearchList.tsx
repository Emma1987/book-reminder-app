import React, { useContext } from 'react';
import { Alert, Image, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { isPublished } from '@/helpers/BookHelper';
import { scheduleBookReleaseNotification } from '@/helpers/BookNotificationHelper';
import { formatDateStr } from '@/helpers/DateHelper';
import i18n from '@/i18n/translations';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';
import { NotificationContext } from '@/storage/NotificationContext';
import { SettingsContext } from '@/storage/SettingsContext';
import { BookType } from '@/types/types';

type BookCardSearchListProps = {
    book: BookType;
    onSeeDetails: (book: BookType) => void;
};

export function BookCardSearchList({ book, onSeeDetails }: BookCardSearchListProps) {
    const { addFavorite, removeFavorite, isFavorite } = useContext(FavoriteBooksContext);
    const { addNotification } = useContext(NotificationContext);
    const { applicationLanguage } = useContext(SettingsContext);

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

    const toggleFavorite = () => {
        Keyboard.dismiss();

        if (isFavorite(book.id)) {
            removeFavorite(book.id);
        } else {
            if (!isPublished(book) && book.releaseDateRaw !== null) {
                getNotified();
            }

            addFavorite(book);
        }
    };

    return (
        <View style={styles.container}>
            {/* Book Cover */}
            <TouchableOpacity
                onPress={() => onSeeDetails(book)}
                accessibilityLabel={i18n.t('book_details.view_details_label', { bookTitle: book.title })}
                accessibilityHint={i18n.t('book_details.view_details_label', { bookTitle: book.title })}
                style={styles.containerContent}
            >
                <Image
                    source={
                        book.coverImage
                            ? { uri: book.coverImage }
                            : require('@/assets/images/book-cover-placeholder.jpg')
                    }
                    style={styles.bookCover}
                    accessibilityRole="image"
                    accessibilityLabel={i18n.t('book_details.book_cover_label')}
                />

                {/* Book Description */}
                <View style={styles.bookDescription}>
                    <ThemedText type="subtitle">{book.title}</ThemedText>
                    <ThemedText type="defaultSemiBold">{book.authors?.[0] ?? ''}</ThemedText>
                    <Text>
                        {i18n.t('book_details.release_date', {
                            releaseDate: formatDateStr(book.releaseDateRaw, applicationLanguage),
                        })}
                    </Text>
                </View>

                {/* Action Icons */}
                <View style={styles.actions}>
                    <TouchableOpacity
                        onPress={toggleFavorite}
                        accessibilityLabel={i18n.t('book_details.add_favorites')}
                        accessibilityHint={i18n.t('book_details.add_favorites')}
                    >
                        {isFavorite(book.id) && <Ionicons name="heart" size={25} color={Colors.red} />}
                        {!isFavorite(book.id) && <Ionicons name="heart-outline" size={25} color={Colors.gray} />}
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: Colors.white,
    },
    containerContent: {
        flexDirection: 'row',
        alignItems: 'center',
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
        width: 40,
    },
});
