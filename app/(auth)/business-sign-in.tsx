import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { useAuth } from '../../contexts/AuthContext';

export default function BusinessSignIn() {
    const { login } = useAuth();
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

        setIsLoading(true);
        try {
            // Calls /admin/login under the hood
            await login({ login: loginValue.trim(), password, type: 'admin' });
            // No manual navigation needed; AuthContext redirects admins to /(business)
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || 'Sign-in failed. Please try again.';
            Alert.alert('Error', msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 px-7">
            <Text className="text-center text-2xl font-quicksand-bold text-[#176da6] my-8">
                Business Sign in
            </Text>

            <CustomInput
                label="Phone or Email"
                leftIcon="phone"
                value={form.login}
                onChangeText={val => handleChange('login', val)}
                placeholder="09xxxxxxxxx"
                keyboardType="default"
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
                title="Sign In as Normal User"
                secondaryText="For normal account holders only"
                onPress={() => router.push('/(auth)/sign-in')}
            />

            <View className="flex-row justify-center mt-6">
                <Text className="text-base text-gray-700">Don&apos;t have an account? </Text>
                <CustomButton
                    type="text"
                    title="Sign Up"
                    onPress={() => router.push('/(auth)/business-sign-up')}
                />
            </View>
        </View>
    );
}
