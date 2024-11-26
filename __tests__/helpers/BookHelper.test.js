import { startOfDay } from 'date-fns';
import { BookType } from '@/components/types';
import { isPublished, sortFavorites } from '@/helpers/BookHelper';
import { thirtyDaysAgo, fifteenDaysAgo, yesterday, today, tomorrow, fifteenDaysFromNow } from '@/__tests__/__fixtures__/fixtures';

describe('BookHelper functions', () => {
    describe('test function isPublished', () => {
        it('should return true if publicationDate is in the past', () => {
            expect(isPublished(yesterday)).toBe(true);
        });

        it('should return false if publicationDate is today', () => {
            expect(isPublished(today)).toBe(false);
        });

        it('should return false if publicationDate is in the future', () => {
            expect(isPublished(tomorrow)).toBe(false);
        });

        it('should return false if publicationDate is null', () => {
            expect(isPublished(null)).toBe(false);
        });
    });

    describe('test function sortFavorites', () => {
        const books: BookType[] = [
            { title: 'Dracula', publicationDate: yesterday },
            { title: 'The Haunting of Hill House', publicationDate: tomorrow },
            { title: 'Frankenstein', publicationDate: thirtyDaysAgo },
            { title: 'The Exorcist', publicationDate: fifteenDaysAgo },
            { title: 'Interview with the Vampire', publicationDate: fifteenDaysFromNow },
        ];

        it('should sort books into published and upcoming categories', () => {
            const { published, upcoming } = sortFavorites(books);

            expect(published).toEqual([
                { title: 'Dracula', publicationDate: yesterday },
                { title: 'The Exorcist', publicationDate: fifteenDaysAgo },
                { title: 'Frankenstein', publicationDate: thirtyDaysAgo },
            ]);

            expect(upcoming).toEqual([
                { title: 'The Haunting of Hill House', publicationDate: tomorrow },
                { title: 'Interview with the Vampire', publicationDate: fifteenDaysFromNow },
            ]);
        });

        it('should return empty upcoming and published arrays if no books are provided', () => {
            const { published, upcoming } = sortFavorites([]);
            expect(published).toEqual([]);
            expect(upcoming).toEqual([]);
        });
    });
});
