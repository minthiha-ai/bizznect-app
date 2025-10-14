import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

export default function SignIn() {
    const { login, continueAsGuest } = useAuth();
    const [form, setForm] = useState({ login: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (name: 'login' | 'password', value: string) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSignIn = async () => {
        const { login: loginValue, password } = form;

        if (!loginValue || !password) {
            Alert.alert('Error', 'Please enter your phone/email and password.');
            return;
        }
        console.log('Attempting sign-in with:', { login: loginValue, password, type: 'user' });
        setIsLoading(true);
        try {
            await login({ login: loginValue.trim(), password, type: 'user' });
        } catch (error: any) {
            Alert.alert('Sign-in failed', error?.response?.data?.message || 'Invalid credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 px-7">
                    <Text className="text-center text-2xl font-quicksand-bold text-[#176da6] my-8">
                        Sign in
                    </Text>

                    <CustomInput
                        label="Phone"
                        leftIcon="user"
                        value={form.login}
                        onChangeText={val => handleChange('login', val)}
                        placeholder="09xxxxxxxxx"
                        keyboardType="default"
                        autoCapitalize="none"
                        autoCorrect={false}
                        inputClassName="text-base"
                        containerClassName="mb-6"
                    />

                    <CustomInput
                        label="Password"
                        leftIcon="lock"
                        value={form.password}
                        onChangeText={val => handleChange('password', val)}
                        placeholder="********"
                        isPassword
                        autoCapitalize="none"
                        inputClassName="text-base"
                        containerClassName="mb-6"
                    />

                    <CustomButton
                        type="link"
                        title="Forgot password?"
                        onPress={() => router.push('/(auth)/forgot-password')}
                    />

                    <CustomButton
                        type="primary"
                        title="Sign In"
                        isLoading={isLoading}
                        disabled={isLoading}
                        onPress={handleSignIn}
                    />

                    <View className="flex-row items-center my-3">
                        <View className="flex-1 h-px bg-gray-200/60" />
                        <Text className="mx-2 text-gray-400 text-sm">Or continue as</Text>
                        <View className="flex-1 h-px bg-gray-200/60" />
                    </View>

                    <CustomButton
                        type="secondary"
                        title="Sign In as Business Owner"
                        secondaryText="For business account holders only"
                        onPress={() => router.push('/(auth)/business-sign-in')}
                    />

                    <CustomButton
                        type="secondary"
                        title="Continue as Guest"
                        onPress={continueAsGuest}
                        containerClassName="mt-3"
                    />

                    <View className="flex-row justify-center mt-6">
                        <Text className="text-base text-gray-700">Don&apos;t have an account? </Text>
                        <CustomButton
                            type="text"
                            title="Sign Up"
                            onPress={() => router.push('/(auth)/sign-up')}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView >
    );
}
