import BusinessCard from "@/components/BusinessCard";
import GlobalStyles from "@/components/GlobalStyles";
import { businesses } from "@/constants";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Dimensions, FlatList, Pressable, SafeAreaView, Text, View } from "react-native";

// Card size calculation (4 columns, 3 gaps of 12px, 2 sides of 16px)
const CARD_SIZE = (Dimensions.get("window").width - 48) / 4;

export default function Businesses() {
    return (
        <SafeAreaView className="flex-1 bg-blue-100" style={GlobalStyles.droidSafeArea}>
            {/* Blue background */}
            {/* White rounded panel */}
            <View className="flex-1 h-full absolute bottom-0 left-0 right-0">
                <View
                    className="
                        bg-white
                        rounded-t-[40px]
                        shadow-xl
                        flex-1
                        px-2
                        pt-8
                    "
                    style={{
                        // Use negative margin to "pull" white card up into the blue
                        // Adjust value for your needs (e.g. mt-[-44px] is ~-11)
                        shadowColor: "#1a1a1a",
                        shadowOpacity: 0.09,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 8,
                    }}
                >
                    {/* Header Row */}
                    <View className="flex-row items-center justify-between mb-5 z-20">
                        <Pressable className="p-2 rounded-full bg-white shadow-sm">
                            <Feather name="arrow-left" size={22} color="#016FAE" />
                        </Pressable>
                        <Text className="text-2xl font-quicksand-bold text-black">All Businesses</Text>
                        <Pressable className="p-2 rounded-full bg-white shadow-sm">
                            <Feather name="sliders" size={22} color="#016FAE" />
                        </Pressable>
                    </View>

                    {/* Grid of Business Cards */}
                    <FlatList
                        data={businesses}
                        keyExtractor={item => item.id}
                        numColumns={4}
                        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 14 }}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        renderItem={({ item }) => (
                            <View style={{ width: CARD_SIZE }}>
                                <BusinessCard
                                    id={item.id}
                                    name={item.name}
                                    image={item.image}
                                    onPress={() => { }}
                                // onPress={() => { () => router.push(`/(tabs)/business/${id}`) }}
                                />
                            </View>
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
