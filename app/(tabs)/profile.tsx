import GlobalStyles from "@/components/GlobalStyles";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

const menu = [
    { icon: "clipboard", label: "Order History", onPress: () => { } },
    { icon: "credit-card", label: "My Coupons", onPress: () => { } },
    { icon: "gift", label: "Points", onPress: () => { } },
    { icon: "users", label: "Invite Friends", onPress: () => { } },
    { icon: "star", label: "Claim Points", onPress: () => { } },
];

export default function Profile() {
    const { user, userType, logout } = useAuth();

    const roleLabel = userType === "admin" ? "Business Admin" : "User";

    return (
        <SafeAreaView className="flex-1 bg-blue-100" style={GlobalStyles.droidSafeArea}>
            <View className="flex-1 bg-white px-2 h-full absolute bottom-0 left-0 right-0 rounded-t-[40px]">
                {/* Header */}
                <View className="flex-row items-center justify-between my-5">
                    <View className="w-9" />
                    <Text className="text-2xl font-bold text-blue-100">Account</Text>
                    <View className="w-9" />
                </View>

                {/* Profile Info */}
                <View className="bg-white flex-row items-center px-4 py-3 rounded-2xl shadow-sm mb-4">
                    <View className="bg-blue-100 rounded-full size-12 justify-center items-center mr-3">
                        <Feather name="user" size={30} color="#fff" />
                    </View>

                    <View className="flex-1">
                        <Text className="text-lg font-quicksand-semibold">
                            {user?.name ?? "Unknown"}
                        </Text>
                        <View className="mt-1 self-start px-2 py-[2px] rounded-md bg-gray-100">
                            <Text className="text-[12px] text-gray-600">{roleLabel}</Text>
                        </View>
                    </View>

                    <Pressable className="bg-blue-100 px-4 py-1 rounded-xl">
                        <Text className="text-white font-quicksand-semibold">Profile</Text>
                    </Pressable>
                </View>

                {/* Contact */}
                <View className="px-4 mb-6">
                    <Text className="text-gray-600">📱 {user?.phone ?? "-"}</Text>
                    <Text className="text-gray-600">📧 {user?.email ?? "No email"}</Text>
                    <Text className="text-gray-500 mt-1">👤 Type: {roleLabel}</Text>
                </View>

                {/* Menu + Logout */}
                <Text className="text-gray-500 font-quicksand-semibold mb-3 ml-1">For More</Text>
                <FlatList
                    data={menu}
                    scrollEnabled={false}
                    keyExtractor={(_, i) => `menu-item-${i}`}
                    renderItem={({ item }) => (
                        <Pressable
                            className="flex-row items-center py-4 px-2 bg-white border-b border-gray-200"
                            onPress={item.onPress}
                            android_ripple={{ color: "#e8e8e8" }}
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
            </View>
        </SafeAreaView>
    );
}
