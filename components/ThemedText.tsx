import { Text, type TextProps, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';

export type ThemedTextProps = TextProps & {
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'info' | 'default-center' | 'title-center' | 'defaultSemiBold-center' | 'subtitle-center' | 'link-center' | 'info-center';
};

export function ThemedText({style, type = 'default', ...rest}: ThemedTextProps) {
    return (
        <Text
            style={[
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                type === 'info' ? styles.info : undefined,

                type === 'default-center' ? [styles.center, styles.default] : undefined,
                type === 'title-center' ? [styles.center, styles.title] : undefined,
                type === 'defaultSemiBold-center' ? [styles.center, styles.defaultSemiBold] : undefined,
                type === 'subtitle-center' ? [styles.center, styles.subtitle] : undefined,
                type === 'link-center' ? [styles.center, styles.link] : undefined,
                type === 'info-center' ? [styles.center, styles.info] : undefined,
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
    }
});
