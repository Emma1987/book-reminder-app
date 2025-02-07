import React, { useContext } from 'react';
import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import i18n from '@/i18n/translations';
import { NotificationContext } from '@/storage/NotificationContext';
import { SettingsContext } from '@/storage/SettingsContext';

export default function TabLayout() {
    const { unreadNotifications } = useContext(NotificationContext);
    const { applicationLanguage } = useContext(SettingsContext);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primaryColor,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: i18n.t('tab_bar.index'),
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: i18n.t('tab_bar.add'),
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: i18n.t('tab_bar.notifications'),
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? 'notifications' : 'notifications-outline'}
                            color={color}
                            badgeCount={unreadNotifications}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: i18n.t('tab_bar.settings'),
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
