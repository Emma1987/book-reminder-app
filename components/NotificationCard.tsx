import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { isToday } from 'date-fns';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { formatDateStr, getDateObject, timeAgo } from '@/helpers/DateHelper';
import i18n from '@/i18n/translations';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';
import { SettingsContext } from '@/storage/SettingsContext';
import { BookType, NotificationType } from '@/types/types';

type NotificationCardProps = {
    notification: NotificationType;
};

export function NotificationCard({ notification }: NotificationCardProps) {
    const { getFavoriteById } = useContext(FavoriteBooksContext);
    const { applicationLanguage } = useContext(SettingsContext);
    const [timeAgoString, setTimeAgoString] = useState(timeAgo(notification.scheduledTime));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgoString(timeAgo(notification.scheduledTime));
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setTimeAgoString(timeAgo(notification.scheduledTime));
    }, [applicationLanguage, notification.scheduledTime]);

    const now = new Date();
    const book: BookType | undefined = getFavoriteById(notification.bookId);
    if (new Date(notification.scheduledTime) > now || !book) {
        return;
    }

    const releaseDate = getDateObject(book.releaseDateRaw);
    const notificationContent =
        releaseDate && isToday(releaseDate)
            ? i18n.t('notifications_screen.notification_content_today', { bookTitle: book.title })
            : i18n.t('notifications_screen.notification_content_past', {
                  bookTitle: book.title,
                  bookReleaseDate: formatDateStr(book.releaseDateRaw, applicationLanguage),
              });

    return (
        <View style={styles.container}>
            <View>
                <Image
                    source={
                        book?.coverImage
                            ? { uri: book.coverImage }
                            : require('@/assets/images/book-cover-placeholder.jpg')
                    }
                    style={styles.bookCover}
                    accessibilityRole="image"
                    accessibilityLabel={i18n.t('book_details.book_cover_label')}
                />
            </View>
            <View style={styles.notificationContent}>
                <View style={styles.title}>
                    <ThemedText type="defaultSemiBold">{i18n.t('notifications_screen.notification_title')}</ThemedText>
                    <View style={styles.notificationDate}>
                        <ThemedText type="info">{timeAgoString}</ThemedText>
                        {!notification.readAt && (
                            <FontAwesome name="circle" size={14} color={Colors.red} style={styles.newNotification} />
                        )}
                    </View>
                </View>
                <Text>{notificationContent}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderColor: Colors.white,
    },
    bookCover: {
        width: 40,
        height: 65,
        marginRight: 10,
    },
    notificationContent: {
        flex: 1,
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 5,
    },
    notificationDate: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    newNotification: {
        paddingLeft: 5,
    },
});
