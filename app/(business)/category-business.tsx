import GlobalStyles from '@/components/GlobalStyles';
import CustomDropdown from '@/components/inputs/CustomDropdown';
import Spinner from '@/components/ui/Spinner';
import { districts } from '@/constants/districts';
import { stateRegions } from '@/constants/state-regions';
import { townships } from '@/constants/townships-v2';
import { getBusinessesByCategory } from '@/lib/services/businessService';
import { useGlobalStore } from '@/stores/global-store';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const NUM_COLUMNS = 4;
const cardWidth = (screenWidth - 48) / NUM_COLUMNS;

// debounce hook
function useDebounce<T>(value: T, delay = 500): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const CategoryBusiness = () => {
    const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();
    const router = useRouter();

    const fetchCategories = useGlobalStore((state) => state.fetchCategories);
    const categories = useGlobalStore((state) => state.categories);

    const [businesses, setBusinesses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // filter states
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [srCode, setSrCode] = useState('');
    const [dsCode, setDsCode] = useState('');
    const [tsCode, setTsCode] = useState('');
    const [lat, setLat] = useState('');
    const [long, setLong] = useState('');

    const debouncedSearch = useDebounce(search, 300);
    const debouncedCategories = useDebounce(selectedCategories, 300);

    // ✅ Load businesses by category from API
    useEffect(() => {
        const loadData = async () => {
            console.log('category id ', id)
            setIsLoading(true);
            await fetchCategories();
            try {
                const res = await getBusinessesByCategory(id!);
                setBusinesses(res.data.data || []);
                console.log('Fetched businesses:', res.data.data);
            } catch (err) {
                console.error('Failed to fetch businesses by category:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const res = await getBusinessesByCategory(id!);
            setBusinesses(res.data.data || []);
        } catch (err) {
            console.error('Refresh failed:', err);
        } finally {
            setIsRefreshing(false);
        }
    };

    // cascade filters
    const filteredDistricts = useMemo(() => {
        if (!srCode) return [];
        return districts.filter((d) => d.SR_Code === srCode);
    }, [srCode]);

    const filteredTownships = useMemo(() => {
        if (!dsCode) return [];
        return townships.filter((ts) => ts.D_Code === dsCode);
    }, [dsCode]);

    const stateRegionItems = stateRegions.map((sr) => ({
        label: `${sr.SR_Name} (${sr.SR_Name_MMR})`,
        value: sr.SR_Code,
    }));

    const districtItems = filteredDistricts.map((d) => ({
        label: `${d.D_Name} (${d.D_Name_MMR})`,
        value: d.D_Code,
    }));

    const townshipItems = filteredTownships.map((ts) => ({
        label: `${ts.TS_Name} (${ts.TS_Name_MMR})`,
        value: ts.TS_Code,
    }));

    // ✅ Filter logic (now based on API data)
    const filteredBusinesses = useMemo(() => {
        const base = businesses; // already category-filtered from API

        return base.filter((b) => {
            const matchesName =
                !debouncedSearch ||
                b.name?.toLowerCase().includes(debouncedSearch.toLowerCase());

            const matchesCategory =
                debouncedCategories.length === 0 ||
                b.categories?.some((c: any) =>
                    debouncedCategories.includes(Number(c.id))
                );

            const matchesTS = !tsCode || b.ts_code === tsCode;
            const matchesLatLng =
                !lat || !long || (b.lat === lat && b.lng === long);

            return matchesName && matchesCategory && matchesTS && matchesLatLng;
        });
    }, [businesses, debouncedSearch, debouncedCategories, tsCode, lat, long]);

    // sort
    const sortedResults = useMemo(() => {
        const sorted = [...filteredBusinesses];
        return sortOrder === 'asc'
            ? sorted.sort((a, b) => a.name?.localeCompare?.(b.name))
            : sorted.sort((a, b) => b.name?.localeCompare?.(a.name));
    }, [filteredBusinesses, sortOrder]);

    // pad grid
    const paddedBusinesses = useMemo(() => {
        const remainder = sortedResults.length % NUM_COLUMNS;
        if (remainder === 0) return sortedResults;

        const placeholders = Array(NUM_COLUMNS - remainder)
            .fill(null)
            .map((_, idx) => ({ id: `placeholder-${idx}`, placeholder: true }));

        return [...sortedResults, ...placeholders];
    }, [sortedResults]);

    const toggleCategory = (catId: number) => {
        setSelectedCategories((prev) =>
            prev.includes(catId) ? prev.filter((i) => i !== catId) : [...prev, catId]
        );
    };

    const requestLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Location permission denied');
            return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setLat(location.coords.latitude.toString());
        setLong(location.coords.longitude.toString());
    };

    const clearFilters = () => {
        setSearch('');
        setSortOrder('asc');
        setSelectedCategories([]);
        setSrCode('');
        setDsCode('');
        setTsCode('');
        setLat('');
        setLong('');
    };

    const renderItem = ({ item }: any) => {
        if (item.placeholder) return <View style={{ width: cardWidth }} />;

        return (
            <Pressable
                className="bg-white rounded-xl items-center pb-2"
                style={{
                    width: cardWidth,
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 6,
                }}
                onPress={() => router.push(`/business/${item.id}`)}
            >
                {item.logo ? (
                    <Image
                        source={{ uri: item.logo }}
                        style={{
                            width: cardWidth,
                            height: cardWidth * 0.75,
                            borderRadius: 12,
                            marginBottom: 4,
                        }}
                        resizeMode="cover"
                    />
                ) : (
                    <View
                        style={{
                            width: cardWidth,
                            height: cardWidth * 0.75,
                            borderRadius: 12,
                            marginBottom: 4,
                            backgroundColor: '#e5e7eb',
                        }}
                    />
                )}

                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="text-center text-black text-xs font-quicksand-semibold"
                >
                    {item.name}
                </Text>

                <TouchableOpacity
                    className="bg-[#016FAE] rounded-full px-2 py-[0.25rem]"
                    onPress={() => router.push(`/business/${item.id}`)}
                >
                    <Text className="text-white text-[10px] font-quicksand-semibold">
                        View detail
                    </Text>
                </TouchableOpacity>
            </Pressable>
        );
    };

    return (
        <SafeAreaView className="flex-1" style={GlobalStyles.droidSafeArea}>
            <View className="flex-1 h-full bg-blue-100">
                <View
                    className="
                        bg-white
                        rounded-t-[40px]
                        shadow-xl
                        flex-1
                        px-2
                        pt-4
                        mt-5
                    "
                    style={{
                        shadowColor: '#1a1a1a',
                        shadowOpacity: 0.09,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 8,
                    }}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4 z-20 px-2">
                        <Pressable
                            className="p-2 rounded-full bg-white"
                            onPress={() => router.back()}
                        >
                            <Feather name="arrow-left" size={22} color="#016FAE" />
                        </Pressable>
                        <Text className="text-2xl font-quicksand-bold text-black">
                            {slug || 'Businesses'}
                        </Text>
                        <Pressable
                            className="p-2 rounded-full bg-white"
                            onPress={() => setShowFilters((prev) => !prev)}
                        >
                            <Feather name="sliders" size={22} color="#016FAE" />
                        </Pressable>
                    </View>

                    {/* Filters */}
                    {showFilters && (
                        <ScrollView
                            className="px-4 mb-4 pt-4"
                            style={{ maxHeight: screenHeight / 2 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Search bar */}
                            <View
                                className="flex-row items-center px-3 py-2 bg-white rounded-full mb-4"
                                style={GlobalStyles.shadowMd}
                            >
                                <Feather name="search" size={18} color="#888" />
                                <TextInput
                                    placeholder="Search businesses"
                                    className="flex-1 px-3 text-sm text-gray-700"
                                    value={search}
                                    onChangeText={setSearch}
                                    placeholderTextColor="#888"
                                />
                                {search.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearch('')}>
                                        <Ionicons name="close-circle" size={18} color="#888" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* State/Region, District, Township */}
                            <CustomDropdown
                                label="State/Region"
                                items={stateRegionItems}
                                value={srCode}
                                onChange={setSrCode}
                                placeholder="Select State/Region"
                            />
                            <CustomDropdown
                                label="Districts"
                                items={districtItems}
                                value={dsCode}
                                onChange={setDsCode}
                                placeholder="Select District"
                                disabled={!srCode}
                            />
                            <CustomDropdown
                                label="Township"
                                items={townshipItems}
                                value={tsCode}
                                onChange={setTsCode}
                                placeholder="Select Township"
                                disabled={!dsCode}
                            />

                            {/* Category chips */}
                            <Text className="text-base font-semibold mt-4 mb-2">
                                Filter by Categories
                            </Text>
                            <View className="flex-row flex-wrap gap-2 mb-4">
                                {categories.map((cat) => {
                                    const selected = selectedCategories.includes(Number(cat.id));
                                    return (
                                        <TouchableOpacity
                                            key={cat.id}
                                            onPress={() => toggleCategory(Number(cat.id))}
                                            className={`px-4 py-2 rounded-full border ${selected
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'bg-gray-100 border-gray-300'
                                                }`}
                                        >
                                            <Text
                                                className={`text-sm ${selected ? 'text-white' : 'text-black'
                                                    }`}
                                            >
                                                {cat.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {/* Sort order */}
                            <CustomDropdown
                                label="Sort Order"
                                items={[
                                    { label: 'Ascending (A-Z)', value: 'asc' },
                                    { label: 'Descending (Z-A)', value: 'desc' },
                                ]}
                                value={sortOrder}
                                onChange={(val) => setSortOrder(val as 'asc' | 'desc')}
                                placeholder="Select Sort Order"
                            />

                            {/* Nearby + Clear */}
                            <View className="flex-row gap-3 mt-4 mb-6">
                                <TouchableOpacity
                                    onPress={requestLocation}
                                    className="bg-blue-500 px-4 py-2 rounded-full"
                                >
                                    <Text className="text-white text-sm font-medium">
                                        Nearby
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={clearFilters}
                                    className="bg-gray-400 px-4 py-2 rounded-full"
                                >
                                    <Text className="text-white text-sm font-medium">
                                        Clear
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    )}

                    {/* Content */}
                    {isLoading ? (
                        <View className="items-center justify-center flex-1 mt-10">
                            <Spinner size="large" />
                        </View>
                    ) : sortedResults.length === 0 ? (
                        <Text className="text-center text-gray-500 mt-10">
                            No businesses in this category.
                        </Text>
                    ) : (
                        <FlatList
                            data={paddedBusinesses}
                            keyExtractor={(item, index) => item.id || index.toString()}
                            numColumns={NUM_COLUMNS}
                            columnWrapperStyle={{
                                justifyContent: 'space-between',
                                paddingHorizontal: 4,
                                marginBottom: 16,
                            }}
                            contentContainerStyle={{
                                paddingHorizontal: 4,
                                paddingBottom: 100,
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={handleRefresh}
                                    tintColor="#176da6"
                                />
                            }
                            renderItem={renderItem}
                            showsHorizontalScrollIndicator={false}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CategoryBusiness;
