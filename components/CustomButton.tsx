import { CustomButtonProps } from "@/types";
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

const CustomButton = ({
    type = 'primary',
    title,
    secondaryText,
    icon,
    iconPosition = 'left',
    textClassName = '',
    containerClassName = '',
    isLoading = false,
    disabled = false,
    onPress,
    ...props
}: CustomButtonProps) => {
    // Container style by button type
    const getContainerStyle = () => {
        switch (type) {
            case 'primary':
                return 'bg-[#176da6] rounded-xl py-4 items-center mb-5 active:bg-[#155a8a]';
            case 'secondary':
                return 'flex-col items-center justify-center bg-gray-100 rounded-xl py-3 mb-3 border border-gray-200 active:bg-gray-200';
            case 'text':
                return '';
            case 'link':
                return 'self-end mb-7';
            default:
                return '';
        }
    };

    // Text style by button type
    const getTextStyle = () => {
        switch (type) {
            case 'primary':
                return 'text-white text-lg font-quicksand-semibold';
            case 'secondary':
                return 'text-base font-quicksand-semibold text-[#23222b]';
            case 'text':
                return 'text-base text-blue-600 font-quicksand-semibold';
            case 'link':
                return 'text-sm text-[#176da6] underline font-quicksand-medium';
            default:
                return '';
        }
    };

    // Icon color by button type
    const getIconColor = () => (type === 'primary' ? '#fff' : '#176da6');

    return (
        <Pressable
            className={`${getContainerStyle()} ${containerClassName} ${disabled ? 'opacity-50' : ''}`}
            onPress={isLoading || disabled ? undefined : onPress}
            disabled={isLoading || disabled}
            {...props}
        >
            <View className={`flex-row items-center ${type === 'secondary' ? 'justify-center' : ''}`}>
                {icon && iconPosition === 'left' && !isLoading && (
                    <Feather name={icon} size={20} color={getIconColor()} style={{ marginRight: 8 }} />
                )}
                {isLoading ? (
                    <ActivityIndicator size="small" color={getIconColor()} />
                ) : (
                    <Text className={`${getTextStyle()} ${textClassName}`}>{title}</Text>
                )}
                {icon && iconPosition === 'right' && !isLoading && (
                    <Feather name={icon} size={20} color={getIconColor()} style={{ marginLeft: 8 }} />
                )}
            </View>
            {secondaryText && type === 'secondary' && (
                <Text className="text-xs text-gray-500 mt-1">{secondaryText}</Text>
            )}
        </Pressable>
    );
};

export default CustomButton;
