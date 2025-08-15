import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { useAuth } from '../../contexts/AuthContext';

// 1. Define all keys with type safety!
type BizFieldKey =
    | 'shopName'
    | 'ownerName'
    | 'phone'
    | 'password'
    | 'confirmPw'
    | 'division'
    | 'township'
    | 'address';

// 2. Meta info for each field
const fieldMeta: Record<BizFieldKey, any> = {
    shopName: { label: 'Shop Name', required: true, leftIcon: 'shopping-bag', placeholder: 'Enter shop name' },
    ownerName: { label: 'Owner Name', required: true, leftIcon: 'user', placeholder: 'Enter owner name' },
    phone: { label: 'Phone', required: true, leftIcon: 'phone', placeholder: '09xxxxxxxxx', keyboardType: 'phone-pad' },
    password: { label: 'Password', required: true, leftIcon: 'lock', placeholder: 'Enter password', isPassword: true },
    confirmPw: { label: 'Confirm Password', required: true, leftIcon: 'lock', placeholder: 'Re-enter password', isPassword: true },
    division: { label: 'Division', required: true },
    township: { label: 'Township', required: true },
    address: { label: 'Address', required: false, leftIcon: 'map-pin', placeholder: 'Enter address', multiline: true },
};

// 3. Steps for wizard
const steps: BizFieldKey[][] = [
    ['shopName', 'ownerName'],
    ['phone', 'password', 'confirmPw'],
    ['division', 'township'],
    ['address'],
];

const divisionOptions = ['Yangon', 'Mandalay', 'Ayeyarwady'];
const townshipOptions = ['Hlaing', 'Thanlyin', 'Insein'];

const BusinessSignUp: React.FC = () => {
    const { register } = useAuth();
    const [form, setForm] = useState<Record<BizFieldKey, string>>({
        shopName: '',
        ownerName: '',
        phone: '',
        password: '',
        confirmPw: '',
        division: '',
        township: '',
        address: '',
    });
    const [image, setImage] = useState<string | null>(null);
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (name: BizFieldKey, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validateStep = (): boolean => {
        const fields = steps[step];
        for (const field of fields) {
            if (fieldMeta[field].required && !form[field]) {
                Alert.alert('Error', `Please enter ${fieldMeta[field].label.toLowerCase()}.`);
                return false;
            }
        }
        if ((fields.includes('confirmPw') || fields.includes('password')) && form.password !== form.confirmPw) {
            Alert.alert('Error', 'Passwords do not match.');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep()) setStep(prev => prev + 1);
    };
    const handlePrev = () => setStep(prev => prev - 1);

    // const pickImage = async () => {
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [1, 1],
    //         quality: 0.7,
    //     });
    //     if (!result.canceled) {
    //         setImage(result.assets[0].uri);
    //     }
    // };

    const handleSignUp = async () => {
        if (!validateStep()) return;
        // if (!image) {
        //     Alert.alert('Error', 'Please upload a shop image.');
        //     return;
        // }

        setIsLoading(true);
        try {
            // Business user = 'admin' for API purposes
            await register(
                {
                    name: form.ownerName, // account holder's name
                    email: `${form.phone}@biznects.info`, // optional placeholder
                    phone: form.phone,
                    password: form.password,
                    password_confirmation: form.confirmPw,
                },
                'admin'
            );

            // Save for the verify UI
            await AsyncStorage.multiSet([
                ['pending_phone', form.phone],
                ['pending_type', 'admin'],
            ]);

            // Go straight to verify with type
            router.replace('/(verify)/phone-number?type=admin');
        } catch (error: any) {
            Alert.alert('Error', error?.response?.data?.message || error.message || 'Sign-up failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderPicker = (field: 'division' | 'township', options: string[]) => (
        <Pressable
            key={`picker-${field}`}
            className="border-b-2 border-gray-200 px-0 py-3 bg-white text-base mb-6 flex-row items-center justify-between"
            onPress={() => {
                const idx = options.indexOf(form[field]);
                const nextValue = options[(idx + 1) % options.length] || options[0];
                handleChange(field, nextValue);
            }}
        >
            <Text className={`text-base ${form[field] ? 'text-black' : 'text-gray-400'}`}>
                {form[field] || `Select ${field}`}
            </Text>
            <Feather name="chevron-down" size={20} color="#bbb" />
        </Pressable>
    );

    const renderStep = () => {
        const fields = steps[step];
        return (
            <>
                {fields.map(field =>
                    field === 'division'
                        ? renderPicker('division', divisionOptions)
                        : field === 'township'
                            ? renderPicker('township', townshipOptions)
                            : (
                                <CustomInput
                                    key={`${step}-${field}`}
                                    {...fieldMeta[field]}
                                    value={form[field]}
                                    onChangeText={val => handleChange(field, val)}
                                    inputClassName="text-base"
                                    containerClassName="mb-6"
                                />
                            )
                )}

                {/* {step === steps.length - 1 && (
                    <>
                        <Text className="mb-1 font-quicksand-semibold text-gray-800">
                            Image <Text className="text-red-500">*</Text>
                        </Text>
                        <Pressable
                            className="border border-gray-200 rounded-xl px-4 py-6 bg-gray-50 items-center justify-center mb-4"
                            onPress={pickImage}
                        >
                            {image ? (
                                <Image source={{ uri: image }} className="w-20 h-20 rounded-lg" />
                            ) : (
                                <>
                                    <Feather name="upload" size={24} />
                                    <Text className="text-gray-400 mt-2">Tap to upload image</Text>
                                </>
                            )}
                        </Pressable>
                    </>
                )} */}
            </>
        );
    };

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
            >
                <Text className="text-center text-2xl font-quicksand-bold text-[#176da6] my-8">
                    Business Sign Up
                </Text>

                {renderStep()}

                <View className="flex-row justify-between mt-3">
                    <CustomButton
                        type="secondary"
                        title="Prev"
                        icon="arrow-left"
                        iconPosition="left"
                        onPress={handlePrev}
                        disabled={step === 0 || isLoading}
                        containerClassName="flex-1 mr-2"
                    />
                    {step < steps.length - 1 ? (
                        <CustomButton
                            type="primary"
                            title="Next"
                            icon="arrow-right"
                            iconPosition="right"
                            onPress={handleNext}
                            disabled={isLoading}
                            containerClassName="flex-1 ml-2"
                        />
                    ) : (
                        <CustomButton
                            type="primary"
                            title="Sign Up"
                            icon="user-plus"
                            iconPosition="right"
                            isLoading={isLoading}
                            disabled={isLoading}
                            onPress={handleSignUp}
                            containerClassName="flex-1 ml-2"
                        />
                    )}
                </View>

                <View className="flex-row items-center my-4">
                    <View className="flex-1 h-px bg-gray-200/60" />
                    <Text className="mx-2 text-gray-400 text-sm">Or continue as</Text>
                    <View className="flex-1 h-px bg-gray-200/60" />
                </View>

                <CustomButton
                    type="secondary"
                    title="Sign Up as Normal User"
                    onPress={() => router.push('/(auth)/sign-up')}
                />

                <View className="flex-row justify-center mt-6">
                    <Text className="text-base text-gray-700">Already have an account? </Text>
                    <CustomButton
                        type="text"
                        title="Sign In"
                        onPress={() => router.push('/(auth)/business-sign-in')}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default BusinessSignUp;
