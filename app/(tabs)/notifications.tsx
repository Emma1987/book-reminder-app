import React, { useContext, useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

import { EmptyNotification } from '@/components/EmptyNotification';
import { Header } from '@/components/Header';
import { NotificationCard } from '@/components/NotificationCard';
import { Colors } from '@/constants/Colors';
import i18n from '@/i18n/translations';
import { NotificationContext } from '@/storage/NotificationContext';
import { SettingsContext } from '@/storage/SettingsContext';
import { NotificationType } from '@/types/types';

export default function NotificationsScreen() {
    const { notifications, updateNotification, loadNotifications } = useContext(NotificationContext);
    const { applicationLanguage } = useContext(SettingsContext);
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
            <Header subHeaderText={i18n.t('notifications_screen.subheader')} subHeaderIcon={'notifications'} />

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
