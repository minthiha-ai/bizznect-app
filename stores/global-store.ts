import {
    getAllBusinesses,
    getAllCategories,
    getBusinessDetail,
    searchBusinesses
} from '@/lib/services/businessService'
import { create } from 'zustand'

type Category = {
    id: number
    name: string
    icon: string
    slug?: string
    created_at?: string | null
    updated_at?: string | null
}

type Business = {
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

    // Businesses
    businesses: Business[]
    setBusinesses: (biz: Business[]) => void
    fetchBusinesses: () => Promise<void>
    fetchBusinessDetail: (id: string) => Promise<Business | null>
    searchBusinesses: (params: any) => Promise<Business[]>
}

export const useGlobalStore = create<GlobalStore>((set) => ({
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
            set({ businesses: res.data })
        } catch (err) {
            console.error('Failed to fetch businesses:', err)
        }
    },

    fetchBusinessDetail: async (id) => {
        try {
            const res = await getBusinessDetail(id)
            return res.data
        } catch (err) {
            console.error('Failed to fetch business detail:', err)
            return null
        }
    },

    searchBusinesses: async (params) => {
        try {
            const res = await searchBusinesses(params)
            return res.data
        } catch (err) {
            console.error('Failed to search businesses:', err)
            return []
        }
    }
}))
