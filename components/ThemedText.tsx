import { Text, type TextProps, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'info';
    textAlign?: 'default' | 'center';
    marginBottom?: '0' | '10' | '20';
};

export function ThemedText({
    style,
    type = 'default',
    textAlign = 'default',
    marginBottom = '0',
    ...rest
}: ThemedTextProps) {
    return (
        <Text
            style={[
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                type === 'info' ? styles.info : undefined,

                textAlign === 'center' ? [styles.center] : undefined,

                marginBottom === '10' ? [styles.marginBottom10] : undefined,
                marginBottom === '20' ? [styles.marginBottom20] : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: Colors.tint,
    },
    info: {
        fontSize: 14,
        color: Colors.gray,
    },
    center: {
        textAlign: 'center',
    },
    marginBottom10: {
        marginBottom: 10,
    },
    marginBottom20: {
        marginBottom: 20,
    },
});
