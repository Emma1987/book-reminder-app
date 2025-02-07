import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { router } from 'expo-router';
import { littleSecretsBook, veryAnticipatedBook } from '@/__tests__/__fixtures__/fixtures';
import { ContextWrapper } from '@/__tests__/__fixtures__/context';
import WatchlistScreen from '@/app/(tabs)/index';

jest.mock('expo-router', () => ({
    router: {
        replace: jest.fn(),
    },
}));
jest.mock('expo-localization');

describe('WatchlistScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the screen correctly when favorites is empty', () => {
        const { getByText, getByLabelText } = render(
            <ContextWrapper favorites={[]}>
                <WatchlistScreen />
            </ContextWrapper>
        );

        // Logo is rendered
        expect(getByLabelText('Readly Logo')).toBeTruthy();

        // Subtitle is rendered
        expect(getByText('Stay updated on the latest book releases!')).toBeTruthy();

        // Check if upcoming empty state is rendered when there are no favorites
        const upcomingMenu = getByLabelText('See all upcoming books');
        fireEvent.press(upcomingMenu);
        expect(getByText('No upcoming books yet!')).toBeTruthy();

        // Check if available books empty state is rendered when there are no favorites
        const availableMenu = getByLabelText('See books that are already available');
        fireEvent.press(availableMenu);
        expect(getByText('No books available yet!')).toBeTruthy();
    });

    it('renders upcoming books in the correct section', async () => {
        const favorites = [littleSecretsBook];
        const { getByText, queryByText, getByLabelText } = render(
            <ContextWrapper favorites={favorites}>
                <WatchlistScreen />
            </ContextWrapper>
        );

        // The empty state in the "Coming soon" is rendered
        const upcomingMenu = getByLabelText('See all upcoming books');
        fireEvent.press(upcomingMenu);
        expect(getByText('No upcoming books yet!')).toBeTruthy();

        // The book is displayed in the "Available now" section, and the empty state is not rendered
        const availableMenu = getByLabelText('See books that are already available');
        fireEvent.press(availableMenu);
        expect(queryByText('No books available yet!')).toBeNull();
        expect(getByText('Little Secrets')).toBeTruthy();
    });

    it('renders available books in the correct section', async () => {
        const favorites = [veryAnticipatedBook];
        const { getByText, queryByText, getByLabelText } = render(
            <ContextWrapper favorites={favorites}>
                <WatchlistScreen />
            </ContextWrapper>
        );

        // The book is displayed in the "Coming soon" section, and the empty state is not rendered
        const upcomingMenu = getByLabelText('See all upcoming books');
        fireEvent.press(upcomingMenu);
        expect(queryByText('No upcoming books yet!')).toBeNull();
        expect(getByText('Very anticipated book!')).toBeTruthy();

        // The empty state in the "Available now" is rendered
        const availableMenu = getByLabelText('See books that are already available');
        fireEvent.press(availableMenu);
        expect(getByText('No books available yet!')).toBeTruthy();
    });

    it('calls router.replace when the "Browse Books" button is pressed', () => {
        const { getByText } = render(
            <ContextWrapper favorites={[]}>
                <WatchlistScreen />
            </ContextWrapper>
        );

        const browseButton = getByText('Browse Books');
        fireEvent.press(browseButton);
        expect(router.replace).toHaveBeenCalledWith('/add');
    });
});
