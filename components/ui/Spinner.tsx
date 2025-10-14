import React from 'react';
import { ActivityIndicator, View } from 'react-native';

type SpinnerProps = {
    size?: 'small' | 'large';
    color?: string;
    centered?: boolean;
};

const Spinner = ({ size = 'large', color = '#176da6', centered = true }: SpinnerProps) => {
    if (centered) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size={size} color={color} />
            </View>
        );
    }

    return <ActivityIndicator size={size} color={color} />;
};

export default Spinner;
