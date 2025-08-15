import React from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";

type CouponCardProps = {
    title: string;
    image: string;
    amount: string;
    type: string;
    code: string;
    bgColor?: string;
};

const CouponCard: React.FC<CouponCardProps> = ({
    title,
    image,
    amount,
    type,
    code,
    bgColor = "bg-gray-100"
}) => (
    <View className="flex-row w-full my-3">
        <ImageBackground
            source={{ uri: image }}
            imageStyle={{ borderRadius: 18 }}
            className="rounded-2xl w-[160px] h-[88px] justify-end shadow-lg"
            resizeMode="cover"
        >
            <View className="absolute inset-0 bg-black/40 rounded-2xl" />
            <Text className="text-white text-base font-quicksand-semibold mb-2 px-2 z-10">
                {title}
            </Text>
        </ImageBackground>
        {/* Right panel */}
        <View className="flex-1 ml-4 justify-between">
            <Text className="text-lg font-quicksand-semibold">{amount}</Text>
            <Text className="text-gray-400">{type}</Text>
            <Pressable className="bg-blue-100 rounded-lg py-1 px-4 mt-2 w-[70%] self-start shadow-lg">
                <Text className="text-white font-quicksand-semibold text-sm">USE | {code}</Text>
            </Pressable>
        </View>
    </View>
);

export default CouponCard;
