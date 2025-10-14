import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import GlobalStyles from "./GlobalStyles";

export default function SearchBar() {
    const router = useRouter();

    return (
        <View className="flex-row items-center mt-5 mb-4 gap-2 px-2">
            {/* Search bar area */}
            <Pressable
                onPress={() => router.push("/(business)/search")}
                className="flex-1 flex-row items-center bg-white rounded-3xl px-3 py-2"
                style={GlobalStyles.shadow}
            >
                <Feather name="search" size={20} color="#b0b0b0" />
                <Text className="ml-2 text-base font-quicksand-semibold text-gray-400">
                    Search everything
                </Text>
                <View className="ml-auto">
                    <Feather name="sliders" size={22} color="#b0b0b0" />
                </View>
            </Pressable>

            {/* QR scan icon button */}
            <Pressable
                onPress={() => router.push("/(business)/qr")}
                className="w-10 h-10 bg-white rounded-xl items-center justify-center"
                style={GlobalStyles.shadow}
            >
                <Feather name="maximize" size={20} color="#b0b0b0" />
            </Pressable>
        </View>
    );
}
