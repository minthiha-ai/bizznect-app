import CustomInput from '@/components/CustomInput';
import GlobalStyles from '@/components/GlobalStyles';
import CustomDropdown from '@/components/inputs/CustomDropdown';
import Dropdown from '@/components/inputs/DropDown';
import { townships } from '@/constants/townships-v2';
import { createBusiness } from '@/lib/services/businessService';
import { compressAndEncodeImage } from '@/lib/uitls/imageUtils';
import { useAuthStore } from '@/stores/auth-store';
import { useGlobalStore } from '@/stores/global-store';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BusinessRegisterForm() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [form, setForm] = useState({
        name: 'Test Cafe',
        tsCode: '111901',
        description: 'A cozy place for students and freelancers',
        phone: '09987654321',
        email: 'test@example.com',
        address: '123 Dummy Street, Yangon',
        website: 'https://testcafe.example.com',
        lat: '16.7983',
        lng: '96.1561',
    });
    const [logo, setLogo] = useState<string | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);

    const getCurrentLocation = async () => {
        setLocationLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Location permission denied');
            setLocationLoading(false);
            return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setForm((prev) => ({
            ...prev,
            lat: loc.coords.latitude.toString(),
            lng: loc.coords.longitude.toString(),
        }));
        setLocationLoading(false);
    };

    const pickLogo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const compressed = await compressAndEncodeImage(uri);
            if (compressed) {
                console.log('Compressed image:', compressed);
                setLogo(compressed);
            } else {
                Alert.alert('Failed to compress image');
            }
        }
    };


    const handleChange = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const { categories, fetchCategories } = useGlobalStore();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const townshipItems = townships.map((t) => ({
        label: `${t.TS_Name} (${t.TS_Name_MMR})`,
        value: t.TS_Code,
    }));

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleSubmit = async () => {
        if (!user) {
            alert("You're not logged in.");
            return;
        }

        // Basic URL validation
        const websiteRegex = /^(https?:\/\/)?([\w\d-]+\.){1,}([a-z]{2,6})(\/[\w\d-]*)*\/?$/i;
        if (form.website && !websiteRegex.test(form.website)) {
            alert("Please enter a valid website URL.");
            return;
        }

        const payload = {
            name: form.name,
            description: form.description,
            phone: form.phone,
            email: form.email,
            address: form.address,
            website: form.website,
            ts_code: form.tsCode,
            lat: form.lat,
            lng: form.lng,
            logo,
            categories: selectedCategories,
            admin_id: user.id,
        };

        try {
            console.log('Submitting form with payload:', {
                ...payload,
                logo: payload.logo ? payload.logo.slice(0, 100) + '...' : 'No logo',
            });

            const res = await createBusiness(payload);

            if (res.status === 201 || res.status === 200) {
                alert('Business registered successfully!');
                router.push('/(tabs)');
            } else {
                console.error(res.data);
                alert('Something went wrong during submission.');
            }
        } catch (error: any) {
            if (error.response) {
                console.log('Validation Error:', error.response.data);
                alert(JSON.stringify(error.response.data.errors || error.response.data.message));
            } else {
                console.error('Error:', error.message);
                alert('Something went wrong!');
            }
        }
    };

    return (
        <SafeAreaView className="flex-1" style={GlobalStyles.droidSafeArea}>
            <View className="flex-1 h-full bg-blue-100">
                <View
                    className="bg-white rounded-t-[40px] shadow-xl flex-1 px-2 pt-4 mt-5"
                    style={{
                        shadowColor: "#1a1a1a",
                        shadowOpacity: 0.09,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 8,
                    }}
                >
                    <View className="flex-row items-center justify-between mb-6 z-20">
                        <Pressable className="p-2" onPress={() => router.back()}>
                            <Feather name="arrow-left" size={28} color="#016FAE" />
                        </Pressable>
                        <Text className="text-2xl font-quicksand-bold text-black">Register Your Business</Text>
                        <View className="w-9" />
                    </View>

                    <KeyboardAwareScrollView
                        className="flex-1 bg-white px-4 pt-6"
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        enableOnAndroid={true}
                    >
                        {logo && (
                            <Image
                                source={{ uri: logo }}
                                className="w-32 h-32 rounded-full self-center my-2"
                            />
                        )}
                        <TouchableOpacity className="my-3 items-center" onPress={pickLogo}>
                            <Text className="text-blue-600 font-quicksand-semibold">Pick Logo</Text>
                        </TouchableOpacity>

                        {/* Inputs */}
                        <CustomInput label="Business Name" value={form.name} onChangeText={(v) => handleChange('name', v)} required />
                        <CustomInput label="Description" value={form.description} onChangeText={(v) => handleChange('description', v)} />
                        <CustomInput label="Phone" value={form.phone} onChangeText={(v) => handleChange('phone', v)} keyboardType="phone-pad" />
                        <CustomInput label="Email" value={form.email} onChangeText={(v) => handleChange('email', v)} keyboardType="email-address" />
                        <CustomInput label="Address" value={form.address} onChangeText={(v) => handleChange('address', v)} />
                        <CustomInput label="Website" value={form.website} onChangeText={(v) => handleChange('website', v)} />
                        <CustomDropdown
                            label="Township"
                            items={townshipItems}
                            value={form.tsCode}
                            onChange={(val) => handleChange("tsCode", val)}
                        />
                        <TouchableOpacity onPress={getCurrentLocation} className="mb-4">
                            <Text className="text-blue-600 font-quicksand-semibold">
                                {locationLoading ? 'Getting location...' : 'Use My Current Location'}
                            </Text>
                        </TouchableOpacity>
                        <CustomInput label="Latitude" value={form.lat} onChangeText={(v) => handleChange('lat', v)} keyboardType="decimal-pad" />
                        <CustomInput label="Longitude" value={form.lng} onChangeText={(v) => handleChange('lng', v)} keyboardType="decimal-pad" />

                        {/* Categories */}
                        <Text className="font-quicksand-semibold text-base mb-2">Select Categories:</Text>
                        <View className="flex-row flex-wrap gap-2 mb-6">
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    onPress={() => toggleCategory(cat.id)}
                                    className={`border px-4 py-2 rounded-full ${selectedCategories.includes(cat.id) ? 'bg-blue-100' : 'bg-white'}`}
                                >
                                    <Text className={selectedCategories.includes(cat.id) ? 'text-white' : 'text-black'}>
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity className="bg-blue-100 py-3 rounded-xl items-center mb-8" onPress={handleSubmit}>
                            <Text className="text-white font-quicksand-bold text-base">Submit</Text>
                        </TouchableOpacity>
                    </KeyboardAwareScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}
