import CategoryList from "@/components/CategoryList";
import GlobalStyles from "@/components/GlobalStyles";
import HorizontalCardList from "@/components/HorizontalCardList";
import PromoBanner from "@/components/PromoBanner";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import { promoBanners } from "@/constants";
import { getAllBusinesses, getAllCategories } from "@/lib/services/businessService";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

export default function Index() {
    const [restaurants, setRestaurants] = useState([])
    const [ecommerce, setEcommerce] = useState([])
    const [categories, setCategories] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch businesses
                const bizRes = await getAllBusinesses()
                const allBusinesses = bizRes.data.data
                console.log("All Businesses:", JSON.stringify(allBusinesses))
                const filterBySlug = (slug: string) =>
                    allBusinesses.filter((biz: any) =>
                        biz.categories?.some((cat: any) => cat.slug === slug)
                    )

                setRestaurants(filterBySlug("restaurant"))
                setEcommerce(filterBySlug("e-commerce"))

                // Fetch categories
                const catRes = await getAllCategories()
                setCategories(catRes.data)
            } catch (err) {
                console.error("Error loading data:", err)
            }
        }

        fetchData()
    }, [])

    return (
        <SafeAreaView className="flex-1 bg-[#f6f6f6]" style={GlobalStyles.droidSafeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="px-2 pb-2">
                    {/* Search Bar */}
                    <SearchBar />

                    {/* Category List */}
                    <SectionHeader title="Categories" onViewAll={() => { }} />
                    <CategoryList categories={categories} />

                    {/* Promo Banner */}
                    <PromoBanner banners={promoBanners} />

                    {/* Main Action Buttons */}
                    {/* <ActionButtons /> */}

                    {/* Ecommerce Section */}
                    <SectionHeader title="Ecommerce" onViewAll={() => { }} />
                    <HorizontalCardList items={ecommerce} />

                    {/* Restaurant Section */}
                    <SectionHeader title="Restaurant" onViewAll={() => { }} />
                    <HorizontalCardList items={restaurants} style={{ marginBottom: 16 }} />

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
