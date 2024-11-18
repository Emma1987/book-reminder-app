import { apiClient } from '@/api/apiClient';
import BookType from '@/components/types';
import { formatDateStr, getDateObject } from '@/helpers/DateHelper';

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const getBookEntity = (book: any): BookType => {
    const { volumeInfo } = book;
    if (!volumeInfo) {
        return;
    }

    const {
        industryIdentifiers = [],
        imageLinks = {},
        publishedDate,
        language = '',
        title,
        authors,
        description,
    } = volumeInfo;

    const isbn10 = industryIdentifiers.find(item => item.type === 'ISBN_10')?.identifier ?? null;
    const isbn13 = industryIdentifiers.find(item => item.type === 'ISBN_13')?.identifier ?? null;
    const coverImage = imageLinks.thumbnail?.replace('http://', 'https://') ?? null;
    const publicationDate = publishedDate ? getDateObject(publishedDate) : null;
    const publicationDateStr = publishedDate ? formatDateStr(publishedDate) : null;

    return {
        id: book.id,
        title,
        authors: authors ?? [],
        description: description ?? '',
        publicationDate,
        publicationDateStr,
        isbn10,
        isbn13,
        coverImage,
        language,
    };
};

export const getBooks = async (search: string): Promise<BookType[]> => {
    try {
        const requestParams = new URLSearchParams({
            q: `"${search.replace(/ /g, '+')}"`,
            langRestrict: 'en',
            maxResults: '10',
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
