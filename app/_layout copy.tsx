import { useAuthStore } from "@/stores/auth-store";
import { TabBarIconProps } from "@/types";
import { Feather } from "@expo/vector-icons";
import cn from "clsx";
import { Tabs } from 'expo-router';
import { useEffect } from "react";
import { Text, View } from "react-native";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
    <View className="tab-icon">
        <Feather
            name={icon}
            size={22}
            color={focused ? '#016FAE' : '#5D5F6D'}
        />
        <Text className={cn('text-xs font-quicksand-bold', focused ? 'text-blue-100' : 'text-gray-500')}>
            {title}
        </Text>
    </View>
)

export default function TabsLayout() {
    const { userType, setUserType } = useAuthStore();

    // Set default to guest ONCE if no userType
    useEffect(() => {
        if (!userType) {
            setUserType("guest");
            console.log("[TabsLayout] No userType found, setting to ", userType);
        }
    }, []);

    // if (!token && userType !== 'guest') {
    //     return (
    //         <View>
    //             <Redirect href="/(auth)/sign-in" />
    //         </View>
    //     );
    // }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    marginHorizontal: 5,
                    height: 70,
                    position: 'absolute',
                    bottom: 20,
                    backgroundColor: 'white',
                    shadowColor: '#1a1a1a',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5
                }
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Home" icon="home" focused={focused} />
                }}
            />
            <Tabs.Screen
                name='businesses'
                options={{
                    title: 'Businesses',
                    tabBarIcon: ({ focused }) =>
                        <TabBarIcon title="Business" icon="briefcase" focused={focused} />
                }}
            />
            <Tabs.Screen
                name='categories'
                options={{
                    title: 'Categories',
                    tabBarIcon: ({ focused }) =>
                        <TabBarIcon title="Category" icon="grid" focused={focused} />
                }}
            />
            <Tabs.Screen
                name='coupons'
                options={{
                    title: 'Coupons',
                    tabBarIcon: ({ focused }) =>
                        <TabBarIcon title="Coupon" icon="tag" focused={focused} />
                }}
            />
            <Tabs.Screen
                name='events'
                options={{
                    title: 'Events',
                    tabBarIcon: ({ focused }) =>
                        <TabBarIcon title="Event" icon="calendar" focused={focused} />
                }}
            />
            <Tabs.Screen
                name='promotions'
                options={{
                    title: 'Promotions',
                    tabBarIcon: ({ focused }) =>
                        <TabBarIcon title="Promotion" icon="percent" focused={focused} />
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) =>
                        <TabBarIcon title="Profile" icon="user" focused={focused} />
                }}
            />
        </Tabs>
    )
}
