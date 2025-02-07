import { scheduleNotification } from '@/helpers/NotificationHelper';
import { NotificationType, BookType } from '@/types/types';

const createNotification = (book: BookType, trigger: Date): NotificationType => {
    return {
        id: `alert-book-${book.id}`,
        bookId: book.id,
        notificationIdentifier: null,
        scheduledTime: trigger,
        title: 'Book Release Alert 🚨',
        content: `The book ${book.title} is released today!`,
        readAt: null,
    };
};

export const scheduleBookReleaseNotification = async (
    book: BookType,
    addNotification: (notification: NotificationType) => void,
): Promise<void> => {
    if (!book.releaseDateRaw) return;

    try {
        const releaseDate = new Date(book.releaseDateRaw);
        releaseDate.setHours(10, 30, 0);

        const notification = createNotification(book, releaseDate);
        const identifier = await scheduleNotification(
            notification.title,
            notification.content,
            notification.scheduledTime,
        );
        notification.notificationIdentifier = identifier;

        addNotification(notification);
    } catch (error) {
        console.error('Error scheduling notification:', error);
    }
};
