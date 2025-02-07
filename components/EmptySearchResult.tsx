import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import i18n from '@/i18n/translations';

export function EmptySearchResult() {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/no-result.png')}
                style={styles.image}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel={i18n.t('empty_search_result.no_result_icon')}
            />
            <ThemedText type="default" textAlign="center">
                {i18n.t('empty_search_result.title')}
            </ThemedText>
            <ThemedText type="info" textAlign="center" style={styles.descriptionInfo}>
                {i18n.t('empty_search_result.help')}
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
