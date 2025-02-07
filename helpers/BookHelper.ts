import { isBefore, startOfDay } from 'date-fns';
import { BookType } from '@/types/types';

export const isPublished = (book: BookType): boolean => {
    if (!book.releaseDateRaw) {
        return false;
    }

    const currentDate = startOfDay(new Date());
    const releaseDate = new Date(book.releaseDateRaw);
    return isBefore(releaseDate, currentDate);
};

const sortByDateAsc = (a: BookType, b: BookType): number => {
    const dateA = a.releaseDateRaw ? new Date(a.releaseDateRaw).getTime() : NaN;
    const dateB = b.releaseDateRaw ? new Date(b.releaseDateRaw).getTime() : NaN;

    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;

    return dateA - dateB;
};

const sortByDateDesc = (a: BookType, b: BookType): number => {
    const dateA = a.releaseDateRaw ? new Date(a.releaseDateRaw).getTime() : NaN;
    const dateB = b.releaseDateRaw ? new Date(b.releaseDateRaw).getTime() : NaN;

    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;

    return dateB - dateA;
};

export const sortFavorites = (favorites: BookType[]): { published: BookType[]; upcoming: BookType[] } => {
    const published: BookType[] = [];
    const upcoming: BookType[] = [];

    favorites.forEach((book) => {
        if (isPublished(book)) {
            published.push(book);
        } else {
            upcoming.push(book);
        }
    });

    return {
        published: published.sort(sortByDateDesc),
        upcoming: upcoming.sort(sortByDateAsc),
    };
};
