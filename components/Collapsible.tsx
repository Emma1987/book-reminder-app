import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View, useAnimatedValue } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

type CollapsibleProps = PropsWithChildren<{
    title: string;
    isCollapsibleOpen: boolean;
}>;

export function Collapsible({ children, title, isCollapsibleOpen = false }: CollapsibleProps) {
    const [isOpen, setIsOpen] = useState(isCollapsibleOpen);
    const animatedHeight = useAnimatedValue(isCollapsibleOpen ? 1 : 0);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        Animated.timing(animatedHeight, {
            toValue: isOpen ? 1 : 0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    }, [isOpen, contentHeight]);

    useEffect(() => {
        setIsOpen(isCollapsibleOpen);
    }, [isCollapsibleOpen]);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <View>
            <TouchableOpacity
                style={styles.heading}
                onPress={toggle}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                accessibilityLabel={`${title} section`}
            >
                <Ionicons
                    name={isOpen ? 'chevron-down' : 'chevron-forward-outline'}
                    size={18}
                    color={Colors.icon}
                />
                <ThemedText type="defaultSemiBold">{title}</ThemedText>
            </TouchableOpacity>
            <Animated.View
                style={[
                    styles.content,
                    {
                        height: animatedHeight.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, contentHeight || 0],
                        }),
                    },
                ]}
            >
                <View
                    style={styles.animatedView}
                    onLayout={(event) => {
                        const measuredHeight = event.nativeEvent.layout.height;
                        setContentHeight(measuredHeight);
                    }}
                >
                    {children}
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    content: {
        marginTop: 6,
        overflow: 'hidden',
    },
    animatedView: {
        minHeight: 1
    },
});
