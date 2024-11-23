import React, { useContext, useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { BookCardWatchList } from '@/components/BookCardWatchList';
import { Collapsible } from '@/components/Collapsible';
import { EmptyState } from '@/components/EmptyState';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { sortFavorites } from '@/helpers/BookHelper.js';
import { FavoriteBooksContext } from '@/storage/FavoriteBooksContext';

export default function WatchlistScreen() {
    const { favorites, removeFavorite } = useContext(FavoriteBooksContext);

    const { published, upcoming } = useMemo(() => sortFavorites(favorites), [favorites]);

    const renderBookList = (books) => {
        return books.map((book) => (
            <BookCardWatchList key={book.id} book={book} onDelete={removeFavorite} />
        ));
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor='#FFDFF4'
            headerImage={
                <Image
                    source={require('@/assets/images/bookshelf.png')}
                    style={styles.headerImage}
                />
            }>
            <View>
                <ThemedText type="title">My Reading Watchlist</ThemedText>
            </View>
            <Text>Stay updated on the latest releases!</Text>

            {/* Coming soon list */}
            <Collapsible title={`Coming Soon (${upcoming.length})`} isCollapsibleOpen>
                {(upcoming.length === 0) ? (
                    <EmptyState
                        title="No upcoming books here!"
                        description="Add some books to your watchlist to see their release dates here."
                        imageSource={require('@/assets/images/empty.png')}
                        buttonText="Browse Books"
                        onButtonPress={() => {
                            router.replace('/add');
                        }}
                    />
                ) : (
                    renderBookList(upcoming)
                )}
            </Collapsible>

            {/* Available now list */}
            <Collapsible title={`Available Now (${published.length})`} isCollapsibleOpen={false}>
                {(published.length === 0) ? (
                    <EmptyState
                        title="No books already published!"
                        description="None of the books in your watchlist are already published."
                        imageSource={require('@/assets/images/empty.png')}
                    />
                ) : (
                    renderBookList(published)
                )}
            </Collapsible>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({});
