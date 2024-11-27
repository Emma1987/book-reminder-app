export type BookType = {
    id: string;
    title: string;
    authors: string[];
    description: string;
    releaseDateRaw: string | null;
    isbn10: string | null;
    isbn13: string | null;
    coverImage: string | null;
    language: string | null;
};
