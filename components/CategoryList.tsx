import { FlatList, Image, Text, View } from "react-native";

type Category = {
    id: string;
    name: string;
    icon: string;
};

type CategoryListProps = {
    categories: Category[];
};

export default function CategoryList({ categories }: CategoryListProps) {
    return (
        <View className="mb-5">
            <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="items-center mx-2 w-16">
                        <View className="size-12 rounded-full bg-blue-100/10 justify-center items-center mb-1">
                            <Image
                                source={{ uri: item.icon }}
                                className="w-6 h-6"
                                resizeMode="contain"
                            />
                        </View>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className="text-[11px] font-quicksand-semibold text-gray-700 text-center"
                        >
                            {item.name}
                        </Text>
                    </View>
                )}
                contentContainerStyle={{ paddingHorizontal: 0 }}
            />
        </View>
    );
}
