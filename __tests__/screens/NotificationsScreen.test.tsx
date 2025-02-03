import React from 'react';
import { render } from '@testing-library/react-native';
import { littleSecretsBookNotification, hiddenPicturesBookNotification } from '@/__tests__/__fixtures__/fixtures';
import { NotificationContext } from '@/storage/NotificationContext';
import NotificationsScreen from '@/app/(tabs)/notifications';

// Mock components
jest.mock('@react-navigation/native', () => ({
    useIsFocused: jest.fn(() => true), // Always return focused
}));

jest.mock('@/components/NotificationCard', () => {
    const React = require('react');
    const { Text } = require('react-native');

    return {
        NotificationCard: ({ notification }) => (
            <Text>{notification.content}</Text>
        ),
    }
    
});

jest.mock('@/components/EmptyNotification', () => {
    const React = require('react');
    const { Text } = require('react-native');

    return {
        EmptyNotification: () => (
            <Text>No Notifications</Text>
        ),
    }
});

describe('NotificationsScreen', () => {
    it('renders notifications correctly', async () => {
        const { findByText } = render(
            <NotificationContext.Provider
                value={{
                    notifications: [littleSecretsBookNotification, hiddenPicturesBookNotification],
                    updateNotification: jest.fn(),
                    loadNotifications: jest.fn(),
                }}
            >
                <NotificationsScreen />
            </NotificationContext.Provider>
        );

        expect(findByText('New book released!')).toBeTruthy();
        expect(findByText('Another book released!')).toBeTruthy();
    });

    it('shows empty state if no notifications', async () => {
        const { findByText } = render(
            <NotificationContext.Provider
                value={{
                    notifications: [],
                    updateNotification: jest.fn(),
                    loadNotifications: jest.fn(),
                }}
            >
                <NotificationsScreen />
            </NotificationContext.Provider>
        );

        expect(findByText('No Notifications')).toBeTruthy();
    });
});
