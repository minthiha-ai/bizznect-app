import GlobalStyles from '@/components/GlobalStyles';
import { Category, useGlobalStore } from '@/stores/global-store';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Directory, File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BusinessDetail() {
    const { id, fromProfiles } = useLocalSearchParams();
    const router = useRouter();

    const fetchBusinessDetail = useGlobalStore((state) => state.fetchBusinessDetail);
    const businessResponse = useGlobalStore((state) => state.businessDetail);
    const business = businessResponse?.data;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof id === 'string') {
            setLoading(true);
            fetchBusinessDetail(id).finally(() => setLoading(false));
        }
    }, [fetchBusinessDetail, id]);


    const downloadQrImage = async (url: string) => {
        try {
            const directory = new Directory(Paths.cache, 'qr-codes')
            await directory.create() // create destination folder

            const output = await File.downloadFileAsync(url, directory)
            console.log('Downloaded file exists?', output.exists)
            console.log('Downloaded file path:', output.uri)

            const { status } = await MediaLibrary.requestPermissionsAsync()
            if (status !== 'granted') {
                alert('Permission denied to save image.')
                return
            }

            await MediaLibrary.saveToLibraryAsync(output.uri)
            alert('QR code saved to your gallery.')

        } catch (err) {
            console.error('Error downloading QR code:', err)
            alert('Download failed.')
        }
    }

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0074b7" />
            </View>
        );
    }

    if (!business) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">Business not found.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" style={GlobalStyles.droidSafeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Banner */}
                <View className="relative bg-[#0074b7] rounded-b-3xl pb-6">
                    <Image
                        source={{ uri: business.logo || 'https://via.placeholder.com/600x300.png?text=No+Logo' }}
                        className="w-full h-[220px]"
                        resizeMode="cover"
                    />

                    <TouchableOpacity
                        className="absolute top-3 left-4 p-2 bg-white rounded-full"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={22} color="#0074b7" />
                    </TouchableOpacity>

                    {/* Business Info Box */}
                    <View className="absolute -bottom-8 left-4 flex-row items-center bg-white p-3 pr-5 rounded-xl shadow-md">
                        <View className="w-12 h-12 rounded-md bg-orange-100 items-center justify-center mr-3">
                            <Text className="text-xs font-bold text-orange-600">
                                {business.categories?.[0]?.name?.toUpperCase() || 'BUSINESS'}
                            </Text>
                        </View>
                        <View>
                            <Text className="text-lg font-bold text-black">{business.name}</Text>
                            <View className="flex-row items-center gap-1 mt-1">
                                <Ionicons name="location" size={14} color="#555" />
                                <Text className="text-gray-600 text-sm">
                                    Yangon , {business.township?.TS_Name}
                                </Text>
                            </View>
                            <View className="flex-row mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Ionicons key={i} name="star" size={14} color="#facc15" />
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View className="px-5 mt-12 pb-20">
                    {/* Description */}
                    <Text className="text-lg font-bold text-black mb-2">Description</Text>
                    <Text className="text-gray-700 text-sm leading-relaxed mb-4">
                        {business.description || 'No description provided.'}
                    </Text>

                    {/* Tags */}
                    <View className="flex-row flex-wrap gap-2 mb-4">
                        {business.categories?.map((cat: Category) => (
                            <View key={cat.id} className="bg-[#0074b7] px-4 py-1.5 rounded-full">
                                <Text className="text-white text-sm">{cat.name}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Info Blocks */}
                    <InfoBlock
                        icon="location"
                        label={`Yangon , ${business.township?.TS_Name}`}
                        value={business.address ?? 'No address'}
                        onPress={() => {
                            const query = encodeURIComponent(business.address ?? '');
                            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
                        }}
                    />

                    <InfoBlock
                        icon="call"
                        label="Phone"
                        value={business.phone ?? 'No phone'}
                        onPress={() => business.phone && Linking.openURL(`tel:${business.phone}`)}
                    />

                    <InfoBlock
                        icon="star"
                        label="Rating"
                        value="Rating / Review"
                    />

                    <InfoBlock
                        icon="globe"
                        label="Website"
                        value={business.website ?? 'No website'}
                        onPress={() =>
                            business.website &&
                            Linking.openURL(
                                business.website.startsWith('http')
                                    ? business.website
                                    : `https://${business.website}`
                            )
                        }
                    />

                    <InfoBlock
                        icon="time"
                        label="Open Hours"
                        value="10:00AM - 05:00PM"
                    />

                    {/* ✅ QR Code Section */}
                    {fromProfiles === '1' && business.qr_code && (
                        <View className="items-center mt-6">
                            <Text className="text-base font-semibold text-black mb-2">
                                Business QR Code
                            </Text>
                            <Image
                                source={{ uri: business.qr_code }}
                                className="w-48 h-48 rounded-lg"
                                resizeMode="contain"
                            />

                            <View className="flex-row mt-3">
                                <TouchableOpacity
                                    onPress={() => downloadQrImage(business.qr_code)}
                                    className="bg-[#0074b7] px-5 py-2 rounded-full"
                                >
                                    <Text className="text-white text-sm font-medium">Download</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function InfoBlock({
    icon,
    label,
    value,
    onPress,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    onPress?: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center justify-between border border-[#0074b7] p-4 rounded-xl mb-3"
        >
            <View className="flex-row items-center space-x-3">
                <Ionicons name={icon} size={22} color="#0074b7" />
                <View>
                    <Text className="text-xs text-gray-500">{label}</Text>
                    <Text className="text-sm text-black">{value}</Text>
                </View>
            </View>
            {onPress && <Feather name="arrow-right" size={18} color="gray" />}
        </TouchableOpacity>
    );
}
