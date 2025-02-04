import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Colors';

export function Header() {
    return (
        <View style={styles.headerContainer}>
            <Image
                source={require('@/assets/images/readly.png')}
                style={styles.logo}
                accessibilityRole="image"
                accessibilityLabel="Readly Logo"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    logo: {
        height: 40,
        width: 90,
    },
    subtitle: {
        marginTop: -5,
        color: Colors.secondaryColor,
        fontStyle: 'italic',
    },
});
