import GlobalStyles from '@/components/GlobalStyles';
import { useGlobalStore } from '@/stores/global-store';
import { Ionicons } from '@expo/vector-icons';
import { Directory, File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

export default function BusinessDetail() {
    const { id, fromProfiles } = useLocalSearchParams();
    const router = useRouter();

    const fetchBusinessDetail = useGlobalStore((state) => state.fetchBusinessDetail);
    const businessResponse = useGlobalStore((state) => state.businessDetail);
    const business = businessResponse?.data;

    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (typeof id === 'string') {
            setLoading(true);
            fetchBusinessDetail(id).finally(() => setLoading(false));
        }
    }, [fetchBusinessDetail, id]);

    const downloadQrImage = async (url: string) => {
        try {
            const directory = new Directory(Paths.cache, 'qr-codes');
            await directory.create();
            const output = await File.downloadFileAsync(url, directory);
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') return alert('Permission denied.');
            await MediaLibrary.saveToLibraryAsync(output.uri);
            alert('QR code saved to your gallery.');
        } catch {
            alert('Download failed.');
        }
    };

    if (loading)
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0074b7" />
            </View>
        );

    if (!business)
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">Business not found.</Text>
            </View>
        );

    const images = business?.images?.length
        ? business.images
        : [business.logo, business.logo, business.logo].filter(Boolean);

    return (
        <SafeAreaView className="flex-1 bg-white" style={GlobalStyles.droidSafeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* 🖼️ Image Carousel */}
                <View className="relative">
                    <FlatList
                        data={images}
                        keyExtractor={(_, i) => i.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                            setActiveIndex(index);
                        }}
                        renderItem={({ item }) => (
                            <Image
                                source={{
                                    uri: item || 'https://via.placeholder.com/600x300.png?text=No+Image',
                                }}
                                className="w-screen h-[220px]"
                                resizeMode="cover"
                            />
                        )}
                    />

                    {/* Back + Heart */}
                    <View className="absolute top-4 left-4 flex-row items-center justify-between w-[92%]">
                        <TouchableOpacity
                            className="bg-white p-2 rounded-full"
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={22} color="#0074b7" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-white p-2 rounded-full">
                            <Ionicons name="heart-outline" size={22} color="#f66" />
                        </TouchableOpacity>
                    </View>

                    {/* Views badge */}
                    <View className="absolute bottom-4 left-4 bg-[#f66] px-3 py-1.5 rounded-md flex-row items-center">
                        <Ionicons name="eye" size={16} color="#fff" />
                        <Text className="text-white text-xs ml-1">1105</Text>
                    </View>

                    {/* Dots */}
                    <View className="absolute bottom-3 w-full items-center">
                        <View className="flex-row gap-1">
                            {images.map((_: string, i: number) => (
                                <View
                                    key={i}
                                    className={`h-2 w-2 rounded-full ${i === activeIndex ? 'bg-[#016FAE]' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* 🏬 Business Info */}
                <View className="px-5 pt-4">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-lg font-quicksand-bold text-black">
                            {business.name}
                        </Text>
                        <View className="flex-row items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Ionicons key={i} name="star" size={14} color="#facc15" />
                            ))}
                            <Text className="text-xs text-gray-500 ml-1">(150 Reviews)</Text>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View className="flex-row flex-wrap gap-2 mt-3">
                        {['Shop Detail', 'Products', 'Ecommerce', 'Ecommerce'].map((tab, i) => (
                            <TouchableOpacity
                                key={i}
                                className={`px-4 py-1.5 rounded-md ${i === 0 ? 'bg-[#f66]' : 'bg-gray-300'
                                    }`}
                            >
                                <Text
                                    className={`text-xs font-semibold ${i === 0 ? 'text-white' : 'text-black'
                                        }`}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Address / Phone / Map */}
                    <View className="mt-5 space-y-2.5">
                        <InfoLine
                            icon="location-outline"
                            text={`${business.address ?? 'No address'}, ${business.township?.TS_Name || ''
                                }`}
                        />
                        <InfoLine
                            icon="call-outline"
                            text={business.phone ?? 'No phone'}
                            onPress={() => business.phone && Linking.openURL(`tel:${business.phone}`)}
                        />
                        <InfoLine
                            icon="map-outline"
                            text="https://www.google.com/"
                            onPress={() =>
                                Linking.openURL(
                                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        business.address ?? ''
                                    )}`
                                )
                            }
                        />
                    </View>

                    {/* Description */}
                    <Text className="text-gray-600 mt-4 text-sm leading-relaxed">
                        {expanded
                            ? business.description ||
                            'A cozy place for students and freelancers.'
                            : (business.description || 'A cozy place for students and freelancers.').slice(
                                0,
                                150
                            ) + (business.description?.length > 150 ? '...' : '')}
                    </Text>
                    {business.description?.length > 150 && (
                        <TouchableOpacity
                            onPress={() => setExpanded(!expanded)}
                            className="mt-1 self-end"
                        >
                            <Text className="text-black underline text-sm">
                                {expanded ? 'see less' : 'see more'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* Opening Hours */}
                    <View className="mt-6 mb-8">
                        <Text className="text-base font-quicksand-bold mb-2 text-black">
                            Opening Hours
                        </Text>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <View
                                key={i}
                                className="flex-row justify-between border-b border-gray-100 py-1.5"
                            >
                                <Text className="text-sm text-gray-700">Saturday</Text>
                                <Text className="text-sm text-gray-700">10 AM - 09 PM</Text>
                            </View>
                        ))}
                    </View>

                    {/* ✅ QR Section */}
                    {fromProfiles === '1' && business.qr_code && (
                        <View className="items-center mt-6 mb-10">
                            <Text className="text-base font-semibold text-black mb-2">
                                Business QR Code
                            </Text>
                            <Image
                                source={{ uri: business.qr_code }}
                                className="w-44 h-44 rounded-lg"
                                resizeMode="contain"
                            />
                            <TouchableOpacity
                                onPress={() => downloadQrImage(business.qr_code)}
                                className="bg-[#016FAE] px-6 py-2 rounded-full mt-3"
                            >
                                <Text className="text-white text-sm font-medium">Download</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function InfoLine({
    icon,
    text,
    onPress,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
    onPress?: () => void;
}) {
    return (
        <TouchableOpacity onPress={onPress} className="flex-row items-center">
            <Ionicons name={icon} size={18} color="#016FAE" />
            <Text className="text-sm text-gray-700 ml-2">{text}</Text>
        </TouchableOpacity>
    );
}
