import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

type HeaderProps = {
    subHeaderText?: string | null;
    subHeaderIcon?: keyof typeof Ionicons.glyphMap | null;
};

export function Header({ subHeaderText = null, subHeaderIcon = null }: HeaderProps) {
    return (
        <>
            <View style={styles.headerContainer}>
                <Image
                    source={require('@/assets/images/readly.png')}
                    style={styles.logo}
                    accessibilityRole="image"
                    accessibilityLabel="Readly Logo"
                />
            </View>

            {subHeaderText && (
                <View style={styles.subHeaderContainer} testID="subheader-container">
                    <ThemedText type="defaultSemiBold" style={styles.subHeaderContainerText}>
                        {subHeaderIcon && <Ionicons name={subHeaderIcon} size={15} color={Colors.whitesmoke} />}
                        <Text>&nbsp;{subHeaderText}</Text>
                    </ThemedText>
                </View>
            )}
        </>
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
    subHeaderContainer: {
        width: '100%',
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        padding: 20,
    },
    subHeaderContainerText: {
        color: Colors.whitesmoke,
    },
});
