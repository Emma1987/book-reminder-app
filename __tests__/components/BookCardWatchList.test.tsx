import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { hiddenPicturesBook, veryAnticipatedBook, veryAnticipatedBookNotification } from '@/__tests__/__fixtures__/fixtures';
import { BookCardWatchList } from '@/components/BookCardWatchList';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';
import { NotificationContext } from '@/storage/NotificationContext';

jest.spyOn(Alert, 'alert');

describe('BookCardWatchList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders book information correctly', () => {
        const { getByText } = render(
            <FavoriteBooksContext.Provider value={{removeFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <BookCardWatchList book={hiddenPicturesBook} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        expect(getByText('Hidden Pictures')).toBeTruthy();
        expect(getByText('Jason Rekulak')).toBeTruthy();
        expect(getByText('Release date: 17 Oct 2024')).toBeTruthy();
    });

    it('renders only first author when several authors', () => {
        const mockBookWithSeveralAuthors = {
            ...hiddenPicturesBook,
            authors: ['Stephen King', 'Jason Rekulak'],
        };

        const { getByText } = render(
            <FavoriteBooksContext.Provider value={{removeFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <BookCardWatchList book={mockBookWithSeveralAuthors} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        expect(getByText('Hidden Pictures')).toBeTruthy();
        expect(getByText('Stephen King')).toBeTruthy();
        expect(getByText('Release date: 17 Oct 2024')).toBeTruthy();
    });

    it('renders placeholder image when coverImage is null', () => {
        const mockBookWithoutCover = {
            ...hiddenPicturesBook,
            coverImage: null,
        };

        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{removeFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <BookCardWatchList book={mockBookWithoutCover} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        const image = getByLabelText('Book cover');
        expect(image.props.source).toEqual(require('@/assets/images/book-cover-placeholder.jpg'));
    });

    it('renders book cover when coverImage is provided', () => {
        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{removeFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <BookCardWatchList book={hiddenPicturesBook} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );
    
        const image = getByLabelText('Book cover');
        expect(image.props.source).toEqual({ uri: 'https://book.com/hidden-pictures-cover.jpg' });
    });

    it('shows a confirmation dialog when delete button is clicked', () => {
        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{removeFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <BookCardWatchList book={hiddenPicturesBook} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        const deleteButton = getByLabelText('Remove this book from your favorite list');
        fireEvent.press(deleteButton);

        expect(Alert.alert).toHaveBeenCalledWith(
            'Remove Favorite',
            `Are you sure you want to remove "Hidden Pictures" from your favorites?`,
            expect.any(Array)
        );
    });

    it('calls removeFavorite when confirmation is accepted', () => {
        const mockRemoveFavorite = jest.fn();
        
        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{removeFavorite: mockRemoveFavorite}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <BookCardWatchList book={hiddenPicturesBook} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        const deleteButton = getByLabelText('Remove this book from your favorite list');
        fireEvent.press(deleteButton);

        const [, positiveButton] = Alert.alert.mock.calls[0][2];
        positiveButton.onPress();

        expect(mockRemoveFavorite).toHaveBeenCalledWith(hiddenPicturesBook.id);
    });

    it('does not call removeFavorite when cancellation is chosen', () => {
        const mockRemoveFavorite = jest.fn();

        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{removeFavorite: mockRemoveFavorite}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <BookCardWatchList book={hiddenPicturesBook} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        const deleteButton = getByLabelText('Remove this book from your favorite list');
        fireEvent.press(deleteButton);

        const [negativeButton] = Alert.alert.mock.calls[0][2];
        negativeButton.onPress();

        expect(mockRemoveFavorite).not.toHaveBeenCalled();
    });

    it('has correct accessibility labels for the button', () => {
        const { getByLabelText } = render(
            <FavoriteBooksContext.Provider value={{removeFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <BookCardWatchList book={hiddenPicturesBook} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        const deleteButton = getByLabelText('Remove this book from your favorite list');
        expect(deleteButton).toBeTruthy();
    });

    it('displays the correct notification icon if there is no notification', async () => {
        const { getByLabelText, getByTestId } = render(
            <FavoriteBooksContext.Provider value={{ removeFavorite: jest.fn() }}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: () => undefined}}>
                    <BookCardWatchList book={veryAnticipatedBook} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        const notificationIcon = getByLabelText('Notify me when the book is released');
        const iconName = notificationIcon.props.children[0].props.name;
        expect(iconName).toBe('notifications-off');
    });

    it('displays the correct notification icon if there is a notification', async () => {
        const { getByLabelText, getByTestId } = render(
            <FavoriteBooksContext.Provider value={{ removeFavorite: jest.fn() }}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: () => veryAnticipatedBookNotification}}>
                    <BookCardWatchList book={veryAnticipatedBook} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        );

        const notificationIcon = getByLabelText('Notify me when the book is released');
        const iconName = notificationIcon.props.children[0].props.name;
        expect(iconName).toBe('notifications');
    });

    it('matches the snapshot', () => {
        const tree = render(
            <FavoriteBooksContext.Provider value={{removeFavorite: jest.fn()}}>
                <NotificationContext.Provider value={{addNotification: jest.fn(), removeNotification: jest.fn(), getNotificationByBookId: jest.fn()}}>
                    <BookCardWatchList book={hiddenPicturesBook} />
                </NotificationContext.Provider>
            </FavoriteBooksContext.Provider>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});
