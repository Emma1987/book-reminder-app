import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

export function EmptyNotification() {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/no-notification.png')}
                style={styles.image}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel="No notification"
            />
            <ThemedText type="default" textAlign="center">
                No notification yet!
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
});
