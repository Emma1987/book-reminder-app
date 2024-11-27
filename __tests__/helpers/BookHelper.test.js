import { startOfDay } from 'date-fns';
import { BookType } from '@/components/types';
import { isPublished, sortFavorites } from '@/helpers/BookHelper';
import { today, thirtyDaysAgo, fifteenDaysAgo, yesterday, tomorrow, fifteenDaysFromNow } from '@/__tests__/__fixtures__/fixtures';

describe('BookHelper functions', () => {
    describe('test function isPublished', () => {
        it('should return true if release date is in the past', () => {
            const book: BookType = { title: 'Dracula', releaseDateRaw: yesterday };
            expect(isPublished(book)).toBe(true);
        });

        it('should return false if release date is today', () => {
            const book: BookType = { title: 'The Haunting of Hill House', releaseDateRaw: today };
            expect(isPublished(book)).toBe(false);
        });

        it('should return false if release date is in the future', () => {
            const book: BookType = { title: 'Frankenstein', releaseDateRaw: tomorrow };
            expect(isPublished(book)).toBe(false);
        });

        it('should return false if release date is null', () => {
            const book: BookType = { title: 'The Exorcist', releaseDateRaw: null };
            expect(isPublished(book)).toBe(false);
        });
    });

    describe('test function sortFavorites', () => {
        const books: BookType[] = [
            { title: 'Dracula', releaseDateRaw: yesterday },
            { title: 'The Haunting of Hill House', releaseDateRaw: tomorrow },
            { title: 'Frankenstein', releaseDateRaw: thirtyDaysAgo },
            { title: 'The Exorcist', releaseDateRaw: fifteenDaysAgo },
            { title: 'Interview with the Vampire', releaseDateRaw: fifteenDaysFromNow },
        ];

        it('should sort books into published and upcoming categories', () => {
            const { published, upcoming } = sortFavorites(books);

            expect(published).toEqual([
                { title: 'Dracula', releaseDateRaw: yesterday },
                { title: 'The Exorcist', releaseDateRaw: fifteenDaysAgo },
                { title: 'Frankenstein', releaseDateRaw: thirtyDaysAgo },
            ]);

            expect(upcoming).toEqual([
                { title: 'The Haunting of Hill House', releaseDateRaw: tomorrow },
                { title: 'Interview with the Vampire', releaseDateRaw: fifteenDaysFromNow },
            ]);
        });

        it('should return empty upcoming and published arrays if no books are provided', () => {
            const { published, upcoming } = sortFavorites([]);
            expect(published).toEqual([]);
            expect(upcoming).toEqual([]);
        });
    });
});
