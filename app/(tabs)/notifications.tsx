import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, ViewToken } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import { EmptyNotification } from '@/components/EmptyNotification';
import { NotificationCard } from '@/components/NotificationCard';
import { ThemedText } from '@/components/ThemedText';
import { NotificationType } from '@/components/types';
import { Colors } from '@/constants/Colors';
import { NotificationContext } from '@/storage/NotificationContext';

export default function NotificationsScreen() {
    const { notifications, updateNotification, loadNotifications } = useContext(NotificationContext);
    const [sortedNotifications, setSortedNotifications] = useState<NotificationType[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const isFocused = useIsFocused();
    const flatListRef = useRef<FlatList<NotificationType> | null>(null);

    const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (!isFocused) {
            return;
        }

        viewableItems.forEach((viewableItem) => {
            const notification: NotificationType = viewableItem.item;

            if (!notification.readAt) {
                setTimeout(() => {
                    updateNotification(notification.id, { readAt: new Date().toISOString() });
                }, 3000);
            }
        });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadNotifications();
        setRefreshing(false);
    };

    useEffect(() => {
        setSortedNotifications(
            [...notifications].sort((a: NotificationType, b: NotificationType) => {
                return new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime();
            }),
        );
    }, [notifications]);

    useEffect(() => {
        if (isFocused && flatListRef.current) {
            // Force FlatList to re-evaluate visible items
            flatListRef.current?.recordInteraction();
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <ThemedText type="title" textAlign="center">
                    Notifications <Ionicons name="notifications" size={25} color="black" />
                </ThemedText>
            </View>

            <FlatList
                ref={flatListRef}
                data={sortedNotifications}
                keyExtractor={(item: NotificationType) => item.notificationIdentifier}
                renderItem={({ item }) => <NotificationCard notification={item} />}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    waitForInteraction: true,
                    viewAreaCoveragePercentThreshold: 95,
                }}
                ListEmptyComponent={<EmptyNotification />}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        position: 'relative',
        height: 130,
        backgroundColor: Colors.pink,
        justifyContent: 'flex-end',
        padding: 10,
    },
});
