import React from "react";
import { Image, Pressable, Text } from "react-native";

type BusinessCardProps = {
    id: string;
    name: string;
    image: string;
    onPress?: () => void;
};

const BusinessCard: React.FC<BusinessCardProps> = ({
    id, name, image, onPress
}) => (
    <Pressable className="bg-white rounded-xl items-center min-h-[130px]"
        style={{
            shadowColor: "#d1d5db",
            shadowOpacity: 0.7,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
        }}
        key={id}
        onPress={onPress}
    >
        <Image
            source={{ uri: image }}
            className="w-full h-20 rounded-t-xl"
            resizeMode="cover"
        />
        <Text className="font-quicksand-semibold text-[13px] text-center mt-2">{name}</Text>
        <Pressable
            className="bg-blue-100 rounded-xl py-1 px-2 self-center absolute bottom-2 left-1 right-1"
            onPress={onPress}
        >
            <Text className="text-white text-[12px] font-quicksand-semibold text-center">View detail</Text>
        </Pressable>
    </Pressable>
);

export default BusinessCard;
