import { Pressable, Text, View } from "react-native";

type SectionHeaderProps = {
    title: string;
    onViewAll?: () => void;
};

export default function SectionHeader({ title, onViewAll }: SectionHeaderProps) {
    return (
        <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-quicksand-semibold text-gray-900">{title}</Text>
            <Pressable onPress={onViewAll}>
                <Text className="text-gray-400 text-base font-quicksand-semibold">View all</Text>
            </Pressable>
        </View>
    );
}
