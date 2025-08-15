import { TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface CustomInputProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
    label?: string;
    required?: boolean;
    leftIcon?: keyof typeof Feather.glyphMap;
    isPassword?: boolean;
    error?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    containerClassName?: string;
    inputClassName?: string;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
}

export type ButtonType = 'primary' | 'secondary' | 'text' | 'link';

export interface CustomButtonProps extends Omit<PressableProps, 'style'> {
    type?: ButtonType;
    title: string;
    secondaryText?: string;
    icon?: keyof typeof Feather.glyphMap;
    iconPosition?: 'left' | 'right';
    textClassName?: string;
    containerClassName?: string;
    isLoading?: boolean;
    disabled?: boolean;
}

interface TabBarIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
}