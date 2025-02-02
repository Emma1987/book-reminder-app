import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { NotificationType } from '@/components/types';
import { Colors } from '@/constants/Colors';
import { timeAgo } from '@/helpers/DateHelper';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';

type NotificationCardProps = {
    notification: NotificationType;
};

export function NotificationCard({ notification }: NotificationCardProps) {
    const { getFavoriteById } = useContext(FavoriteBooksContext);

    const [timeAgoString, setTimeAgoString] = useState(timeAgo(notification.scheduledTime));

    const now = new Date();

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgoString(timeAgo(notification.scheduledTime));
        }, 60000);

        return () => clearInterval(interval);
    }, [notification.scheduledTime]);

    const book = getFavoriteById(notification.bookId);
    if (new Date(notification.scheduledTime) > now || !book) {
        return;
    }

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
                    accessibilityLabel="Book cover"
                />
            </View>
            <View style={styles.notificationContent}>
                <View style={styles.title}>
                    <ThemedText type="defaultSemiBold">New release!</ThemedText>
                    <View style={styles.notificationDate}>
                        <ThemedText type="info">{timeAgoString}</ThemedText>
                        {!notification.readAt && (
                            <FontAwesome name="circle" size={14} color={Colors.red} style={styles.newNotification} />
                        )}
                    </View>
                </View>
                <Text>{notification.content}</Text>
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
