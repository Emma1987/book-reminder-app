import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import i18n from '@/i18n/translations';

type EmptyStateProps = {
    title: string;
    description: string;
    imageSource: any;
    buttonText?: string;
    onButtonPress?: () => void;
};

export function EmptyState({ title, description, imageSource, buttonText, onButtonPress }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <Image
                source={imageSource}
                style={styles.image}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel={i18n.t('empty_state.illustration_label')}
            />
            <View style={styles.description}>
                <ThemedText type="defaultSemiBold" textAlign="center">
                    {title}
                </ThemedText>
                <ThemedText type="info" textAlign="center" style={styles.descriptionInfo}>
                    {description}
                </ThemedText>
                {buttonText && onButtonPress && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onButtonPress}
                        accessibilityRole="button"
                        accessibilityLabel={buttonText}
                    >
                        <Text>{buttonText}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        alignItems: 'center',
    },
    image: {
        height: 200,
    },
    description: {
        width: '70%',
    },
    descriptionInfo: {
        fontStyle: 'italic',
    },
    button: {
        alignSelf: 'center',
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.secondaryColor,
        borderRadius: 5,
    },
});
