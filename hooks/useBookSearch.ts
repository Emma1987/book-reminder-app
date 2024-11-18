import { useState, useEffect } from 'react';
import { getBooks } from '@/api/bookApi';
import debounce from 'lodash.debounce';

export const useBookSearch = (query) => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setBooks([]);
            return;
        }

        const fetchBooks = debounce(async () => {
            setIsLoading(true);
            try {
                const booksFromApi = await getBooks(query);

                const searchWords = query.toLowerCase().split(' ');
                const filteredBooks = booksFromApi.filter((book) => {
                    const title = book.title.toLowerCase();
                    const authors = book.authors?.map((author) => author.toLowerCase()).join(' ') || '';
                    return searchWords.every((word) => title.includes(word) || authors.includes(word));
                });

                setBooks(filteredBooks);
            } catch (error) {
                console.error("Error fetching books:", error);
                setBooks([]);
            } finally {
                setIsLoading(false);
            }
        }, 600);

        fetchBooks();
        return () => fetchBooks.cancel();
    }, [query]);

    return { books, isLoading };
};
