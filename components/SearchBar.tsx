import { Feather } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";

export default function SearchBar() {
    return (
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-4 shadow-sm">
            <TextInput
                className="flex-1 text-base font-quicksand-semibold text-gray-800"
                placeholder="Search everything"
                placeholderTextColor="#b0b0b0"
            />
            <Pressable>
                <Feather name="sliders" size={22} color="#b0b0b0" />
            </Pressable>
        </View>
    );
}
