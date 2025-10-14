import { Feather } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

const BusinessProfile = ({ user, logout }: { user: any, logout: () => void }) => {
    const menu = [
        { icon: "clipboard", label: "Order History", onPress: () => { } },
        { icon: "credit-card", label: "Coupons", onPress: () => { } },
    ];
    return (
        <>
            <View className="px-4 pb-4">
                <Text className="text-gray-600">📱 {user?.phone ?? "-"}</Text>
                <Text className="text-gray-600">📧 {user?.email ?? "No email"}</Text>
            </View>

            <FlatList
                data={menu}
                scrollEnabled={false}
                keyExtractor={(_, i) => `menu-item-${i}`}
                renderItem={({ item }) => (
                    <Pressable
                        className="flex-row items-center py-4 px-2 bg-white border-b border-gray-200"
                        onPress={item.onPress}
                    >
                        <Feather name={item.icon as any} size={22} color="#25A4C3" />
                        <Text className="flex-1 text-base text-gray-800 ml-3">{item.label}</Text>
                        <Feather name="chevron-right" size={20} color="#999" />
                    </Pressable>
                )}
                ListFooterComponent={() => (
                    <Pressable
                        onPress={logout}
                        className="mt-6 bg-red-500 py-3 px-4 rounded-2xl items-center mx-2 mb-8"
                    >
                        <Text className="text-white font-quicksand-bold text-base">Logout</Text>
                    </Pressable>
                )}
            />
        </>
    )
}

export default BusinessProfile
