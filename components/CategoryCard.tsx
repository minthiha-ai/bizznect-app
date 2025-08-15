import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type CategoryCardProps = {
    icon: keyof typeof Feather.glyphMap;
    name: string;
    color: string; // e.g. "#F4EBFF"
    iconColor: string; // e.g. "#A187DF"
    onPress?: () => void;
};

const CategoryCard: React.FC<CategoryCardProps> = ({
    icon, name, color, iconColor, onPress,
}) => (
    <Pressable
        className="bg-white rounded-2xl justify-center items-center"
        style={{
            width: 80,
            height: 90,
            shadowColor: "#d1d5db",
            shadowOpacity: 0.7,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
        }}
        onPress={onPress}
    >
        <View
            className="rounded-full mb-2"
            style={{
                backgroundColor: color,
                width: 48,
                height: 48,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Feather name={icon} size={28} color={iconColor} />
        </View>
        <Text className="text-xs text-gray-500">{name}</Text>
    </Pressable>
);

export default CategoryCard;
