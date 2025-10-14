import GlobalStyles from '@/components/GlobalStyles';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalStore } from '@/stores/global-store';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BusinessProfilesPage() {
    const { user } = useAuth();
    const router = useRouter();

    const allBusinesses = useGlobalStore((state) => state.businesses);
    const fetchBusinesses = useGlobalStore((state) => state.fetchBusinesses);

    useEffect(() => {
        fetchBusinesses();
    }, [])

    const businesses = useMemo(() => {
        if (!user?.id) return [];
        console.log('[Filter] All Businesses:', allBusinesses);
        const filtered = allBusinesses.filter((biz) => biz.admin_id === user.id);
        console.log('[Filter] Filtered Businesses for user ID', user.id, ':', filtered);
        return filtered;
    }, [user, allBusinesses]);

    return (
        <SafeAreaView className="flex-1" style={GlobalStyles.droidSafeArea}>
            <View className="flex-1 h-full bg-blue-100">
                <View className="flex-1 relative">
                    {/* Scrollable Content */}
                    <ScrollView
                        className="bg-white rounded-t-[40px] px-2 pt-4 mt-5 pb-28"
                    >
                        {/* Header */}
                        <View className="flex-row items-center justify-between my-5">
                            <Pressable
                                className="p-2 rounded-full bg-white"
                                onPress={() => router.back()}
                            >
                                <Feather name="arrow-left" size={22} color="#016FAE" />
                            </Pressable>
                            <Text className="text-2xl font-bold text-[#0363AD] dark:text-white">
                                Profiles
                            </Text>
                            <View className="w-9" />
                        </View>

                        {businesses.map((biz) => (
                            <Pressable
                                key={biz.id}
                                onPress={() =>
                                    router.push({
                                        pathname: '/business/[id]',
                                        params: { id: biz.id, fromProfiles: '1' },
                                    })
                                }
                                className="flex-row items-start mb-4 p-4 rounded-2xl bg-[#F8F8F8] dark:bg-neutral-900"
                                style={GlobalStyles.shadow}
                            >
                                <Image
                                    source={{ uri: biz.logo }}
                                    className="w-16 h-16 rounded-xl mr-4"
                                />

                                <View className="flex-1">
                                    <Text className="text-base font-semibold text-black dark:text-white">
                                        {biz.name}
                                    </Text>
                                    <View className="flex-row flex-wrap gap-2 mt-2">
                                        {biz.categories.map((cat) => (
                                            <View
                                                key={cat.id}
                                                className="px-2 py-1 rounded-full bg-[#E6EFFB] dark:bg-neutral-700"
                                            >
                                                <Text className="text-xs text-[#0363AD] dark:text-white">
                                                    {cat.name}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {/* Floating Button */}
                    <View className="absolute bottom-5 left-4 right-4">
                        <Pressable
                            onPress={() => router.push("/(business)/business-register")}
                            className="bg-[#0363AD] rounded-full py-4 items-center justify-center"
                            style={GlobalStyles.shadowMd}
                        >
                            <Text className="text-white font-medium text-base">
                                Register Business
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
