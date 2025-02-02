import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { littleSecretsBook, veryAnticipatedBook } from '@/__tests__/__fixtures__/fixtures';
import { BookCardSearchList } from '@/components/BookCardSearchList';
import { scheduleBookReleaseNotification } from '@/helpers/BookNotificationHelper';
import { formatDateStr } from '@/helpers/DateHelper';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';
import { NotificationContext } from '@/storage/NotificationContext';

jest.mock('@/helpers/BookNotificationHelper', () => ({
    scheduleBookReleaseNotification: jest.fn(),
}));
jest.spyOn(Alert, 'alert');

describe('BookCardSearchList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders book information correctly', () => {
        const { getByText } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn()}}>
                    <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        expect(getByText('Little Secrets')).toBeTruthy();
        expect(getByText('Jennifer Hillier')).toBeTruthy();
        expect(getByText('Release date: 7 May 2020')).toBeTruthy();
    });

    it('renders only first author when several authors', () => {
        const mockBookWithSeveralAuthors = {
            ...littleSecretsBook,
            authors: ['Stephen King', 'Jennifer Hillier'],
        };

        const { getByText } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn()}}>
                    <BookCardSearchList book={mockBookWithSeveralAuthors} onSeeDetails={jest.fn()} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        expect(getByText('Little Secrets')).toBeTruthy();
        expect(getByText('Stephen King')).toBeTruthy();
        expect(getByText('Release date: 7 May 2020')).toBeTruthy();
    });

    it('renders placeholder image when coverImage is null', () => {
        const mockBookWithoutCover = {
            ...littleSecretsBook,
            coverImage: null,
        };
        
        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn()}}>
                    <BookCardSearchList book={mockBookWithoutCover} onSeeDetails={jest.fn()} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        const image = getByLabelText('Book cover');
        expect(image.props.source).toEqual(require('@/assets/images/book-cover-placeholder.jpg'));
    });

    it('renders book cover when coverImage is provided', () => {
        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn()}}>
                    <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );
    
        const image = getByLabelText('Book cover');
        expect(image.props.source).toEqual({ uri: 'https://book.com/little-secrets-cover.jpg' });
    });

    it('adds book to favorite when favorite button is clicked and book is not favorite', () => {
        const mockAddFavorite = jest.fn();
        const mockIsFavorite = jest.fn();
        mockIsFavorite.mockReturnValue(false);

        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: mockAddFavorite, removeFavorite: jest.fn(), isFavorite: mockIsFavorite}}>
                <NotificationContext.Provider value={{addNotification: jest.fn()}}>
                    <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        const favoriteButton = getByLabelText('Add to favorites');
        fireEvent.press(favoriteButton);

        expect(mockAddFavorite).toHaveBeenCalledWith(littleSecretsBook);
    });

    it('removes book from favorites when favorite button is clicked and book is already favorite', () => {
        const mockRemoveFavorite = jest.fn();
        const mockIsFavorite = jest.fn();
        mockIsFavorite.mockReturnValue(true);

        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: mockRemoveFavorite, isFavorite: mockIsFavorite}}>
                <NotificationContext.Provider value={{addNotification: jest.fn()}}>
                    <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        const favoriteButton = getByLabelText('Add to favorites');
        fireEvent.press(favoriteButton);

        expect(mockRemoveFavorite).toHaveBeenCalledWith(littleSecretsBook.id);
    });

    it('calls onSeeDetails when details button is clicked', () => {
        const mockOnSeeDetails = jest.fn();

        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn()}}>
                    <BookCardSearchList book={littleSecretsBook} onSeeDetails={mockOnSeeDetails} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        const detailsButton = getByLabelText('View book details');
        fireEvent.press(detailsButton);

        expect(mockOnSeeDetails).toHaveBeenCalledWith(littleSecretsBook);
    });

    it('has correct accessibility labels for the buttons', () => {
        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn()}}>
                    <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        const favoriteButton = getByLabelText('Add to favorites');
        expect(favoriteButton).toBeTruthy();

        const detailsButton = getByLabelText('View book details');
        expect(detailsButton).toBeTruthy();
    });

    it('shows alert when favoriting an unpublished book', () => {
        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn()}}>
                    <BookCardSearchList book={veryAnticipatedBook} onSeeDetails={jest.fn()} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        fireEvent.press(getByLabelText('Add to favorites'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Stay Updated!',
            expect.stringContaining(`The book "Very anticipated book!" is set to be released on ${formatDateStr(veryAnticipatedBook.releaseDateRaw, 'monthFirst')}`),
            expect.any(Array) // Ensures alert buttons are present
        );
    });

    it('schedules notification when clicking "Yes, notify me!"', async () => {
        const mockAddNotification = jest.fn();

        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: mockAddNotification}}>
                    <BookCardSearchList book={veryAnticipatedBook} onSeeDetails={jest.fn()} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        fireEvent.press(getByLabelText('Add to favorites'));

        const alertButtons = Alert.alert.mock.calls[0][2];

        // Simulate clicking "Yes, notify me!"
        await waitFor(() => alertButtons[1].onPress());

        fireEvent.press(getByLabelText('Add to favorites'));

        expect(scheduleBookReleaseNotification).toHaveBeenCalledTimes(1);
    });

    it('does not schedule notification when clicking "No, thanks"', () => {
        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn()}}>
                    <BookCardSearchList book={veryAnticipatedBook} onSeeDetails={jest.fn()} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        fireEvent.press(getByLabelText('Add to favorites'));

        const alertButtons = Alert.alert.mock.calls[0][2];

        // Simulate clicking "No, thanks"
        alertButtons[0].onPress();

        expect(scheduleBookReleaseNotification).not.toHaveBeenCalled();
    });

    it('matches the snapshot', () => {
        const tree = render(
            <FavoriteBooksContext.Provider value={{addFavorite: jest.fn(), removeFavorite: jest.fn(), isFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn()}}>
                    <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
