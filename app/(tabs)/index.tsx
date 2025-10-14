import CategoryList from "@/components/CategoryList";
import GlobalStyles from "@/components/GlobalStyles";
import HorizontalCardList from "@/components/HorizontalCardList";
import PromoBanner from "@/components/PromoBanner";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import Spinner from "@/components/ui/Spinner";
import { promoBanners } from "@/constants";
import { getTopPage } from "@/lib/services/businessService";
import { Business, useGlobalStore } from "@/stores/global-store";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TopPageSection = {
    [slug: string]: Business[]; // e.g., { ecommerce: [], restaurant: [] }
};

export default function Index() {
    const router = useRouter();

    // Zustand
    const categories = useGlobalStore((state) => state.categories);
    const fetchCategories = useGlobalStore((state) => state.fetchCategories);
    const businesses = useGlobalStore((state) => state.businesses);
    const fetchBusinesses = useGlobalStore((state) => state.fetchBusinesses);

    // Local
    const [topPageData, setTopPageData] = useState<TopPageSection>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchTopPage = async () => {
        try {
            const res = await getTopPage();
            setTopPageData(res.data?.data || {});
        } catch (error) {
            console.error("Failed to fetch top page:", error);
        }
    };

    const loadData = async () => {
        try {
            setIsLoading(true);
            await Promise.all([
                categories.length === 0 ? fetchCategories() : Promise.resolve(),
                fetchTopPage(),
                fetchBusinesses(),
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = async () => {
        try {
            setIsRefreshing(true);
            await Promise.all([fetchCategories(), fetchTopPage(), fetchBusinesses()]);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <SafeAreaView
            className="flex-1 bg-white"
            style={GlobalStyles.droidSafeArea}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        tintColor="#176da6"
                    />
                }
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className="px-2">
                    {/* Search Bar */}
                    <SearchBar />

                    {/* Categories */}
                    <SectionHeader
                        title="Categories"
                        onViewAll={() => router.push("/(category)/categories")}
                    />
                    <CategoryList categories={categories} />

                    {/* Promo Banner */}
                    <PromoBanner banners={promoBanners} />

                    {/* Dynamic sections from topPageData */}
                    {isLoading ? (
                        <View className="items-center justify-center my-8">
                            <Spinner size="small" />
                        </View>
                    ) : (
                        <>
                            {Object.entries(topPageData).map(([slug, bizList]) => {
                                if (!bizList || bizList.length === 0) return null;

                                const title = slug
                                    .replace(/[-_]/g, " ")
                                    .replace(/\b\w/g, (c) => c.toUpperCase());

                                return (
                                    <View key={slug}>
                                        <SectionHeader
                                            title={title}
                                            onViewAll={() => router.push("/(tabs)/businesses")}
                                        />
                                        <HorizontalCardList items={bizList} />
                                    </View>
                                );
                            })}

                            {/* All Businesses */}
                            {/* {businesses.length > 0 && (
                                <View>
                                    <SectionHeader
                                        title="Featured Businesses"
                                        onViewAll={() => router.push("/(tabs)/businesses")}
                                    />
                                    <HorizontalCardList items={businesses} />
                                </View>
                            )}
                            {businesses.length > 0 && (
                                <View>
                                    <SectionHeader
                                        title="Popular Businesses"
                                        onViewAll={() => router.push("/(tabs)/businesses")}
                                    />
                                    <HorizontalCardList items={businesses} />
                                </View>
                            )}
                            {businesses.length > 0 && (
                                <View>
                                    <SectionHeader
                                        title="SME"
                                        onViewAll={() => router.push("/(tabs)/businesses")}
                                    />
                                    <HorizontalCardList items={businesses} />
                                </View>
                            )} */}
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
