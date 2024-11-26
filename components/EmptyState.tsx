import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

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
                accessibilityLabel="Empty state image"
            />
            <View style={styles.description}>
                <ThemedText type="defaultSemiBold" textAlign="center">
                    {title}
                </ThemedText>
                <ThemedText type="info" textAlign="center">
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
        minHeight: 1,
        flexDirection: 'row',
        marginVertical: 20,
    },
    image: {
        width: '30%',
        height: 100,
    },
    description: {
        width: '70%',
        alignSelf: 'center',
    },
    button: {
        alignSelf: 'center',
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.pink,
        borderRadius: 5,
    },
});
