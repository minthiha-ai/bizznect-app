import { useAuthStore, UserType } from '@/stores/auth-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { router } from 'expo-router'
import React, { createContext, useContext, useEffect } from 'react'

type AuthType = 'user' | 'admin' | 'guest'

interface RegisterPayload {
    name: string
    email?: string
    phone: string
    password: string
    password_confirmation: string
}

interface AuthContextType {
    token: string | null
    user: any
    userType: AuthType | null
    login: (payload: { login: string; password: string; type: AuthType }) => Promise<void>
    logout: () => Promise<void>
    register: (payload: RegisterPayload, type: AuthType) => Promise<void>
    requestOtp: () => Promise<string>
    verifyOtp: (otp: string) => Promise<void>
    refreshUser: () => Promise<void>
    continueAsGuest: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const API = axios.create({
    baseURL: 'https://auth.biznects.info/api',
})

console.log('[AuthContext] Initializing AuthContext...')

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const {
        token,
        user,
        userType,
        setToken,
        setUser,
        setUserType,
        resetAuth,
    } = useAuthStore()

    const setAuthHeader = (t?: string | null) => {
        if (t) {
            API.defaults.headers.common['Authorization'] = `Bearer ${t}`
        } else {
            delete API.defaults.headers.common['Authorization']
        }
    }

    const saveSession = async (t: string, u: any, type: AuthType) => {
        console.log('[AuthContext] Saving session:', { t, u, type })
        setToken(t)
        setUser(u)

        const userTypeValue: UserType = type === 'admin' ? 'admin' : type as UserType
        setUserType(userTypeValue)
        setAuthHeader(t)

        await AsyncStorage.multiSet([
            ['token', t],
            ['user', JSON.stringify(u)],
            ['userType', type],
        ])
        console.log('[AuthContext] AsyncStorage updated for session')
    }

    const clearSession = async () => {
        console.log('[AuthContext] Clearing session...')
        await AsyncStorage.multiRemove(['token', 'user', 'userType'])
        resetAuth()
        setAuthHeader(null)
        console.log('[AuthContext] Session cleared')
    }

    useEffect(() => {
        const loadSession = async () => {
            console.log('[AuthContext] Loading session from AsyncStorage...')
            try {
                const [storedToken, storedUser, storedType] = await Promise.all([
                    AsyncStorage.getItem('token'),
                    AsyncStorage.getItem('user'),
                    AsyncStorage.getItem('userType'),
                ])

                console.log('[AuthContext] Retrieved from storage:', {
                    storedToken,
                    storedUser,
                    storedType,
                })

                if (storedType === 'guest' || storedType === null) {
                    setUserType('guest')
                    setToken(null)
                    setUser(null)
                    await AsyncStorage.multiRemove(['token', 'user'])
                    router.replace('/(tabs)')
                    return
                }

                if (storedToken && storedUser && storedType) {
                    setToken(storedToken)
                    setUser(JSON.parse(storedUser))
                    setUserType(storedType as UserType)
                    setAuthHeader(storedToken)

                    try {
                        const res = await API.get('/user')
                        const refreshedUser = res.data?.data
                        setUser(refreshedUser)
                        await AsyncStorage.setItem('user', JSON.stringify(refreshedUser))
                        console.log('[AuthContext] User refreshed successfully', refreshUser)

                        if (!refreshedUser?.phone_verified_at) {
                            console.log('[AuthContext] Phone not verified — redirecting to OTP')
                            await requestOtp()
                            router.replace({
                                pathname: '/(verify)/phone-number',
                                params: { type: storedType },
                            })
                            return
                        }

                        console.log('[AuthContext] Navigating to tabs')
                        router.replace('/(tabs)')
                    } catch (err) {
                        console.error('[AuthContext] Failed to refresh user:', err)
                        await clearSession()
                        router.replace('/(auth)/sign-in')
                    }
                }
            } catch (err) {
                console.error('[AuthContext] Error loading session:', err)
            }
        }
        loadSession()
    }, [])

    const continueAsGuest = async () => {
        console.log('[AuthContext] Continuing as guest...')
        setToken(null)
        setUser(null)
        setUserType('guest')

        await AsyncStorage.multiRemove(['token', 'user'])
        await AsyncStorage.setItem('userType', 'guest')

        router.replace('/(tabs)')
    }

    const login = async ({ login, password, type }: { login: string; password: string; type: AuthType }) => {
        console.log('[AuthContext] Logging in:', { login, type })
        try {
            const url = type === 'admin' ? '/admin/login' : '/login'
            const res = await API.post(url, { login, password })
            console.log('[AuthContext] Login response:', JSON.stringify(res.data))
            const { token: t, user: u } = type === 'admin' ? res.data.data : res.data

            console.log('[AuthContext] Login successful:', u)
            await saveSession(t, u, type)

            if (!u?.phone_verified_at) {
                console.log('[AuthContext] Phone not verified — redirecting to phone-number screen')
                if (u?.phone) {
                    await AsyncStorage.setItem('pending_phone', String(u.phone))
                }
                await AsyncStorage.setItem('pending_type', type)
                router.replace(`/(verify)/phone-number?type=${type}`)
                return
            }

            console.log('[AuthContext] Navigating to tabs')
            router.replace('/(tabs)')
        } catch (err: any) {
            console.error('[AuthContext] Login error:', err.response?.data || err.message)
            throw err
        }
    }

    const register = async (payload: RegisterPayload, type: AuthType) => {
        console.log('[AuthContext] Registering:', { payload, type })
        const url = type === 'admin' ? '/admin/register' : '/register'
        const res = await API.post(url, payload)
        const { token: t, user: u } = type === 'admin' ? res.data.data : res.data.data.data

        await saveSession(t, u, type)

        if (u?.phone) {
            await AsyncStorage.setItem('pending_phone', String(u.phone))
            await AsyncStorage.setItem('pending_type', type)
            console.log('[AuthContext] Pending phone & type saved')
        }
    }

    const requestOtp = async () => {
        console.log('[AuthContext] Requesting OTP...')
        if (!token) throw new Error('Not authenticated')
        const res = await API.post('/request-otp')
        console.log('[AuthContext] OTP requested:', res.data.message)
        return res.data.message as string
    }

    const verifyOtp = async (otp: string) => {
        console.log('[AuthContext] Verifying OTP...')
        if (!token) throw new Error('Not authenticated')
        await API.post('/verify-otp', { otp })
        console.log('[AuthContext] OTP verified')
        await refreshUser()
        await AsyncStorage.multiRemove(['pending_phone', 'pending_type'])
    }

    const refreshUser = async () => {
        console.log('[AuthContext] Refreshing user...')
        if (!token) throw new Error('No token to refresh user')
        const res = await API.get('/user')
        console.log('[AuthContext] Refreshed user data:', res.data?.data)
        setUser(res.data?.data)
        await AsyncStorage.setItem('user', JSON.stringify(res.data?.data))
    }

    const logout = async () => {
        console.log('[AuthContext] Logging out...')
        try {
            if (token) {
                await API.post('/logout')
                console.log('[AuthContext] Logout request sent')
            }
        } catch (e) {
            console.error('[AuthContext] Logout failed:', e)
        }

        await clearSession()
        router.replace('/(auth)/sign-in')
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                userType,
                login,
                logout,
                register,
                requestOtp,
                verifyOtp,
                refreshUser,
                continueAsGuest
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
