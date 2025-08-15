import { TabBarIconProps } from "@/types";
import { Feather } from "@expo/vector-icons";
import cn from "clsx";
import { Redirect, Tabs } from 'expo-router';
import { Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
    <View className="tab-icon">
        <Feather
            name={icon}
            size={24}
            color={focused ? '#016FAE' : '#5D5F6D'}
        />
        <Text className={cn('text-sm font-quicksand-bold', focused ? 'text-blue-100' : 'text-gray-500')}>
            {title}
        </Text>
    </View>
)

export default function TabsLayout() {
    const { token } = useAuth();

    if (!token) {
        return (
            <View>
                <Redirect href="/(auth)/sign-in" />
            </View>
        );
    }

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
                    marginHorizontal: 10,
                    height: 80,
                    position: 'absolute',
                    bottom: 25,
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
                        <TabBarIcon title="Businesses" icon="briefcase" focused={focused} />
                }}
            />
            <Tabs.Screen
                name='categories'
                options={{
                    title: 'Categories',
                    tabBarIcon: ({ focused }) =>
                        <TabBarIcon title="Categories" icon="grid" focused={focused} />
                }}
            />
            <Tabs.Screen
                name='coupons'
                options={{
                    title: 'Coupons',
                    tabBarIcon: ({ focused }) =>
                        <TabBarIcon title="Coupons" icon="tag" focused={focused} />
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
