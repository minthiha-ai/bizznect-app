import { FlatList, Image, Pressable, StyleProp, Text, View, ViewStyle } from "react-native";

type CardItem = {
    id: string;
    name: string;
    logo: string;
    price?: string;
    desc?: string;
    tag?: string;
};

type HorizontalCardListProps = {
    items: CardItem[];
    style?: StyleProp<ViewStyle>;
};

export default function HorizontalCardList({ items, style }: HorizontalCardListProps) {
    return (
        <FlatList
            className="mb-3"
            data={items}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View className="bg-white rounded-xl w-36 mr-4 shadow-sm pb-6 flex">
                    <Image
                        source={{ uri: item.logo }}
                        className="w-full h-20 rounded-t-xl"
                        resizeMode="cover"
                    />
                    <Text className="text-base font-quicksand-semibold text-center my-2">{item.name}</Text>
                    <Pressable className="bg-blue-100 rounded-full py-1 mx-3 mt-2 absolute bottom-2 left-0 right-0">
                        <Text className="text-white text-xs font-quicksand-semibold text-center">View detail</Text>
                    </Pressable>
                </View>
            )}
            contentContainerStyle={{ paddingLeft: 2, paddingBottom: 4 }}
            style={style}
        />
    );
}
