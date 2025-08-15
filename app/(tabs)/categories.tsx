import CategoryCard from "@/components/CategoryCard";
import GlobalStyles from "@/components/GlobalStyles";
import { categoryData } from "@/constants";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Dimensions, FlatList, Pressable, SafeAreaView, Text, View } from "react-native";

const CARD_SIZE = (Dimensions.get("window").width - 48) / 4;

export default function Categories() {
    return (
        <SafeAreaView className="flex-1 bg-blue-100" style={GlobalStyles.droidSafeArea}>
            <View className="flex-1 h-full absolute bottom-0 left-0 right-0">
                <View
                    className="bg-white rounded-t-[40px] shadow-xl flex-1 px-2 pt-8"
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
                        <Pressable className="p-2 rounded-full bg-white shadow-sm">
                            <Feather name="arrow-left" size={22} color="#016FAE" />
                        </Pressable>
                        <Text className="text-2xl font-quicksand-bold text-black">Categories</Text>
                        <Pressable className="p-2 rounded-full bg-white shadow-sm">
                            <Feather name="sliders" size={22} color="#016FAE" />
                        </Pressable>
                    </View>

                    {/* Category Grid */}
                    <FlatList
                        data={categoryData}
                        keyExtractor={item => item.id}
                        numColumns={4}
                        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        renderItem={({ item }) => (
                            <View style={{ width: CARD_SIZE }}>
                                <CategoryCard
                                    icon={item.icon as keyof typeof Feather.glyphMap}
                                    name={item.name}
                                    color={item.color}
                                    iconColor={item.iconColor}
                                />
                            </View>
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
