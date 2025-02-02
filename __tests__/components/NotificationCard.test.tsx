import React from 'react';
import { render } from '@testing-library/react-native';
import { littleSecretsBook, littleSecretsBookNotification, veryAnticipatedBook, veryAnticipatedBookNotification } from '@/__tests__/__fixtures__/fixtures';
import { NotificationCard } from '@/components/NotificationCard';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';
import { NotificationContext } from '@/storage/NotificationContext';

jest.mock('@/helpers/DateHelper', () => ({
    timeAgo: jest.fn(() => '5 minutes ago'),
}));

describe('NotificationCard', () => {
    it('renders notification information correctly', () => {
        const { getByText } = render(
            <FavoriteBooksContext.Provider value={{getFavoriteById: () => littleSecretsBook}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <NotificationCard notification={littleSecretsBookNotification} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        expect(getByText('New release!')).toBeTruthy();
        expect(getByText('Little Secrets is released today!')).toBeTruthy();
        expect(getByText('5 minutes ago')).toBeTruthy();
        expect(getByText('circle')).toBeTruthy();
    });

    it('does not render if the book is not in favorites', () => {
        const { queryByText } = render(
            <FavoriteBooksContext.Provider value={{getFavoriteById: () => undefined}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <NotificationCard notification={littleSecretsBookNotification} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        expect(queryByText('New release!')).toBeNull();
    });

    it('returns null if notification is not scheduled to be sent yet', () => {
        const { queryByText } = render(
            <FavoriteBooksContext.Provider value={{getFavoriteById: () => veryAnticipatedBook}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <NotificationCard notification={veryAnticipatedBookNotification} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        expect(queryByText('New release!')).toBeNull();
    });

    it('does not show unread indicator if notification is read', () => {
        const readNotification = { ...littleSecretsBookNotification, readAt: new Date() };
        const { queryByText } = render(
            <FavoriteBooksContext.Provider value={{getFavoriteById: () => littleSecretsBook}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <NotificationCard notification={readNotification} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        expect(queryByText('circle')).toBeNull();
    });

    it('matches the snapshot', () => {
        const tree = render(
            <FavoriteBooksContext.Provider value={{getFavoriteById: () => littleSecretsBook}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <NotificationCard notification={littleSecretsBookNotification} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
