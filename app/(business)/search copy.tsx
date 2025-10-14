import GlobalStyles from '@/components/GlobalStyles';
import Dropdown from '@/components/inputs/DropDown';
import { districts } from '@/constants/districts';
import { stateRegions } from '@/constants/state-regions';
import { townships } from '@/constants/townships-v2';
import { searchBusinesses } from '@/lib/services/businessService';
import { useGlobalStore } from '@/stores/global-store';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function useDebounce<T>(value: T, delay = 500): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function SearchPage() {
    const router = useRouter();
    const screenWidth = Dimensions.get('window').width;
    const NUM_COLUMNS = 3;
    const cardWidth = (screenWidth - 48) / NUM_COLUMNS;

    const [form, setForm] = useState({
        name: '',
        srCode: '',
        dsCode: '',
        tsCode: '',
        lat: '',
        long: '',
        sortOrder: 'asc',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [filterLoading, setFilterLoading] = useState(false);
    const [error, setError] = useState(false);

    const nameKeyword = useDebounce(form.name, 300);
    const debouncedCategories = useDebounce(selectedCategories, 300);

    const setBusinesses = useGlobalStore((s) => s.setBusinesses);
    const categories = useGlobalStore((s) => s.categories);
    const fetchCategories = useGlobalStore((s) => s.fetchCategories);


    const stateRegionItems = stateRegions.map((sr) => ({
        label: `${sr.SR_Name} (${sr.SR_Name_MMR})`,
        value: sr.SR_Code,
    }));

    const filteredDistricts = useMemo(() => {
        if (!form.srCode) return [];
        return districts.filter(d => d.SR_Code === form.srCode);
    }, [form.srCode]);

    const filteredTownships = useMemo(() => {
        if (!form.dsCode) return [];
        return townships.filter(ts => ts.D_Code === form.dsCode);
    }, [form.dsCode]);

    const districtItems = filteredDistricts.map((d) => ({
        label: `${d.D_Name} (${d.D_Name_MMR})`,
        value: d.D_Code,
    }));

    const townshipItems = filteredTownships.map((ts) => ({
        label: `${ts.TS_Name} (${ts.TS_Name_MMR})`,
        value: ts.TS_Code,
    }));


    const fetchAll = useCallback(async () => {
        try {
            const res = await searchBusinesses({});
            const businessList = res.data.business || [];
            setBusinesses(businessList);
            setResults(businessList);
            setError(false);
        } catch (err) {
            console.error('Initial fetch failed:', err);
            setError(true);
        } finally {
            setInitialLoading(false);
        }
    }, [setBusinesses, setResults, setError, setInitialLoading]);

    // Initial load
    useEffect(() => {
        fetchCategories();
        fetchAll();
    }, []);

    // Filtering effect
    useEffect(() => {
        const { srCode, dsCode, tsCode, lat, long } = form;
        const hasFilters = nameKeyword || tsCode || lat || long || debouncedCategories.length > 0;
        if (!hasFilters) return;

        const fetchFiltered = async () => {
            setFilterLoading(true);
            try {
                const paramObj: any = {};
                if (nameKeyword) paramObj.name = nameKeyword;
                if (srCode) paramObj.sr_code = srCode;
                if (dsCode) paramObj.ds_code = dsCode;
                if (tsCode) paramObj.ts_code = tsCode;
                if (debouncedCategories.length > 0) paramObj.category_id = debouncedCategories;
                if (lat && long) {
                    paramObj.lat = lat;
                    paramObj.long = long;
                }

                const res = await searchBusinesses(paramObj);
                setResults(res.data.business || []);
                setError(false);
            } catch (err) {
                console.error('Search fetch failed:', err);
                setError(true);
            } finally {
                setFilterLoading(false);
            }
        };

        fetchFiltered();
    }, [nameKeyword, form.tsCode, form.lat, form.long, debouncedCategories, form]);

    const handleChange = (key: 'name' | 'srCode' | 'dsCode' | 'tsCode' | 'sortOrder', val: string) => {
        setForm((prev) => {
            if (prev[key] === val) return prev;

            if (key === 'srCode') {
                return { ...prev, srCode: val, dsCode: '', tsCode: '' };
            } else if (key === 'dsCode') {
                return { ...prev, dsCode: val, tsCode: '' };
            }

            return { ...prev, [key]: val };
        });
    };

    const sortedResults = useMemo(() => {
        const sorted = [...results];
        if (form.sortOrder === 'asc') {
            return sorted.sort((a, b) => a.name?.localeCompare?.(b.name));
        } else {
            return sorted.sort((a, b) => b.name?.localeCompare?.(a.name));
        }
    }, [results, form.sortOrder]);

    const totalItems = sortedResults.length;
    const shouldCenter = totalItems < NUM_COLUMNS;

    const toggleCategory = useCallback((id: number) => {
        setSelectedCategories((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    }, []);

    const requestLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Location permission denied');
            return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setForm((prev) => ({
            ...prev,
            lat: location.coords.latitude.toString(),
            long: location.coords.longitude.toString(),
        }));
    };

    const renderBusinessCard = useCallback(
        ({ item }: { item: any }) => {
            if (item.placeholder) return <View style={{ width: cardWidth }} />;

            return (
                <Pressable
                    className="bg-white rounded-xl items-center pb-2"
                    style={{
                        width: cardWidth,
                        paddingHorizontal: 4,
                        marginBottom: 12,
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
                                height: cardWidth - 12,
                                borderRadius: 12,
                                marginBottom: 8,
                            }}
                            resizeMode="cover"
                        />
                    ) : (
                        <View
                            style={{
                                width: cardWidth,
                                height: cardWidth - 12,
                                borderRadius: 12,
                                marginBottom: 8,
                                backgroundColor: '#e5e7eb',
                            }}
                        />
                    )}
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="text-center text-black text-xs font-quicksand-semibold mb-2"
                    >
                        {item.name}
                    </Text>
                    <TouchableOpacity
                        className="bg-[#016FAE] rounded-full px-2 py-1"
                        onPress={() => router.push(`/business/${item.id}`)}
                    >
                        <Text className="text-white text-[10px] font-quicksand-semibold">
                            View detail
                        </Text>
                    </TouchableOpacity>
                </Pressable>
            );
        },
        [router, cardWidth]
    );

    const renderHeader = useMemo(() => (
        <View className="pb-4">
            <View className="flex-row items-center justify-between z-20 px-4 pt-4">
                <Pressable className="p-2 rounded-full bg-white" onPress={() => router.back()}>
                    <Feather name="arrow-left" size={22} color="#016FAE" />
                </Pressable>
                <Text className="text-2xl font-bold text-black">Search</Text>
                <View className="size-8" />
            </View>

            <View className="flex-row items-center px-3 py-2 mx-4 bg-white rounded-full mt-4 shadow-md">
                <Feather name="search" size={18} color="#888" />
                <View className="flex-1 flex-row items-center">
                    <TextInput
                        placeholder="Search everything"
                        className="flex-1 px-3 text-sm text-gray-700"
                        value={form.name}
                        onChangeText={(val) => handleChange('name', val)}
                        placeholderTextColor="#888"
                    />
                    {form.name.length > 0 && (
                        <TouchableOpacity onPress={() => handleChange('name', '')}>
                            <Ionicons name="close-circle" size={18} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
                    <Ionicons name="options-outline" size={20} color="#888" />
                </TouchableOpacity>
            </View>

            {showFilters && (
                <View className="mt-4 px-4">
                    <Dropdown
                        label="State/Region"
                        items={stateRegionItems}
                        value={form.srCode}
                        onChangeValue={(val) => handleChange('srCode', val)}
                        placeholder="Select State/Region"
                        zIndex={5000}
                        zIndexInverse={4000}
                        searchable={true}
                    />
                    <Dropdown
                        label="Districts"
                        items={districtItems}
                        value={form.dsCode}
                        onChangeValue={(val) => handleChange('dsCode', val)}
                        placeholder="Select Districts"
                        zIndex={4000}
                        zIndexInverse={3000}
                        searchable={true}
                        disabled={!form.srCode}
                    />

                    <Dropdown
                        label="Township"
                        items={townshipItems}
                        value={form.tsCode}
                        onChangeValue={(val) => handleChange('tsCode', val)}
                        placeholder="Select Township"
                        zIndex={3000}
                        zIndexInverse={2000}
                        searchable={true}
                        disabled={!form.dsCode}
                    />
                    <Dropdown
                        label="Sort Order"
                        items={[
                            { label: 'Ascending (A-Z)', value: 'asc' },
                            { label: 'Descending (Z-A)', value: 'desc' },
                        ]}
                        value={form.sortOrder}
                        onChangeValue={(val) => handleChange('sortOrder', val)}
                        placeholder="Select Order"
                        zIndex={2000}
                        zIndexInverse={1000}
                        searchable={false}
                    />
                    <Text className="text-base font-semibold mt-4 mb-2">Filter by Categories</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {categories.map((cat) => {
                            const selected = selectedCategories.includes(Number(cat.id));
                            return (
                                <TouchableOpacity
                                    key={cat.id}
                                    onPress={() => toggleCategory(Number(cat.id))}
                                    className={`px-4 py-2 rounded-full border ${selected ? 'bg-blue-500 border-blue-500' : 'bg-gray-100 border-gray-300'
                                        }`}
                                >
                                    <Text className={`text-sm ${selected ? 'text-white' : 'text-black'}`}>
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View className="flex-row gap-3 mt-4">
                        <TouchableOpacity
                            onPress={requestLocation}
                            className="bg-blue-100 px-4 py-2 rounded-full"
                        >
                            <Text className="text-white text-sm font-medium">Nearby</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setForm({ name: '', srCode: '', dsCode: '', tsCode: '', lat: '', long: '', sortOrder: 'asc' });
                                setSelectedCategories([]);
                                fetchAll()
                            }}
                            className="bg-gray-400 px-4 py-2 rounded-full"
                        >
                            <Text className="text-white text-sm font-medium">Clear</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    ), [form.name, form.srCode, form.dsCode, form.tsCode, showFilters, selectedCategories, categories, router, toggleCategory, form.sortOrder, fetchAll, districtItems, townshipItems, stateRegionItems]);

    return (
        <SafeAreaView className="flex-1" style={GlobalStyles.droidSafeArea}>
            <View className="flex-1 h-full bg-blue-100">
                <View className="bg-white rounded-t-[40px] shadow-xl flex-1 mt-5 pt-2">
                    <FlatList
                        data={sortedResults}
                        ListHeaderComponent={() => (
                            <>
                                {renderHeader}
                                {filterLoading && (
                                    <ActivityIndicator size="small" color="#888" className="my-2 self-center" />
                                )}
                            </>
                        )}
                        renderItem={renderBusinessCard}
                        keyExtractor={(item, index) => item?.id?.toString?.() ?? index.toString()}
                        numColumns={NUM_COLUMNS}
                        columnWrapperStyle={{
                            justifyContent: shouldCenter ? 'center' : 'space-between',
                            paddingHorizontal: 16,
                        }}
                        contentContainerStyle={{ paddingBottom: 100, paddingTop: 4 }}
                        ListEmptyComponent={
                            initialLoading ? (
                                <ActivityIndicator size="large" color="#016FAE" className="mt-8" />
                            ) : error ? (
                                <Text className="text-center text-red-500 mt-10">
                                    Failed to load businesses. Please try again.
                                </Text>
                            ) : (
                                <Text className="text-center text-gray-400 mt-10">
                                    No results found. Try searching something else.
                                </Text>
                            )
                        }
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
