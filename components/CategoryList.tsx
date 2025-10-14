import { useRouter } from "expo-router";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import GlobalStyles from "./GlobalStyles";
import { Category } from "@/stores/global-store";

type CategoryListProps = {
    categories: Category[];
};

export default function CategoryList({ categories }: CategoryListProps) {
    const router = useRouter();
    return (
        <View className="mb-5">
            <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable
                        className="items-center mx-2 w-16"
                        style={GlobalStyles.shadow}
                        onPress={() =>
                            router.push({
                                pathname: "/(business)/category-business",
                                params: { slug: item.slug, id: item.id },
                            })
                        }
                    >
                        <View
                            className="size-12 rounded-full bg-blue-100/10 justify-center items-center mb-1"
                            style={GlobalStyles.shadow}
                        >
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
                    </Pressable>
                )}
                contentContainerStyle={{ paddingHorizontal: 0 }}
            />
        </View>
    );
}
