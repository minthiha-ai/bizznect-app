import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

type AuthType = 'user' | 'admin';

const VerifyCode = () => {
    const params = useLocalSearchParams<{ type?: string; otp?: string }>();
    const router = useRouter();
    const { verifyOtp, requestOtp } = useAuth();

    const [code, setCode] = useState('');
    const [phone, setPhone] = useState('');
    const [authType, setAuthType] = useState<AuthType>('user');
    const [loading, setLoading] = useState(false);

    // Load phone, type, and passed OTP
    useEffect(() => {
        const loadPending = async () => {
            const [storedPhone, storedType] = await Promise.all([
                AsyncStorage.getItem('pending_phone'),
                AsyncStorage.getItem('pending_type'),
            ]);

            if (storedPhone) setPhone(storedPhone);
            if (storedType === 'admin' || storedType === 'user') {
                setAuthType(storedType as AuthType);
            }

            if (params?.otp && typeof params.otp === 'string') {
                setCode(params.otp); // auto-fill
            }
        };

        loadPending();
    }, [params?.otp]);

    const handleVerify = async () => {
        if (code.length !== 6) return;

        try {
            setLoading(true);
            await verifyOtp(code);
            Alert.alert('Success', 'Your number has been verified.');
            await AsyncStorage.multiRemove(['pending_phone', 'pending_type']);
            router.replace('/(tabs)');
        } catch (err: any) {
            Alert.alert('Verification Failed', err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setLoading(true);
            const msg = await requestOtp();

            const match = msg?.match(/OTP: (\d{6})/);
            if (match) setCode(match[1]);

            if (msg) Alert.alert('OTP Sent', msg);
        } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.message || err.message);
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
                    <Pressable onPress={() => router.push('/(verify)/phone-number')} className="mb-6">
                        <Text className="text-lg text-blue-100">
                            <Feather name="arrow-left" size={28} />
                        </Text>
                    </Pressable>

                    <Text className="text-2xl font-quicksand-bold mb-1">Enter the verification code</Text>
                    <Text className="text-gray-500 mb-7">
                        {authType === 'admin' ? 'Business User' : 'User'} {phone ? `• ${phone}` : ''}
                    </Text>

                    {/* {code !== '' && (
                        <Text className="text-lg text-[#176da6] font-quicksand-semibold mb-3">
                            Use this code: {code}
                        </Text>
                    )} */}

                    <Text className="text-base text-gray-500 mb-2">Code</Text>
                    <TextInput
                        className="text-2xl tracking-widest border-b border-gray-200 py-2 mb-6"
                        value={code}
                        onChangeText={setCode}
                        placeholder="- - - - - -"
                        placeholderTextColor="#bbb"
                        keyboardType="number-pad"
                        maxLength={6}
                        textAlign="left"
                    />

                    <Pressable className="mb-7" onPress={handleResend} disabled={loading}>
                        <Text className="text-[#176da6] text-base font-quicksand-semibold">
                            Resend Code
                        </Text>
                    </Pressable>

                    <View className="items-end mt-8">
                        <Pressable
                            className="bg-[#176da6] rounded-full w-14 h-14 items-center justify-center"
                            onPress={handleVerify}
                            disabled={code.length !== 6 || loading}
                            style={code.length !== 6 || loading ? { opacity: 0.5 } : {}}
                        >
                            <Text className="text-white text-2xl">
                                <Feather name="arrow-right" size={28} />
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default VerifyCode;
