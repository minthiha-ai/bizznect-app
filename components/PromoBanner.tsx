import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Image,
    Pressable,
    Text,
    View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

type PromoBannerType = {
    id: string;
    title: string;
    subtitle: string;
    image: any;
    cta?: string;
    backgroundColor?: string;
};

type PromoBannerProps = {
    banners: PromoBannerType[];
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 15;

export default function PromoBanner({ banners }: PromoBannerProps) {
    if (!banners || banners.length === 0) return null;

    return (
        <View>
            <Carousel
                loop
                width={width}
                height={150}
                autoPlay
                autoPlayInterval={3000}
                scrollAnimationDuration={800}
                data={banners}
                renderItem={({ item }) => (
                    <View
                        style={{
                            width: CARD_WIDTH,
                            marginRight: 10,
                            backgroundColor: item.backgroundColor || "#016FAE",
                        }}
                        className="rounded-2xl h-40 justify-center px-6 relative overflow-hidden"
                    >
                        <Image
                            source={
                                typeof item.image === "string"
                                    ? { uri: item.image }
                                    : item.image
                            }
                            className="absolute right-2 bottom-2 w-32 h-32 opacity-60"
                            resizeMode="contain"
                        />
                        <Text className="text-white text-xl font-quicksand-bold mb-2">
                            {item.title}
                        </Text>
                        <Text
                            className="text-white text-base mb-4"
                            numberOfLines={2}
                            style={{ maxWidth: CARD_WIDTH * 0.65 }}
                        >
                            {item.subtitle}
                        </Text>
                        <Pressable
                            className="bg-white rounded-full px-5 py-2 flex-row items-center w-max"
                            style={{ alignSelf: "flex-start" }}
                            android_ripple={{ color: "#e6e6e6", borderless: false }}
                        >
                            <Text className="text-blue-100 font-quicksand-bold mr-2">
                                {item.cta || "View more"}
                            </Text>
                            <Feather name="arrow-right" size={16} color="#016FAE" />
                        </Pressable>
                    </View>
                )}
            />
        </View>
    );
}
