import React from "react";
import { Image, Pressable, Text, View } from "react-native";

type CategoryCardProps = {
    icon: string;
    name: string;
    onPress?: () => void;
};

const CategoryCard: React.FC<CategoryCardProps> = ({
    icon, name, onPress,
}) => (
    <Pressable
        className="bg-white rounded-2xl justify-center items-center"
        style={{
            width: 80,
            height: 90,
            paddingVertical: 10,
            shadowColor: "#d1d5db",
            shadowOpacity: 0.7,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
        }}
        onPress={onPress}
    >
        <View
            style={{
                width: 40,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 6,
            }}
        >
            <Image
                source={{ uri: icon }}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
            />
        </View>
        <Text className="text-xs text-gray-600 text-center" numberOfLines={2}>
            {name}
        </Text>
    </Pressable>
);

export default CategoryCard;
