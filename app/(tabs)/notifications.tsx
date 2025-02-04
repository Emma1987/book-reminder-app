import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import { EmptyNotification } from '@/components/EmptyNotification';
import { Header } from '@/components/Header';
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
        <SafeAreaView style={styles.container}>
            <Header />

            <View style={styles.subHeaderContainer}>
                <ThemedText type="defaultSemiBold" style={styles.subHeaderContainerText}>
                    <Ionicons name="notifications" size={15} color={Colors.whitesmoke} /> Notifications
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subHeaderContainer: {
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        padding: 20,
    },
    subHeaderContainerText: {
        color: Colors.whitesmoke,
    },
});
