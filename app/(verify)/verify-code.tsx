import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    Text,
    TextInput,
    View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

type AuthType = 'user' | 'admin';

const VerifyCode = () => {
    const [code, setCode] = useState('');
    const [phone, setPhone] = useState('');
    const [authType, setAuthType] = useState<AuthType>('user'); // display only
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { verifyOtp, requestOtp } = useAuth();

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
            // Phone is optional for API now; if missing we still allow verification.
        };

        loadPending();
    }, []);

    const handleVerify = async () => {
        if (code.length !== 6) return;

        try {
            setLoading(true);
            await verifyOtp(code); // ✅ Bearer-only + { otp }
            Alert.alert('Success', 'Your number has been verified.');

            // Clear local pending hints
            await AsyncStorage.multiRemove(['pending_phone', 'pending_type']);

            // ✅ We already have a valid token/session → go home
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
            const msg = await requestOtp(); // ✅ no args
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
                    {/* Back button */}
                    <Pressable onPress={() => router.push('/(verify)/phone-number')} className="mb-6">
                        <Text className="text-lg text-blue-100">
                            <Feather name="arrow-left" size={28} />
                        </Text>
                    </Pressable>

                    {/* Title */}
                    <Text className="text-2xl font-quicksand-bold mb-1">Enter the verification code</Text>
                    <Text className="text-gray-500 mb-7">
                        {authType === 'admin' ? 'Business User' : 'User'} {phone ? `• ${phone}` : ''}
                    </Text>

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

                    {/* Resend Code */}
                    <Pressable className="mb-7" onPress={handleResend} disabled={loading}>
                        <Text className="text-[#176da6] text-base font-quicksand-semibold">
                            Resend Code
                        </Text>
                    </Pressable>

                    {/* Next button */}
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
