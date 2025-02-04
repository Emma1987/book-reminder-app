import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import { littleSecretsBook, veryAnticipatedBook } from '@/__tests__/__fixtures__/fixtures';
import WatchlistScreen from '@/app/(tabs)/index';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';
import { NotificationContext } from '@/storage/NotificationContext';

jest.mock('expo-router', () => ({
    router: {
        replace: jest.fn(),
    },
}));

describe('WatchlistScreen', () => {
    it('renders the screen correctly when favorites is empty', () => {
        const { getByText, getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{favorites: [], removeFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <WatchlistScreen />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        // Logo is rendered
        expect(getByLabelText('Readly Logo')).toBeTruthy();

        // Subtitle is rendered
        expect(getByText('Stay updated on the latest releases!')).toBeTruthy();

        // Check if upcoming empty state is rendered when there are no favorites
        const upcomingMenu = getByLabelText('See all the books coming soon');
        fireEvent.press(upcomingMenu);
        expect(getByText('No upcoming books here!')).toBeTruthy();

        // Check if available books empty state is rendered when there are no favorites
        const availableMenu = getByLabelText('See the books already available');
        fireEvent.press(availableMenu);
        expect(getByText('No books already published!')).toBeTruthy();
    });

    it('renders upcoming books in the correct section', async () => {
        const favorites = [littleSecretsBook];
        const { getByText, queryByText, getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{favorites: favorites, removeFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <WatchlistScreen />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        // The empty state in the "Coming soon" is rendered
        const upcomingMenu = getByLabelText('See all the books coming soon');
        fireEvent.press(upcomingMenu);
        expect(getByText('No upcoming books here!')).toBeTruthy();

        // The book is displayed in the "Available now" section, and the empty state is not rendered
        const availableMenu = getByLabelText('See the books already available');
        fireEvent.press(availableMenu);
        expect(queryByText('No books already published!')).toBeNull();
        expect(getByText('Little Secrets')).toBeTruthy();
    });

    it('renders available books in the correct section', async () => {
        const favorites = [veryAnticipatedBook];
        const { getByText, queryByText, getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{favorites: favorites, removeFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <WatchlistScreen />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        // The book is displayed in the "Coming soon" section, and the empty state is not rendered
        const upcomingMenu = getByLabelText('See all the books coming soon');
        fireEvent.press(upcomingMenu);
        expect(queryByText('No upcoming books here!')).toBeNull();
        expect(getByText('Very anticipated book!')).toBeTruthy();

        // The empty state in the "Available now" is rendered
        const availableMenu = getByLabelText('See the books already available');
        fireEvent.press(availableMenu);
        expect(getByText('No books already published!')).toBeTruthy();
    });

    it('calls router.replace when the "Browse Books" button is pressed', () => {
        const { getByText } = render(
            <FavoriteBooksContext.Provider value={{favorites: [], removeFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <WatchlistScreen />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        const browseButton = getByText('Browse Books');
        fireEvent.press(browseButton);
        expect(router.replace).toHaveBeenCalledWith('/add');
    });
});
