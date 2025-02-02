import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { setStatusBarStyle } from 'expo-status-bar';
import ErrorBoundary from 'react-native-error-boundary';
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';

import { NotificationProvider } from '@/storage/NotificationContext';
import { FavoriteBooksProvider } from '@/storage/FavoriteBooksContext';
import { requestNotificationPermission } from '@/helpers/NotificationHelper';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Configure how notifications are displayed when the app is in the foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            setTimeout(SplashScreen.hideAsync, 0);
            setStatusBarStyle('dark');
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    requestNotificationPermission();

    return (
        <ErrorBoundary>
            <FavoriteBooksProvider>
                <NotificationProvider>
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                </NotificationProvider>
            </FavoriteBooksProvider>
        </ErrorBoundary>
    );
}
