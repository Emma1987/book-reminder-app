import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { littleSecretsBook, veryAnticipatedBook } from '@/__tests__/__fixtures__/fixtures';
import { ContextWrapper } from '@/__tests__/__fixtures__/context';
import { BookCardSearchList } from '@/components/BookCardSearchList';
import { scheduleBookReleaseNotification } from '@/helpers/BookNotificationHelper';
import { formatDateStr } from '@/helpers/DateHelper';

jest.mock('@/helpers/BookNotificationHelper', () => ({
    scheduleBookReleaseNotification: jest.fn(),
}));
jest.mock('expo-localization');
jest.spyOn(Alert, 'alert');

describe('BookCardSearchList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders book information correctly', () => {
        const { getByText } = render(
            <ContextWrapper>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
            </ContextWrapper>
        );

        expect(getByText('Little Secrets')).toBeTruthy();
        expect(getByText('Jennifer Hillier')).toBeTruthy();
        expect(getByText('Release date: May 7, 2020')).toBeTruthy();
    });

    it('renders only first author when several authors', () => {
        const mockBookWithSeveralAuthors = {
            ...littleSecretsBook,
            authors: ['Stephen King', 'Jennifer Hillier'],
        };

        const { getByText } = render(
            <ContextWrapper>
                <BookCardSearchList book={mockBookWithSeveralAuthors} onSeeDetails={jest.fn()} />
            </ContextWrapper>
        );

        expect(getByText('Little Secrets')).toBeTruthy();
        expect(getByText('Stephen King')).toBeTruthy();
        expect(getByText('Release date: May 7, 2020')).toBeTruthy();
    });

    it('renders placeholder image when coverImage is null', () => {
        const mockBookWithoutCover = {
            ...littleSecretsBook,
            coverImage: null,
        };
        
        const { getByLabelText } = render(
            <ContextWrapper>
                <BookCardSearchList book={mockBookWithoutCover} onSeeDetails={jest.fn()} />
            </ContextWrapper>
        );

        const image = getByLabelText('Book cover');
        expect(image.props.source).toEqual(require('@/assets/images/book-cover-placeholder.jpg'));
    });

    it('renders book cover when coverImage is provided', () => {
        const { getByLabelText } = render(
            <ContextWrapper>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
            </ContextWrapper>
        );
    
        const image = getByLabelText('Book cover');
        expect(image.props.source).toEqual({ uri: 'https://book.com/little-secrets-cover.jpg' });
    });

    it('adds book to favorite when favorite button is clicked and book is not favorite', () => {
        const mockAddFavorite = jest.fn();
        const mockIsFavorite = jest.fn();
        mockIsFavorite.mockReturnValue(false);

        const { getByLabelText } = render(
            <ContextWrapper addFavorite={mockAddFavorite} isFavorite={mockIsFavorite}>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
            </ContextWrapper>
        );

        const favoriteButton = getByLabelText('Add this book to your favorites');
        fireEvent.press(favoriteButton);

        expect(mockAddFavorite).toHaveBeenCalledWith(littleSecretsBook);
    });

    it('has correct accessibility labels for the buttons', () => {
        const { getByLabelText } = render(
            <ContextWrapper>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
            </ContextWrapper>
        );

        const favoriteButton = getByLabelText('Add this book to your favorites');
        expect(favoriteButton).toBeTruthy();

        const detailsButton = getByLabelText('View more details about "Little Secrets"');
        expect(detailsButton).toBeTruthy();
    });

    it('removes book from favorites when favorite button is clicked and book is already favorite', () => {
        const mockRemoveFavorite = jest.fn();
        const mockIsFavorite = jest.fn();
        mockIsFavorite.mockReturnValue(true);

        const { getByLabelText } = render(
            <ContextWrapper removeFavorite={mockRemoveFavorite} isFavorite={mockIsFavorite}>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
            </ContextWrapper>
        );

        const favoriteButton = getByLabelText('Add this book to your favorites');
        fireEvent.press(favoriteButton);

        expect(mockRemoveFavorite).toHaveBeenCalledWith(littleSecretsBook.id);
    });

    it('calls onSeeDetails when details button is clicked', () => {
        const mockOnSeeDetails = jest.fn();

        const { getByLabelText } = render(
            <ContextWrapper>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={mockOnSeeDetails} />
            </ContextWrapper>
        );

        const detailsButton = getByLabelText('View more details about "Little Secrets"');
        fireEvent.press(detailsButton);

        expect(mockOnSeeDetails).toHaveBeenCalledWith(littleSecretsBook);
    });

    it('shows alert when favoriting an unpublished book', () => {
        const { getByLabelText } = render(
            <ContextWrapper>
                <BookCardSearchList book={veryAnticipatedBook} onSeeDetails={jest.fn()} />
            </ContextWrapper>
        );

        fireEvent.press(getByLabelText('Add this book to your favorites'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Stay Updated!',
            expect.stringContaining(`The book "Very anticipated book!" is scheduled for release on ${formatDateStr(veryAnticipatedBook.releaseDateRaw, 'en')}`),
            expect.any(Array) // Ensures alert buttons are present
        );
    });

    it('schedules notification when clicking "Yes, notify me!"', async () => {
        const { getByLabelText } = render(
            <ContextWrapper>
                <BookCardSearchList book={veryAnticipatedBook} onSeeDetails={jest.fn()} />
            </ContextWrapper>
        );

        fireEvent.press(getByLabelText('Add this book to your favorites'));

        const alertButtons = Alert.alert.mock.calls[0][2];

        // Simulate clicking "Yes, notify me!"
        await waitFor(() => alertButtons[1].onPress());

        fireEvent.press(getByLabelText('Add this book to your favorites'));

        expect(scheduleBookReleaseNotification).toHaveBeenCalledTimes(1);
    });

    it('does not schedule notification when clicking "No, thanks"', () => {
        const { getByLabelText } = render(
            <ContextWrapper>
                <BookCardSearchList book={veryAnticipatedBook} onSeeDetails={jest.fn()} />
            </ContextWrapper>
        );

        fireEvent.press(getByLabelText('Add this book to your favorites'));

        const alertButtons = Alert.alert.mock.calls[0][2];

        // Simulate clicking "No, thanks"
        alertButtons[0].onPress();

        expect(scheduleBookReleaseNotification).not.toHaveBeenCalled();
    });

    it('matches the snapshot', () => {
        const tree = render(
            <ContextWrapper>
                <BookCardSearchList book={littleSecretsBook} onSeeDetails={jest.fn()} />
            </ContextWrapper>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
