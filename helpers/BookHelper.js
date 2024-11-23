import { parse, isBefore, startOfDay } from 'date-fns';
import { BookType } from '@/components/types';

export const isPublished = (publicationDate: Date | null): boolean => {
    if (!publicationDate) {
        return false;
    }

    const currentDate = startOfDay(new Date());
    return isBefore(publicationDate, currentDate);
}

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

    const sortByDateAsc = (a: BookType, b: BookType) => new Date(a.publicationDate) - new Date(b.publicationDate);
    const sortByDateDesc = (a: BookType, b: BookType) => new Date(b.publicationDate) - new Date(a.publicationDate);

    return {
        published: published.sort(sortByDateDesc),
        upcoming: upcoming.sort(sortByDateAsc),
    };
}
