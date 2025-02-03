import { apiClient } from '@/api/apiClient';
import { BookType } from '@/components/types';

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const getBookEntity = (book: any): BookType | undefined => {
    const { volumeInfo } = book;
    if (!volumeInfo) {
        return;
    }

    const {
        industryIdentifiers = [],
        imageLinks = {},
        publishedDate = null,
        language = '',
        title = '',
        authors = [],
        description = '',
    } = volumeInfo;

    const isbn10 = industryIdentifiers.find((item: any) => item.type === 'ISBN_10')?.identifier ?? null;
    const isbn13 = industryIdentifiers.find((item: any) => item.type === 'ISBN_13')?.identifier ?? null;
    const coverImage = imageLinks.thumbnail?.replace('http://', 'https://') ?? null;

    return {
        id: book.id,
        title,
        authors,
        description,
        releaseDateRaw: publishedDate,
        isbn10,
        isbn13,
        coverImage,
        language,
    };
};

export const getBooks = async (search: string): Promise<BookType[]> => {
    try {
        if (!apiKey) {
            throw new Error('API key is missing');
        }

        const requestParams = new URLSearchParams({
            q: `"${search.replace(/ /g, '+')}"`,
            langRestrict: 'en',
            maxResults: '40',
            key: apiKey,
            printType: 'books',
            orderBy: 'relevance',
        });

        const response = await apiClient.get(`/volumes`, { params: requestParams });
        const apiResponse = response.data.items ?? [];

        return apiResponse.map(getBookEntity);
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
