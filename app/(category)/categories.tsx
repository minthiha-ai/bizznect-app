import CategoryCard from "@/components/CategoryCard";
import GlobalStyles from "@/components/GlobalStyles";
import { useGlobalStore } from "@/stores/global-store";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Categories() {
    const router = useRouter();
    const { categories, fetchCategories } = useGlobalStore();

    useEffect(() => {
        fetchCategories();
        console.log('Fetched categories');
    }, [fetchCategories]);

    return (
        <SafeAreaView className="flex-1" style={GlobalStyles.droidSafeArea}>
            <View className="flex-1 h-full bg-blue-100">
                <View
                    className="
                        bg-white
                        rounded-t-[40px]
                        shadow-xl
                        flex-1
                        px-2
                        pt-4
                        mt-5
                    "
                    style={{
                        shadowColor: "#1a1a1a",
                        shadowOpacity: 0.09,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 8,
                    }}
                >
                    {/* Header Row */}
                    <View className="flex-row items-center justify-between mb-6 z-20">
                        <Pressable className="p-2 rounded-full bg-white shadow-sm" onPress={() => router.back()}>
                            <Feather name="arrow-left" size={22} color="#016FAE" />
                        </Pressable>
                        <Text className="text-2xl font-quicksand-bold text-black">Categories</Text>
                        <Pressable className="p-2 rounded-full bg-white shadow-sm">
                            <Feather name="sliders" size={22} color="#016FAE" />
                        </Pressable>
                    </View>

                    {/* Category Grid */}
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.id}
                        numColumns={4}
                        columnWrapperStyle={{
                            justifyContent: "flex-start",
                            gap: 16,
                            marginBottom: 16,
                        }}
                        contentContainerStyle={{
                            paddingBottom: 30,
                            paddingHorizontal: 8,
                        }}
                        renderItem={({ item }) => (
                            <CategoryCard
                                icon={item.icon}
                                name={item.name}
                                onPress={() =>
                                    router.push({
                                        pathname: "/(business)/category-business",
                                        params: { slug: item.slug, name: item.name },
                                    })
                                }
                            />
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
