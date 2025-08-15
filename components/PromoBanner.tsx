import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, Image, Pressable, Text, View, ViewToken } from "react-native";

type PromoBannerType = {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    cta?: string;
    backgroundColor?: string;
};

type PromoBannerProps = {
    banners: PromoBannerType[];
};

const { width } = Dimensions.get("window");

export default function PromoBanner({ banners }: PromoBannerProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems && viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    });

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

    if (!banners || banners.length === 0) return null;

    return (
        <View className="py-2">
            <FlatList
                ref={flatListRef}
                data={banners}
                horizontal
                pagingEnabled
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewConfigRef.current}
                renderItem={({ item }) => (
                    <View
                        style={{
                            width: width - 40,
                            marginRight: 10,
                            backgroundColor: item.backgroundColor || "#016FAE",
                        }}
                        className="rounded-2xl h-36 justify-center px-6 relative overflow-hidden"
                    >
                        <Image
                            source={item.image}
                            className="absolute right-1 bottom-0 w-32 h-32 opacity-60"
                            resizeMode="contain"
                        />
                        <Text className="text-white text-lg font-quicksand-bold mb-2">{item.title}</Text>
                        <Text className="text-white text-base mb-4">{item.subtitle}</Text>
                        <Pressable
                            className="bg-white rounded-full px-5 py-2 flex-row items-center w-max"
                            style={{
                                alignSelf: "flex-start",
                            }}
                            android_ripple={{ color: "#e6e6e6", borderless: false }}
                        >
                            <Text className="text-blue-100 font-quicksand-bold mr-2">{item.cta || "View more"}</Text>
                            <Feather name="arrow-right" size={16} color="#016FAE" />
                        </Pressable>
                    </View>
                )}
                snapToInterval={width - 40}
                decelerationRate="fast"
            />

            <View className="flex-row justify-center items-center mt-1">
                {banners.map((_, i) => (
                    <View
                        key={i}
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 9999,
                            marginHorizontal: 3,
                            backgroundColor: i === activeIndex ? "#016FAE" : "#D1D5DB",
                        }}
                    />
                ))}
            </View>
        </View>
    );
}
