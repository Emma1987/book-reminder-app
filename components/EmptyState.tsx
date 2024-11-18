import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

type EmptyStateProps = {
    title: string;
    description: string;
    imageSource: any; // Path to an image or illustration
    buttonText?: string;
    onButtonPress?: () => void;
};

export function EmptyState({title, description, imageSource, buttonText, onButtonPress}: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <Image source={imageSource} style={styles.image} resizeMode="contain" />
            <View style={styles.description}>
                <ThemedText type="defaultSemiBold-center">{title}</ThemedText>
                <ThemedText type="info-center">{description}</ThemedText>
                {buttonText && onButtonPress && (
                    <TouchableOpacity style={styles.button} onPress={onButtonPress}>
                        <ThemedText type="buttonText">{buttonText}</ThemedText>
                    </TouchableOpacity>
                )}
            </View>
            
        </View>
    );
};

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
        width: '70%'
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
