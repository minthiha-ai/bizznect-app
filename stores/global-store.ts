import {
    getAllBusinesses,
    getAllCategories,
    getBusinessDetail,
    searchBusinesses,
} from '@/lib/services/businessService'
import { create } from 'zustand'

export type Category = {
    id: string
    name: string
    icon: string
    slug?: string
    created_at?: string | null
    updated_at?: string | null
}

export type Business = {
    id: string
    admin_id: number
    name: string
    ts_code: string
    lat: string
    lng: string
    description: string
    phone: string
    email: string
    address: string
    website: string
    logo: string
    qrCode: string
    status: string
    created_at: string
    updated_at: string
    categories: Category[]
}

type GlobalStore = {
    // Categories
    categories: Category[]
    setCategories: (cats: Category[]) => void
    fetchCategories: () => Promise<void>

    // Business list
    businesses: Business[]
    setBusinesses: (biz: Business[]) => void
    fetchBusinesses: () => Promise<void>
    filteredBusinesses: (slug: string) => Business[]
    searchBusinesses: (params: any) => Promise<Business[]>

    // Business detail
    businessDetail: Business | null
    setBusinessDetail: (biz: Business) => void
    fetchBusinessDetail: (id: string) => Promise<void>
    getBusinessesByOwner: (adminId: number) => Business[]
}

export const useGlobalStore = create<GlobalStore>((set, get) => ({
    // Categories
    categories: [],
    setCategories: (cats) => set({ categories: cats }),

    fetchCategories: async () => {
        try {
            const res = await getAllCategories()
            set({ categories: res.data })
        } catch (err) {
            console.error('Failed to fetch categories:', err)
        }
    },

    // Businesses
    businesses: [],
    setBusinesses: (biz) => set({ businesses: biz }),

    fetchBusinesses: async () => {
        try {
            const res = await getAllBusinesses()
            set({ businesses: res.data.data })
        } catch (err) {
            console.error('Failed to fetch businesses:', err)
        }
    },

    filteredBusinesses: (slug: string) => {
        const businesses = get().businesses
        return businesses.filter((biz) =>
            biz.categories?.some((cat) => cat.slug === slug)
        )
    },

    searchBusinesses: async (params) => {
        try {
            const res = await searchBusinesses(params)
            return res.data
        } catch (err) {
            console.error('Failed to search businesses:', err)
            return []
        }
    },

    // Business Detail
    businessDetail: null,

    setBusinessDetail: (biz) => {
        set({ businessDetail: biz })
    },

    fetchBusinessDetail: async (id) => {
        try {
            const res = await getBusinessDetail(id)
            console.log('Fetched business detail:', res.data)
            set({ businessDetail: res.data })
        } catch (err) {
            console.error('Failed to fetch business detail:', err)
        }
    },

    getBusinessesByOwner: (adminId) => {
        return get().businesses.filter((biz) => biz.admin_id === adminId)
    },
}))
