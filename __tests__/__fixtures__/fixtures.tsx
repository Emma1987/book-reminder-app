import { addDays, subDays, format } from 'date-fns';

// Dates
export const today = format(new Date(), 'yyyy-MM-dd');
export const thirtyDaysAgo = format(subDays(today, 30), 'yyyy-MM-dd');
export const fifteenDaysAgo = format(subDays(today, 15), 'yyyy-MM-dd');
export const yesterday = format(subDays(today, 1), 'yyyy-MM-dd');
export const tomorrow = format(addDays(today, 1), 'yyyy-MM-dd');
export const fifteenDaysFromNow = format(addDays(today, 15), 'yyyy-MM-dd');

// Books
export const littleSecretsBook = {
    id: '1',
    title: 'Little Secrets',
    authors: ['Jennifer Hillier'],
    releaseDateRaw: '2020-05-07',
    coverImage: 'https://book.com/little-secrets-cover.jpg',
    description: 'Marin had the perfect life...',
};

export const hiddenPicturesBook = {
    id: '2',
    title: 'Hidden Pictures',
    authors: ['Jason Rekulak'],
    releaseDateRaw: '2024-10-17',
    coverImage: 'https://book.com/hidden-pictures-cover.jpg',
};

export const itBook = {
    id: '3',
    title: 'It',
    authors: ['Stephen King'],
    releaseDateRaw: '1987-10-01',
    coverImage: null,
    description: 'Welcome to Derry, Maine...',
    language: 'en',
    isbn10: '0450411435',
    isbn13: '9780450411434',
};

export const veryAnticipatedBook = {
    id: '4',
    title: 'Very anticipated book!',
    authors: ['Famous Author'],
    releaseDateRaw: format(fifteenDaysFromNow, 'yyyy-MM-dd'),
    coverImage: null,
};

// Notifications
export const littleSecretsBookNotification = {
    id: '1',
    bookId: '1',
    notificationIdentifier: 'abcdef1',
    scheduledTime: new Date('2020-05-07'),
    title: 'New book release!',
    content: 'Little Secrets is released today!'
};

export const hiddenPicturesBookNotification = {
    id: '2',
    bookId: '2',
    notificationIdentifier: 'abcdef2',
    scheduledTime: new Date('2024-10-17'),
    title: 'New book release!',
    content: 'Hidden Pictures is released today!'
};

export const veryAnticipatedBookNotification = {
    id: '2',
    bookId: '4',
    notificationIdentifier: 'abcdef4',
    scheduledTime: fifteenDaysFromNow,
    title: 'New book release!',
    content: 'Very anticipated book! is released today!'
};
