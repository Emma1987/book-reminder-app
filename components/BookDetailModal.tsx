import React, { useMemo, useContext, useRef } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { Separator } from '@/components/Separator';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { formatDateStr } from '@/helpers/DateHelper';
import i18n from '@/i18n/translations';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';
import { SettingsContext } from '@/storage/SettingsContext';
import { BookType } from '@/types/types';

type BookDetailModalProps = {
    visible: boolean;
    onClose: () => void;
    book: BookType;
};

export function BookDetailModal({ visible, onClose, book }: BookDetailModalProps) {
    const { addFavorite, removeFavorite, isFavorite } = useContext(FavoriteBooksContext);
    const { applicationLanguage } = useContext(SettingsContext);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['50%', '90%'], []);

    const closeModal = () => {
        onClose();
        bottomSheetRef.current?.close();
    };

    const toggleFavorite = () => {
        if (isFavorite(book.id)) {
            removeFavorite(book.id);
        } else {
            addFavorite(book);
        }
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={visible ? 0 : -1}
            snapPoints={snapPoints}
            onClose={closeModal}
            enablePanDownToClose={true}
            enableDynamicSizing={false}
        >
            <BottomSheetScrollView style={styles.bottomSheetView}>
                {/* Book Cover */}
                {book.coverImage && (
                    <Image
                        source={{ uri: book.coverImage }}
                        style={styles.bookCover}
                        accessibilityRole="image"
                        accessibilityLabel={i18n.t('book_details.book_cover_label')}
                    />
                )}

                {/* Title, author and publication date */}
                <ThemedText type="subtitle" textAlign="center">
                    {book.title}
                </ThemedText>
                <ThemedText type="defaultSemiBold" textAlign="center" marginBottom="10">
                    {i18n.t('book_details.author', { authorName: book.authors?.join(', ') })}
                </ThemedText>
                <ThemedText type="info" textAlign="center" marginBottom="10">
                    {i18n.t('book_details.release_date', {
                        releaseDate: formatDateStr(book.releaseDateRaw, applicationLanguage),
                    })}
                </ThemedText>

                {/* Language */}
                {book.language && (
                    <ThemedText type="info" textAlign="center" marginBottom="10">
                        {i18n.t('book_details.language', { language: book.language.toUpperCase() })}
                    </ThemedText>
                )}

                {/* ISBN */}
                {book.isbn10 && (
                    <ThemedText type="info" textAlign="center">
                        {i18n.t('book_details.isbn10', { isbn: book.isbn10 })}
                    </ThemedText>
                )}
                {book.isbn13 && (
                    <ThemedText type="info" textAlign="center">
                        {i18n.t('book_details.isbn13', { isbn: book.isbn13 })}
                    </ThemedText>
                )}

                {/* Description */}
                {book.description && (
                    <View>
                        <Separator />
                        <Text style={styles.description}>{book.description}</Text>
                    </View>
                )}

                {/* Add to favs Button */}
                {isFavorite(book.id) && (
                    <TouchableOpacity style={[styles.button, styles.removeFavButton]} onPress={toggleFavorite}>
                        <Text style={styles.buttonText}>{i18n.t('remove_favorites.title')}</Text>
                    </TouchableOpacity>
                )}
                {!isFavorite(book.id) && (
                    <TouchableOpacity style={[styles.button, styles.addFavButton]} onPress={toggleFavorite}>
                        <Text style={styles.buttonText}>{i18n.t('book_details.add_favorites')}</Text>
                    </TouchableOpacity>
                )}
            </BottomSheetScrollView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    bottomSheetView: {
        padding: 20,
    },
    bookCover: {
        width: 100,
        height: 150,
        alignSelf: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 14,
        textAlign: 'justify',
        marginBottom: 50,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 50,
        borderRadius: 5,
        width: 200,
        alignSelf: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    addFavButton: {
        backgroundColor: Colors.red,
    },
    removeFavButton: {
        backgroundColor: Colors.gray,
    },
});
