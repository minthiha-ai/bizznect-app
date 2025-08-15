import GlobalStyles from '@/components/GlobalStyles';
import { images } from '@/constants';
import { Slot } from 'expo-router';
import React from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, SafeAreaView, View } from 'react-native';

export default function _Layout() {
    return (
        <SafeAreaView className='flex-1 bg-white' style={GlobalStyles.droidSafeArea}>
            {/* Blue Curve Header */}
            <View
                className="w-full bg-blue-100 rounded-b-[120px] items-center justify-center"
                style={{ height: Dimensions.get('screen').height / 5.25 }}
            >
                <Image
                    source={images.logo}
                    className="size-40"
                />
            </View>
            {/* Page Content */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={32}
            >
                <Slot />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
