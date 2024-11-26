import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';

export function Separator() {
    return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.lightGray,
        marginVertical: 20,
    },
});
