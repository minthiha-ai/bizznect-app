import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

export type UserType = 'user' | 'admin' | 'guest'

interface BaseUser {
    id: number
    name: string
    email: string
    phone?: string
    is_admin: boolean
}

interface NormalUser extends BaseUser {
    sr_code?: string
    d_code?: string
    ts_code?: string
    postal_code?: string
    city?: string
    address?: string
    type_id: number
    active: boolean
}

interface BusinessAdmin extends BaseUser {
    otp?: string
    otp_expires_at?: string
    otp_attempts?: number
    last_otp_requested_at?: string
}

type User = NormalUser | BusinessAdmin

interface AuthStore {
    token: string | null
    user: User | null
    userType: UserType | null
    isLoading: boolean

    setAuth: (token: string, user: User, userType: UserType) => Promise<void>
    logout: () => Promise<void>
    loadSession: () => Promise<void>

    // ➕ Add these for context usage
    setToken: (token: string | null) => void
    setUser: (user: User | null) => void
    setUserType: (userType: UserType | null) => void
    resetAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    token: null,
    user: null,
    userType: null,
    isLoading: true,

    setAuth: async (token, user, userType) => {
        await AsyncStorage.setItem('token', token)
        await AsyncStorage.setItem('user', JSON.stringify(user))
        await AsyncStorage.setItem('userType', userType)
        set({ token, user, userType })
    },

    logout: async () => {
        await AsyncStorage.multiRemove(['token', 'user', 'userType'])
        set({ token: null, user: null, userType: null })
    },

    loadSession: async () => {
        try {
            const [token, user, userType] = await Promise.all([
                AsyncStorage.getItem('token'),
                AsyncStorage.getItem('user'),
                AsyncStorage.getItem('userType')
            ])
            set({
                token,
                user: user ? JSON.parse(user) : null,
                userType: userType as UserType,
                isLoading: false
            })
        } catch (e) {
            console.error('Failed to load auth session', e)
            set({ isLoading: false })
        }
    },

    setToken: (token) => set({ token }),
    setUser: (user) => set({ user }),
    setUserType: (userType) => set({ userType }),
    resetAuth: () => set({ token: null, user: null, userType: null })
}))
