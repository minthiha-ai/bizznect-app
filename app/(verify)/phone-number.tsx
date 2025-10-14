import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

type AuthType = 'user' | 'admin';

const PhoneNumber = () => {
    const router = useRouter();
    const { requestOtp } = useAuth();
    const params = useLocalSearchParams<{ type?: string }>();

    const [phone, setPhone] = useState('');
    const [authType, setAuthType] = useState<AuthType>('user');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadPending = async () => {
            const paramType = params?.type;
            const validParamType = paramType === 'admin' || paramType === 'user'
                ? (paramType as AuthType)
                : null;

            const [storedPhone, storedType] = await Promise.all([
                AsyncStorage.getItem('pending_phone'),
                AsyncStorage.getItem('pending_type'),
            ]);

            if (storedPhone) setPhone(storedPhone);

            if (validParamType) {
                setAuthType(validParamType);
                await AsyncStorage.setItem('pending_type', validParamType);
            } else if (storedType === 'admin' || storedType === 'user') {
                setAuthType(storedType as AuthType);
            }
        };

        loadPending();
    }, [params?.type]);

    const handleSendCode = async () => {
        if (!phone) return;

        try {
            setLoading(true);
            const message = await requestOtp();

            const match = message?.match(/OTP: (\d{6})/);
            const otpCode = match ? match[1] : '';

            if (__DEV__) console.log('[PhoneNumber] OTP sent:', message);

            router.push({
                pathname: '/(verify)/verify-code',
                params: {
                    type: authType,
                    otp: otpCode
                }
            });
        } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.message || err.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View className="flex-1 px-6 pt-10">
                    <Pressable onPress={() => router.back()} className="mb-6">
                        <Text className="text-lg text-blue-100">
                            <Feather name="arrow-left" size={28} />
                        </Text>
                    </Pressable>

                    <Text className="text-2xl font-quicksand-bold mb-1">
                        Verify your mobile number
                    </Text>
                    <Text className="text-gray-500 mb-7">
                        {authType === 'admin' ? 'Business User' : 'User'}
                    </Text>

                    <Text className="text-base text-gray-500 mb-2">Mobile Number</Text>
                    <View className="flex-row items-center border-b border-gray-200 pb-3 mb-7">
                        <Image
                            source={{ uri: "https://hatscripts.github.io/circle-flags/flags/mm.svg" }}
                            className="w-8 h-8 mr-3"
                        />
                        <Text className="text-base text-black">{phone}</Text>
                    </View>

                    <View className="items-end mt-8">
                        <Pressable
                            className="bg-[#176da6] rounded-full w-14 h-14 items-center justify-center"
                            onPress={handleSendCode}
                            disabled={!phone || loading}
                            style={!phone || loading ? { opacity: 0.5 } : {}}
                        >
                            <Text className="text-white text-2xl">{'>'}</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default PhoneNumber;
