import { veryAnticipatedBook } from '@/__tests__/__fixtures__/fixtures';
import { scheduleBookReleaseNotification } from '@/helpers/BookNotificationHelper';
import { scheduleNotification } from '@/helpers/NotificationHelper';

// Mock scheduleNotification to return a fake identifier
jest.mock('@/helpers/NotificationHelper', () => ({
    scheduleNotification: jest.fn(() => Promise.resolve('mock-notification-id')),
}));

describe('BookNotificationHelper', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('schedules a notification correctly', async () => {
        const mockAddNotification = jest.fn();

        await scheduleBookReleaseNotification(veryAnticipatedBook, mockAddNotification);

        expect(scheduleNotification).toHaveBeenCalledWith(
            'Book Release Alert 🚨',
            'The book Very anticipated book! is released today!',
            expect.any(Date),
        );

        expect(mockAddNotification).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'alert-book-4',
                bookId: '4',
                notificationIdentifier: 'mock-notification-id',
                title: 'Book Release Alert 🚨',
                content: 'The book Very anticipated book! is released today!',
                readAt: null,
            }),
        );
    });

    it('does not schedule a notification if book.releaseDateRaw is missing', async () => {
        const mockAddNotification = jest.fn();
        const bookWithoutReleaseDate = { ...veryAnticipatedBook, releaseDateRaw: undefined };

        await scheduleBookReleaseNotification(bookWithoutReleaseDate, mockAddNotification);

        expect(scheduleNotification).not.toHaveBeenCalled();
        expect(mockAddNotification).not.toHaveBeenCalled();
    });

    it('logs an error if scheduling fails', async () => {
        console.error = jest.fn(); // Mock console.error

        (scheduleNotification as jest.Mock).mockRejectedValue(new Error('Failed to schedule notification'));

        const mockAddNotification = jest.fn();

        await scheduleBookReleaseNotification(veryAnticipatedBook, mockAddNotification);

        expect(console.error).toHaveBeenCalledWith(
            'Error scheduling notification:',
            expect.any(Error),
        );
    });
});
