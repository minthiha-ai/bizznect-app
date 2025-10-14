import GlobalStyles from "@/components/GlobalStyles";
import BusinessProfile from "@/components/profiles/business/BusinessProfile";
import UserProfile from "@/components/profiles/user/UserProfile";
import { useAuthStore } from "@/stores/auth-store";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
    const { user, userType, logout } = useAuthStore();
    const router = useRouter();

    const isGuest = userType === "guest" || !user;

    return (
        <SafeAreaView className="flex-1" style={GlobalStyles.droidSafeArea}>
            <View className="flex-1 h-full bg-blue-100">
                <View className="bg-white rounded-t-[40px] flex-1 px-2 pt-4 mt-5" style={GlobalStyles.shadow}>

                    {/* Header */}
                    <View className="flex-row items-center justify-between my-5">
                        <View className="w-9" />
                        <Text className="text-2xl font-bold text-blue-100">Account</Text>
                        <View className="w-9" />
                    </View>

                    {/* If guest, show auth prompt */}
                    {isGuest ? (
                        <View className="px-4 mt-6">
                            <Text className="text-lg font-quicksand-semibold mb-4 text-center">
                                You&apos;re currently browsing as a guest.
                            </Text>
                            <Pressable
                                className="bg-blue-100 py-3 rounded-xl mb-3"
                                onPress={() => router.push("/(auth)/sign-in")}
                            >
                                <Text className="text-center text-white font-quicksand-bold text-base">
                                    Sign In
                                </Text>
                            </Pressable>
                            <Pressable
                                className="border border-blue-100 py-3 rounded-xl"
                                onPress={() => router.push("/(auth)/sign-up")}
                            >
                                <Text className="text-center text-blue-100 font-quicksand-bold text-base">
                                    Create Account
                                </Text>
                            </Pressable>
                        </View>
                    ) : (
                        <>
                            {/* Shared Profile Info */}
                                <View className="bg-white flex-row items-center px-4 py-3 rounded-2xl mb-4" style={GlobalStyles.shadow}>
                                <View className="bg-blue-100 rounded-full size-12 justify-center items-center mr-3">
                                    <Feather name="user" size={30} color="#fff" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-lg font-quicksand-semibold">
                                        {user?.name ?? "Unknown"}
                                    </Text>
                                    <View className="mt-1 self-start px-2 py-[2px] rounded-md bg-gray-100">
                                        <Text className="text-[12px] text-gray-600">
                                            {userType === "admin" ? "Business Admin" : "User"}
                                        </Text>
                                    </View>
                                </View>
                                <Pressable
                                    className="bg-blue-100 px-4 py-1 rounded-xl"
                                    onPress={() => {
                                        if (userType === "admin") {
                                            router.push("/(business)/business-profiles");
                                        }
                                    }}
                                >
                                    <Text className="text-white font-quicksand-semibold">Profile</Text>
                                </Pressable>
                            </View>

                            {/* Role-based section */}
                            {userType === "admin" ? (
                                <BusinessProfile user={user} logout={logout} />
                            ) : (
                                <UserProfile user={user} logout={logout} />
                            )}
                        </>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
