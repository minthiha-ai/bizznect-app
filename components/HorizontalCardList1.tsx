import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
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
    style?: ViewStyle;
};

const screenWidth = Dimensions.get("window").width;

// layout constants
const NUM_VISIBLE = 4;              // 4 cards on screen
const SPACING = 12;                 // space between cards
const H_PADDING = SPACING * 2;      // left + right padding of the list

// exact card width so 4 fit perfectly across
const CARD_WIDTH =
    (screenWidth - H_PADDING - (NUM_VISIBLE - 1) * SPACING) / NUM_VISIBLE;

// one “unit” width including the gap after it
const ITEM_FULL = CARD_WIDTH + SPACING;

// how often to advance and how far
const AUTOPLAY_MS = 3000;          // 3s
const STEP = 1;                    // move by 1 card per tick (keep it smooth)

export default function HorizontalCardList({ items, style }: HorizontalCardListProps) {
    const router = useRouter();
    const listRef = useRef<FlatList<CardItem>>(null);

    const [index, setIndex] = useState(0);
    const indexRef = useRef(0);
    indexRef.current = index;

    const maxStartIndex = Math.max(0, items.length - NUM_VISIBLE);

    // jump to a given start index
    const scrollToIndex = (i: number, animated = true) => {
        const clamped = Math.max(0, Math.min(i, maxStartIndex));
        const offset = SPACING + clamped * ITEM_FULL; // include left padding
        listRef.current?.scrollToOffset({ offset, animated });
        setIndex(clamped);
    };

    // auto-play timer
    useEffect(() => {
        if (items.length <= NUM_VISIBLE) return; // nothing to slide
        const id = setInterval(() => {
            const next = indexRef.current + STEP;
            scrollToIndex(next > maxStartIndex ? 0 : next);
        }, AUTOPLAY_MS);
        return () => clearInterval(id);
    }, [items.length, maxStartIndex]);

    // keep index in sync when user scrolls manually
    const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = e.nativeEvent.contentOffset.x;
        // subtract left padding then divide by item width
        const raw = (x - SPACING) / ITEM_FULL;
        const nearest = Math.round(isNaN(raw) ? 0 : raw);
        setIndex(Math.max(0, Math.min(nearest, maxStartIndex)));
    };

    // pause/resume auto-play while user is dragging (prevents “fighting”)
    const pauseRef = useRef<NodeJS.Timeout | null>(null);
    const onScrollBeginDrag = () => {
        if (pauseRef.current) {
            clearTimeout(pauseRef.current);
            pauseRef.current = null;
        }
    };
    const onScrollEndDrag = () => {
        // small debounce so the interval can keep doing its thing afterward
        pauseRef.current = setTimeout(() => {
            pauseRef.current = null;
        }, 250);
    };

    const renderItem = ({ item }: { item: CardItem }) => (
        <Pressable
            className="bg-white rounded-xl items-center pb-2"
            style={[
                GlobalStyles.shadowMd,
                { width: CARD_WIDTH, marginRight: SPACING, paddingHorizontal: 4, marginBottom: 12 },
            ]}
            onPress={() => router.push(`/business/${item.id}`)}
        >
            {item.logo ? (
                <Image
                    source={{ uri: item.logo }}
                    style={{
                        width: "100%",
                        height: CARD_WIDTH * 0.75,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        marginBottom: 8,
                    }}
                    resizeMode="cover"
                />
            ) : (
                <View
                    style={{
                        width: "100%",
                        height: CARD_WIDTH * 0.75,
                        borderRadius: 12,
                        marginBottom: 8,
                        backgroundColor: "#e5e7eb",
                    }}
                />
            )}

            <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-center text-black text-xs font-quicksand-semibold mb-2"
            >
                {item.name || "Unnamed Business"}
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
    );

    return (
        <FlatList
            ref={listRef}
            data={items}
            keyExtractor={(it) => it.id}
            horizontal
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                paddingHorizontal: SPACING, // left+right padding accounted in math
                paddingBottom: 4,
            }}
            style={style}
            // precise metrics so scrollToOffset is accurate on both platforms
            getItemLayout={(_, i) => ({
                length: ITEM_FULL,
                offset: SPACING + i * ITEM_FULL,
                index: i,
            })}
            onMomentumScrollEnd={onMomentumEnd}
            onScrollBeginDrag={onScrollBeginDrag}
            onScrollEndDrag={onScrollEndDrag}
        />
    );
}
