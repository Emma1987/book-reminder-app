import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import i18n from '@/i18n/translations';

export function EmptyNotification() {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/no-notification.png')}
                style={styles.image}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel={i18n.t('notifications_screen.empty_notifications')}
            />
            <ThemedText type="default" textAlign="center">
                {i18n.t('notifications_screen.empty_notifications')}
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
