import React, { useContext } from 'react';
import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { NotificationContext } from '@/storage/NotificationContext';

export default function TabLayout() {
    const { unreadNotifications } = useContext(NotificationContext);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.tint,
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'My List',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: 'Add Book',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? 'notifications' : 'notifications-outline'}
                            color={color}
                            badgeCount={unreadNotifications}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
