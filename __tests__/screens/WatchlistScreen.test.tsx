import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { littleSecretsBook, hiddenPicturesBook, veryAnticipatedBook, FavoriteBooksContextWrapper } from '@/__tests__/__fixtures__/fixtures';
import WatchlistScreen from '@/app/(tabs)/index';
import { BookCardWatchList } from '@/components/BookCardWatchList';
import { EmptyState } from '@/components/EmptyState';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';

jest.mock('expo-router', () => ({
    router: {
        replace: jest.fn(),
    },
}));

describe('WatchlistScreen', () => {
    it('renders the screen correctly when favorites is empty', () => {
        const { getByText } = render(
            <FavoriteBooksContextWrapper>
                <WatchlistScreen />
            </FavoriteBooksContextWrapper>
        );

        // Title is rendered
        expect(getByText('My Reading Watchlist')).toBeTruthy();

        // Subtitle is rendered
        expect(getByText('Stay updated on the latest releases!')).toBeTruthy();

        // Check if empty states are rendered when there are no favorite books
        expect(getByText('No upcoming books here!')).toBeTruthy();
        expect(getByText('No books already published!')).toBeTruthy();
    });

    it('renders upcoming books in the correct section', async () => {
        const favorites = [littleSecretsBook];
        const { getByText, queryByText, debug } = render(
            <FavoriteBooksContextWrapper favorites={favorites}>
                <WatchlistScreen />
            </FavoriteBooksContextWrapper>
        );

        // The empty state in the "Coming soon" is rendered
        expect(getByText('No upcoming books here!')).toBeTruthy();

        // The book is displayed in the "Available now" section, and the empty state is not rendered
        expect(queryByText('No books already published!')).toBeNull();
        expect(getByText('Little Secrets')).toBeTruthy();
    });

    it('renders available books in the correct section', async () => {
        const favorites = [veryAnticipatedBook];
        const { getByText, queryByText } = render(
            <FavoriteBooksContextWrapper favorites={favorites}>
                <WatchlistScreen />
            </FavoriteBooksContextWrapper>
        );

        // The book is displayed in the "Coming soon" section, and the empty state is not rendered
        expect(queryByText('No upcoming books here!')).toBeNull();
        expect(getByText('Very anticipated book!')).toBeTruthy();

        // The empty state in the "Available now" is rendered
        expect(getByText('No books already published!')).toBeTruthy();
    });

    it('calls router.replace when the "Browse Books" button is pressed', () => {
        const { getByText } = render(
            <FavoriteBooksContextWrapper>
                <WatchlistScreen />
            </FavoriteBooksContextWrapper>
        );

        const browseButton = getByText('Browse Books');
        fireEvent.press(browseButton);
        expect(router.replace).toHaveBeenCalledWith('/add');
    });
});
