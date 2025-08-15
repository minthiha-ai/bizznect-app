import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const tags = ["Products", "Ecommance", "Contact", "Beauty", "Electrical"];

export default function BusinessDetails() {
    return (
        <View className="flex-1 bg-[#f6fafd]">
            {/* Top blue background with image */}
            <View className="bg-blue-100 h-56 rounded-b-3xl relative justify-center items-center">
                {/* Carousel arrows */}
                <Pressable className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/60 rounded-full">
                    <Feather name="chevron-left" size={26} color="#016FAE" />
                </Pressable>
                <Image
                    source={{ uri: "https://img.freepik.com/free-vector/shop-cartoon_23-2147491093.jpg" }}
                    className="w-48 h-32 rounded-xl"
                    resizeMode="contain"
                />
                <Pressable className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/60 rounded-full">
                    <Feather name="chevron-right" size={26} color="#016FAE" />
                </Pressable>
            </View>

            {/* Floating Info Card */}
            <View className="bg-white mx-4 p-4 rounded-2xl -mt-10 shadow-md flex-row items-center space-x-4">
                {/* Category Icon */}
                <View className="bg-orange-100 p-2 rounded-lg">
                    <MaterialIcons name="store" size={30} color="#DC661F" />
                </View>
                <View className="flex-1">
                    <Text className="font-bold text-lg text-black">Electronic Shop</Text>
                    <View className="flex-row items-center space-x-1 mt-1">
                        <Feather name="map-pin" size={16} color="#016FAE" />
                        <Text className="text-gray-700 text-xs">Yangon, Hlaing Tsp</Text>
                    </View>
                    <View className="flex-row space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                            <Feather key={i} name="star" size={16} color="#FFC700" />
                        ))}
                    </View>
                </View>
            </View>

            {/* Main Content */}
            <ScrollView className="flex-1 px-4 mt-2" showsVerticalScrollIndicator={false}>
                {/* Description */}
                <Text className="font-bold text-lg mt-3 mb-1">Description</Text>
                <Text className="text-gray-700 text-base mb-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus odio sit amet est eleifend, vitae fringilla massa dignissim. Maecenas rutrum euismod tempor.
                </Text>
                {/* Tag Pills */}
                <View className="flex-row flex-wrap gap-2 mb-3">
                    {tags.map(tag => (
                        <View key={tag} className="bg-blue-100/80 px-4 py-1 rounded-full mb-1">
                            <Text className="text-white font-semibold">{tag}</Text>
                        </View>
                    ))}
                </View>
                {/* Info Cards */}
                <View className="space-y-3 mb-6">
                    <InfoCard
                        icon={<Feather name="map-pin" size={20} color="#016FAE" />}
                        label="Yangon , Hlaing Tsp"
                        value="No.112, Near Baho Road, Hlaing Township"
                    />
                    <InfoCard
                        icon={<Feather name="phone" size={20} color="#016FAE" />}
                        label="Phone"
                        value="09311132211"
                    />
                    <InfoCard
                        icon={<Feather name="star" size={20} color="#016FAE" />}
                        label="Rating"
                        value="Rating / Review"
                    />
                    <InfoCard
                        icon={<Feather name="clock" size={20} color="#016FAE" />}
                        label="Open Hours"
                        value="10:00AM - 05:00PM"
                    />
                </View>
            </ScrollView>
        </View>
    );
}

// Info card row
function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <View className="border border-blue-100 rounded-xl px-3 py-2 flex-row items-center justify-between bg-white">
            <View className="flex-row items-center space-x-2">
                {icon}
                <View>
                    <Text className="text-xs text-gray-400">{label}</Text>
                    <Text className="text-black font-bold">{value}</Text>
                </View>
            </View>
            <Feather name="arrow-right" size={20} color="#016FAE" />
        </View>
    );
}
