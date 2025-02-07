import React from 'react';
import { render } from '@testing-library/react-native';
import { today, littleSecretsBook, littleSecretsBookNotification, veryAnticipatedBook, veryAnticipatedBookNotification } from '@/__tests__/__fixtures__/fixtures';
import { ContextWrapper } from '@/__tests__/__fixtures__/context';
import { NotificationCard } from '@/components/NotificationCard';

jest.mock('expo-localization');
jest.mock('@/helpers/DateHelper', () => ({
    ...jest.requireActual('@/helpers/DateHelper'),
    timeAgo: jest.fn(() => '5 minutes ago'), 
}));

describe('NotificationCard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders notification information correctly', () => {
        const { getByText } = render(
            <ContextWrapper getFavoriteById={() => littleSecretsBook}>
                <NotificationCard notification={littleSecretsBookNotification} />
            </ContextWrapper>
        );

        expect(getByText('New release! 🚨')).toBeTruthy();
        expect(getByText('📚 "Little Secrets" was released on May 7, 2020!')).toBeTruthy();
        expect(getByText('5 minutes ago')).toBeTruthy();
        expect(getByText('circle')).toBeTruthy();
    });

    it('renders notification information correctly if the book was released today', () => {
        const mockBookReleasedToday = {
            ...littleSecretsBook,
            releaseDateRaw: today,
        };

        const { getByText } = render(
            <ContextWrapper getFavoriteById={() => mockBookReleasedToday}>
                <NotificationCard notification={littleSecretsBookNotification} />
            </ContextWrapper>
        );

        expect(getByText('New release! 🚨')).toBeTruthy();
        expect(getByText('📚 "Little Secrets" is released today! 🥳')).toBeTruthy();
        expect(getByText('5 minutes ago')).toBeTruthy();
        expect(getByText('circle')).toBeTruthy();
    });

    it('does not render if the book is not in favorites', () => {
        const { queryByText } = render(
            <ContextWrapper getFavoriteById={() => undefined}>
                <NotificationCard notification={littleSecretsBookNotification} />
            </ContextWrapper>
        );

        expect(queryByText('New release! 🚨')).toBeNull();
        expect(queryByText('5 minutes ago')).toBeNull();
        expect(queryByText('circle')).toBeNull();
    });

    it('returns null if notification is not scheduled to be sent yet', () => {
        const { queryByText } = render(
            <ContextWrapper getFavoriteById={() => veryAnticipatedBook}>
                <NotificationCard notification={veryAnticipatedBookNotification} />
            </ContextWrapper>
        );

        expect(queryByText('New release!')).toBeNull();
    });

    it('does not show unread indicator if notification is read', () => {
        const readNotification = { ...littleSecretsBookNotification, readAt: new Date() };
        const { queryByText } = render(
            <ContextWrapper getFavoriteById={() => littleSecretsBook}>
                <NotificationCard notification={readNotification} />
            </ContextWrapper>
        );

        expect(queryByText('circle')).toBeNull();
    });

    it('matches the snapshot', () => {
        const tree = render(
            <ContextWrapper getFavoriteById={() => littleSecretsBook}>
                <NotificationCard notification={littleSecretsBookNotification} />
            </ContextWrapper>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
