import CouponCard from "@/components/CouponCard";
import GlobalStyles from "@/components/GlobalStyles";
import { coupons } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { FlatList, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";

export default function Coupons() {
    return (
        <SafeAreaView className="flex-1 bg-blue-100" style={GlobalStyles.droidSafeArea}>
            <View className="flex-1 h-full absolute bottom-0 left-0 right-0">
                <View className="bg-white rounded-t-[40px] shadow-xl flex-1 px-4 pt-8"
                    style={{
                        shadowColor: "#1a1a1a",
                        shadowOpacity: 0.09,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 8,
                    }}>
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-6 z-20">
                        <Pressable className="p-2 rounded-full bg-white shadow-sm">
                            <Feather name="arrow-left" size={22} color="#016FAE" />
                        </Pressable>
                        <Text className="text-2xl font-bold text-black">Coupon</Text>
                        <View className="size-8" /> {/* Spacer for symmetry */}
                    </View>
                    {/* Search Bar */}
                    <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-4 shadow-sm border border-gray-200">
                        <TextInput className="flex-1 text-base text-gray-800" placeholder="Search everything" placeholderTextColor="#b0b0b0" />
                        <Pressable>
                            <Feather name="sliders" size={22} color="#b0b0b0" />
                        </Pressable>
                    </View>
                    {/* Coupon list */}
                    <FlatList
                        data={coupons}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <>
                                <CouponCard {...item} />
                                <View className="h-1" />
                                <View className="border-b border-gray-200" />
                            </>
                        )}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
