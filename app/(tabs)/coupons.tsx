import CouponCard from "@/components/CouponCard";
import GlobalStyles from "@/components/GlobalStyles";
import { coupons } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Coupons() {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1" style={GlobalStyles.droidSafeArea}>
            <View className="flex-1 h-full bg-blue-100">
                <View
                    className="
                        bg-white
                        rounded-t-[40px]
                        shadow-lg
                        shadow-black/10
                        elevation-8
                        flex-1
                        px-2
                        pt-4
                        mt-5
                    "
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-6 z-20">
                        <Pressable className="p-2 rounded-full bg-white shadow-sm" onPress={() => router.back()}>
                            <Feather name="arrow-left" size={22} color="#016FAE" />
                        </Pressable>
                        <Text className="text-2xl font-quicksand-bold text-black">Coupons</Text>
                        <Pressable className="p-2 rounded-full bg-white shadow-sm">
                            <Feather name="sliders" size={22} color="#016FAE" />
                        </Pressable>
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
