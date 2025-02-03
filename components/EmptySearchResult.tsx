import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

export function EmptySearchResult() {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/no-result.png')}
                style={styles.image}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel="No books found"
            />
            <ThemedText type="default" textAlign="center">
                No results found
            </ThemedText>
            <ThemedText type="info" textAlign="center" style={styles.descriptionInfo}>
                Have you tried searching with the title of the book and the author?
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 50,
        alignItems: 'center',
    },
    image: {
        height: 200,
    },
    descriptionInfo: {
        width: '70%',
        fontStyle: 'italic',
    },
});
