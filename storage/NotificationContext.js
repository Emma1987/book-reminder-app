import React, { createContext, setTimeout, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [notifications, setNotifications] = useState([]);

    const sortAndSetNotifications = (notifications) => {
        const sortedNotifications = notifications.sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime));
        setNotifications(sortedNotifications);
    };

    const countUnreadNotifications = (notifications) => {
        const now = new Date();
        return notifications.filter((notification) => {
            return new Date(notification.scheduledTime) <= now && !notification.readAt;
        }).length;
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    useEffect(() => {
        const unreadCount = countUnreadNotifications(notifications);
        setUnreadNotifications(unreadCount);
    }, [notifications]);

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(async (notification) => {
            setTimeout(async () => {
                await loadNotifications();
            }, 5000);
        });

        return () => subscription.remove();
    }, []);

    const loadNotifications = async () => {
        try {
            const storedNotifications = await AsyncStorage.getItem('notifications');

            if (storedNotifications) {
                const parsedNotifications = JSON.parse(storedNotifications);
                sortAndSetNotifications([...parsedNotifications]);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const addNotification = async (notification) => {
        const updatedNotifications = [...notifications, notification];
        sortAndSetNotifications(updatedNotifications);
        await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    };

    const updateNotification = async (notificationId, updatedFields) => {
        const updatedNotifications = notifications.map((notification) =>
            notification.id === notificationId ? { ...notification, ...updatedFields } : notification,
        );

        sortAndSetNotifications(updatedNotifications);
        await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    };

    const removeNotification = async (notificationId) => {
        const updatedNotifications = notifications.filter((notification) => notification.id !== notificationId);
        sortAndSetNotifications(updatedNotifications);
        await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    };

    const getNotificationByBookId = (bookId) => notifications.find((notification) => notification.bookId === bookId);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadNotifications,
                loadNotifications,
                addNotification,
                updateNotification,
                removeNotification,
                getNotificationByBookId,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
