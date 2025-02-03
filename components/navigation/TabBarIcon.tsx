import { type ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';

interface TabBarIconProps extends ComponentProps<typeof Ionicons> {
    badgeCount?: number;
    style?: object;
}

export function TabBarIcon({ badgeCount = 0, style, ...rest }: TabBarIconProps) {
    return (
        <View>
            <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />
            {badgeCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badgeCount}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: Colors.red,
        borderRadius: 10,
        height: 20,
        minWidth: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
