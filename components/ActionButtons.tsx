import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function ActionButtons() {
    return (
        <View className="flex-row justify-between mb-5">
            <Pressable className="bg-white flex-1 items-center py-3 mx-1 rounded-xl shadow">
                <Text className="font-quicksand-bold text-base mb-1">Create Coupon</Text>
                <Feather name="gift" size={20} color="#36d399" />
            </Pressable>
            <Pressable className="bg-white flex-1 items-center py-3 mx-1 rounded-xl shadow">
                <Text className="font-quicksand-bold text-base mb-1">Promotion Coupon</Text>
                <Feather name="gift" size={20} color="#36d399" />
            </Pressable>
        </View>
    );
}
