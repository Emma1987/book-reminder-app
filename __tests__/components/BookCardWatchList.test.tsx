import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { hiddenPicturesBook, veryAnticipatedBook, veryAnticipatedBookNotification } from '@/__tests__/__fixtures__/fixtures';
import { ContextWrapper } from '@/__tests__/__fixtures__/context';
import { BookCardWatchList } from '@/components/BookCardWatchList';

jest.mock('expo-localization');
jest.spyOn(Alert, 'alert');

describe('BookCardWatchList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders book information correctly', () => {
        const { getByText } = render(
            <ContextWrapper>
                <BookCardWatchList book={hiddenPicturesBook} />
            </ContextWrapper>
        );

        expect(getByText('Hidden Pictures')).toBeTruthy();
        expect(getByText('Jason Rekulak')).toBeTruthy();
        expect(getByText('Release date: Oct 17, 2024')).toBeTruthy();
    });

    it('renders only first author when several authors', () => {
        const mockBookWithSeveralAuthors = {
            ...hiddenPicturesBook,
            authors: ['Stephen King', 'Jason Rekulak'],
        };

        const { getByText } = render(
            <ContextWrapper>
                <BookCardWatchList book={mockBookWithSeveralAuthors} />
            </ContextWrapper>
        );

        expect(getByText('Hidden Pictures')).toBeTruthy();
        expect(getByText('Stephen King')).toBeTruthy();
        expect(getByText('Release date: Oct 17, 2024')).toBeTruthy();
    });

    it('renders placeholder image when coverImage is null', () => {
        const mockBookWithoutCover = {
            ...hiddenPicturesBook,
            coverImage: null,
        };

        const { getByLabelText } = render(
            <ContextWrapper>
                <BookCardWatchList book={mockBookWithoutCover} />
            </ContextWrapper>
        );

        const image = getByLabelText('Book cover');
        expect(image.props.source).toEqual(require('@/assets/images/book-cover-placeholder.jpg'));
    });

    it('renders book cover when coverImage is provided', () => {
        const { getByLabelText } = render(
            <ContextWrapper>
                <BookCardWatchList book={hiddenPicturesBook} />
            </ContextWrapper>
        );
    
        const image = getByLabelText('Book cover');
        expect(image.props.source).toEqual({ uri: 'https://book.com/hidden-pictures-cover.jpg' });
    });

    it('has correct accessibility labels for the button', () => {
        const { getByLabelText } = render(
            <ContextWrapper>
                <BookCardWatchList book={hiddenPicturesBook} />
            </ContextWrapper>
        );

        const deleteButton = getByLabelText('Remove this book from your favorites');
        expect(deleteButton).toBeTruthy();
    });

    it('shows a confirmation dialog when delete button is clicked', () => {
        const { getByLabelText } = render(
            <ContextWrapper>
                <BookCardWatchList book={hiddenPicturesBook} />
            </ContextWrapper>
        );

        const deleteButton = getByLabelText('Remove this book from your favorites');
        fireEvent.press(deleteButton);

        expect(Alert.alert).toHaveBeenCalledWith(
            'Remove from favorites',
            `Are you sure you want to remove "Hidden Pictures" from your favorites?`,
            expect.any(Array)
        );
    });

    it('calls removeFavorite when confirmation is accepted', () => {
        const mockRemoveFavorite = jest.fn();
        
        const { getByLabelText } = render(
            <ContextWrapper removeFavorite={mockRemoveFavorite}>
                <BookCardWatchList book={hiddenPicturesBook} />
            </ContextWrapper>
        );

        const deleteButton = getByLabelText('Remove this book from your favorites');
        fireEvent.press(deleteButton);

        const [, positiveButton] = Alert.alert.mock.calls[0][2];
        positiveButton.onPress();

        expect(mockRemoveFavorite).toHaveBeenCalledWith(hiddenPicturesBook.id);
    });

    it('does not call removeFavorite when cancellation is chosen', () => {
        const mockRemoveFavorite = jest.fn();

        const { getByLabelText } = render(
            <ContextWrapper removeFavorite={mockRemoveFavorite}>
                <BookCardWatchList book={hiddenPicturesBook} />
            </ContextWrapper>
        );

        const deleteButton = getByLabelText('Remove this book from your favorites');
        fireEvent.press(deleteButton);

        const [negativeButton] = Alert.alert.mock.calls[0][2];
        negativeButton.onPress();

        expect(mockRemoveFavorite).not.toHaveBeenCalled();
    });

    it('displays the correct notification icon if there is no notification', async () => {
        const { getByLabelText } = render(
            <ContextWrapper>
                <BookCardWatchList book={veryAnticipatedBook} />
            </ContextWrapper>
        );

        const notificationIcon = getByLabelText('Notify me when the book is released');
        const iconName = notificationIcon.props.children[0].props.name;
        expect(iconName).toBe('notifications-off');
    });

    it('displays the correct notification icon if there is a notification', async () => {
        const { getByLabelText } = render(
            <ContextWrapper getNotificationByBookId={() => veryAnticipatedBookNotification}>
                <BookCardWatchList book={veryAnticipatedBook} />
            </ContextWrapper>
        );

        const notificationIcon = getByLabelText('Notify me when the book is released');
        const iconName = notificationIcon.props.children[0].props.name;
        expect(iconName).toBe('notifications');
    });

    it('matches the snapshot', () => {
        const tree = render(
            <ContextWrapper>
                <BookCardWatchList book={hiddenPicturesBook} />
            </ContextWrapper>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
