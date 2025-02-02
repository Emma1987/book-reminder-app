import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Requests notification permission from the user.
 * @returns The current status of notification permissions ('granted', 'denied', or 'default').
 */
export const requestNotificationPermission = async (): Promise<string> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('Request notification permission: ', existingStatus);

    if (existingStatus === 'granted' || existingStatus === 'denied') {
        return existingStatus;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status;
};

/**
 * Checks if notifications are enabled (permission granted).
 * @returns True if notifications are enabled, false otherwise.
 */
export const areNotificationsEnabled = async (): Promise<boolean> => {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
};

/**
 * Saves the user's notification preference locally.
 * @param enabled Whether notifications are enabled or not.
 */
export const saveNotificationPreference = async (enabled: boolean) => {
    await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(enabled));
};

/**
 * Retrieves the user's notification preference.
 * @returns True if notifications are enabled, false otherwise.
 */
export const getNotificationPreference = async (): Promise<boolean> => {
    const value = await AsyncStorage.getItem('notificationsEnabled');
    return value ? JSON.parse(value) : false;
};

/**
 * Schedules a notification for a specific date and time.
 * @param title Title of the notification.
 * @param body Body content of the notification.
 * @param scheduledDate Date and time when the notification should trigger.
 */
export const scheduleNotification = async (
    title: string,
    body: string,
    scheduledDate: Date,
): Promise<string | null> => {
    try {
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                data: {},
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: scheduledDate,
            },
        });

        return identifier;
    } catch (error) {
        console.error('Error scheduling notification:', error);
    }

    return null;
};
