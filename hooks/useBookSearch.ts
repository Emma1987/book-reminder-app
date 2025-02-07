import { useState, useEffect } from 'react';
import { getBooks } from '@/api/bookApi';
import { BookType } from '@/types/types';
import debounce from 'lodash.debounce';

export const useBookSearch = (query: string, langRestrict: string = '') => {
    const [books, setBooks] = useState<BookType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!query) {
            setBooks([]);
            return;
        }

        const fetchBooks = debounce(async () => {
            setIsLoading(true);
            try {
                const booksFromApi = await getBooks(query, langRestrict);

                const fullDatePattern = /^\d{4}-\d{2}-\d{2}$/;
                const searchWords = query.toLowerCase().split(' ');
                const filteredBooks = booksFromApi.filter((book) => {
                    const title = book.title.toLowerCase();
                    const authors = book.authors?.map((author) => author.toLowerCase()).join(' ') || '';
                    return (
                        searchWords.every((word) => title.includes(word) || authors.includes(word)) &&
                        book.releaseDateRaw !== null &&
                        fullDatePattern.test(book.releaseDateRaw)
                    );
                });

                setBooks(filteredBooks);
            } catch (error) {
                console.error('Error fetching books:', error);
                setBooks([]);
            } finally {
                setIsLoading(false);
            }
        }, 600);

        fetchBooks();
        return () => fetchBooks.cancel();
    }, [langRestrict, query]);

    return { books, isLoading };
};
