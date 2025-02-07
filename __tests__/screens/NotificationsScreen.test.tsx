import React from 'react';
import { render } from '@testing-library/react-native';
import { littleSecretsBookNotification, hiddenPicturesBookNotification } from '@/__tests__/__fixtures__/fixtures';
import { ContextWrapper } from '@/__tests__/__fixtures__/context';
import NotificationsScreen from '@/app/(tabs)/notifications';

jest.mock('@react-navigation/native', () => ({
    useIsFocused: jest.fn(() => true), // Always return focused
}));
jest.mock('expo-localization');

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
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders notifications correctly', async () => {
        const { getByText } = render(
            <ContextWrapper notifications={[littleSecretsBookNotification, hiddenPicturesBookNotification]}>
                <NotificationsScreen />
            </ContextWrapper>
        );

        expect(getByText('Little Secrets is released today!')).toBeTruthy();
        expect(getByText('Hidden Pictures is released today!')).toBeTruthy();
    });

    it('shows empty state if no notifications', async () => {
        const { getByText } = render(
            <ContextWrapper notifications={[]}>
                <NotificationsScreen />
            </ContextWrapper>
        );

        expect(getByText('No Notifications')).toBeTruthy();
    });
});
