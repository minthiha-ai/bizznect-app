import { useRouter } from "expo-router";
import { Dimensions, FlatList, Image, Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import GlobalStyles from "./GlobalStyles";

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

const screenWidth = Dimensions.get("window").width;
const NUM_VISIBLE = 4; // 4 items visible horizontally
const cardWidth = (screenWidth - 48) / NUM_VISIBLE;

export default function HorizontalCardList({ items, style }: HorizontalCardListProps) {
    const router = useRouter();

    return (
        <FlatList
            className="mb-3"
            data={items}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <Pressable
                    className="bg-white rounded-xl items-center pb-2"
                    style={[
                        GlobalStyles.shadowMd,
                        { width: cardWidth, marginRight: 12, paddingHorizontal: 4, marginBottom: 12 },
                    ]}
                    onPress={() => router.push(`/business/${item.id}`)}
                >
                    {item.logo ? (
                        <Image
                            source={{ uri: item.logo }}
                            style={{
                                width: cardWidth - 20,
                                height: cardWidth * 0.75,
                                borderRadius: 8,
                                marginBottom: 8,
                                marginTop: 8,
                            }}
                            resizeMode="cover"
                        />
                    ) : (
                        <View
                            style={{
                                width: cardWidth - 20,
                                height: cardWidth * 0.75,
                                borderRadius: 8,
                                marginBottom: 8,
                                marginTop: 8,
                                backgroundColor: "#e5e7eb",
                            }}
                        />
                    )}

                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="text-center text-black text-xs font-quicksand-semibold mb-2"
                    >
                        {item.name}
                    </Text>

                    {/* <TouchableOpacity
                        className="bg-[#016FAE] rounded-full px-2 py-1"
                        onPress={() => router.push(`/business/${item.id}`)}
                    >
                        <Text className="text-white text-[10px] font-quicksand-semibold">
                            View detail
                        </Text>
                    </TouchableOpacity> */}
                </Pressable>
            )}
            contentContainerStyle={{ paddingLeft: 2, paddingBottom: 4 }}
            style={style}
        />
    );
}
