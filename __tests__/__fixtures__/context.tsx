import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';
import { NotificationContext } from '@/storage/NotificationContext';
import { SettingsContext } from '@/storage/SettingsContext';

export const ContextWrapper = ({
    children,
    favorites = [],
    addFavorite = jest.fn(),
    removeFavorite = jest.fn(),
    isFavorite = jest.fn(),
    getFavoriteById = jest.fn(),
    notifications = [],
    unreadNotifications = 0,
    loadNotifications = jest.fn(),
    addNotification = jest.fn(),
    updateNotification = jest.fn(),
    removeNotification = jest.fn(),
    getNotificationByBookId = jest.fn(),
    applicationLanguage = 'en',
    bookApiLanguage = 'en',
    updateApplicationLanguage = jest.fn(),
    updateBookApiLanguage = jest.fn(),
}) => {
    return (
        <FavoriteBooksContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, getFavoriteById }}>
            <NotificationContext.Provider value={{ notifications, unreadNotifications, loadNotifications, addNotification, updateNotification, removeNotification, getNotificationByBookId }}>
                <SettingsContext.Provider value={{ applicationLanguage, bookApiLanguage, updateApplicationLanguage, updateBookApiLanguage }}>
                    {children}
                </SettingsContext.Provider>
            </NotificationContext.Provider>
        </FavoriteBooksContext.Provider>
    );
};

