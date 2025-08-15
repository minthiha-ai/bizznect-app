import { CustomInputProps } from "@/types";
import { Feather } from '@expo/vector-icons';
import { useState } from "react";
import { Pressable, Text, TextInput, View } from 'react-native';

const CustomInput = ({
    label,
    required = false,
    leftIcon,
    isPassword = false,
    error,
    value,
    onChangeText,
    placeholder,
    containerClassName = '',
    inputClassName = '',
    containerStyle,
    inputStyle,
    ...props
}: CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className={`mb-6 ${containerClassName}`} style={containerStyle}>
            {label && (
                <Text className={`mb-1 text-gray-500 text-base ${isFocused ? 'font-quicksand-bold' : 'font-quicksand'}`}>
                    {label}
                    {required && <Text className="text-red-500"> *</Text>}
                </Text>
            )}

            <View className="flex-row items-center">
                {leftIcon && (
                    <Feather name={leftIcon} size={20} color="#b0b0b0" style={{ marginRight: 8 }} />
                )}

                <View style={{ flex: 1, position: 'relative' }}>
                    <TextInput
                        className={`
              py-2
              text-lg
              text-black
              border-b-2
              font-quicksand
              ${isFocused ? 'border-blue-100' : 'border-gray-200'}
              ${error ? 'border-red-500' : ''}
              ${inputClassName}
            `}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor="#bbb"
                        secureTextEntry={isPassword && !showPassword}
                        autoCapitalize="none"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        style={[
                            { paddingRight: isPassword ? 30 : 0 },
                            inputStyle
                        ]}
                        {...props}
                    />

                    {isPassword && (
                        <Pressable
                            onPress={() => setShowPassword((prev) => !prev)}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: '50%',
                                transform: [{ translateY: -12 }],
                                padding: 4,
                            }}
                        >
                            <Feather
                                name={showPassword ? "eye" : "eye-off"}
                                size={20}
                                color="#b0b0b0"
                            />
                        </Pressable>
                    )}
                </View>
            </View>

            {error && (
                <Text className="text-red-500 text-xs mt-1 font-quicksand">{error}</Text>
            )}
        </View>
    );
};

export default CustomInput;
