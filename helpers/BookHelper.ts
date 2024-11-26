import { isBefore, startOfDay } from 'date-fns';
import { BookType } from '@/components/types';

export const isPublished = (publicationDate: Date | null): boolean => {
    if (!publicationDate) {
        return false;
    }

    const currentDate = startOfDay(new Date());
    return isBefore(publicationDate, currentDate);
};

const sortByDateAsc = (a: BookType, b: BookType): number => {
    const dateA = a.publicationDate ? new Date(a.publicationDate).getTime() : NaN;
    const dateB = b.publicationDate ? new Date(b.publicationDate).getTime() : NaN;

    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;

    return dateA - dateB;
};

const sortByDateDesc = (a: BookType, b: BookType): number => {
    const dateA = a.publicationDate ? new Date(a.publicationDate).getTime() : NaN;
    const dateB = b.publicationDate ? new Date(b.publicationDate).getTime() : NaN;

    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;

    return dateB - dateA;
};

export const sortFavorites = (favorites: BookType[]): { published: BookType[]; upcoming: BookType[] } => {
    const published: BookType[] = [];
    const upcoming: BookType[] = [];

    favorites.forEach((book) => {
        if (isPublished(book.publicationDate)) {
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
