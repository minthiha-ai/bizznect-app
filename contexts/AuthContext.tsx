import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { router } from 'expo-router'
import React, { createContext, useContext, useEffect, useState } from 'react'

type AuthType = 'user' | 'admin'

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
    userType: AuthType
    login: (payload: { login: string; password: string; type: AuthType }) => Promise<void>
    logout: () => Promise<void>
    register: (payload: RegisterPayload, type: AuthType) => Promise<void>
    requestOtp: () => Promise<string>
    verifyOtp: (otp: string) => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const API = axios.create({
    baseURL: 'https://auth.biznects.info/api',
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<any>(null)
    const [userType, setUserType] = useState<AuthType>('user')

    const setAuthHeader = (t?: string | null) => {
        if (t) {
            API.defaults.headers.common['Authorization'] = `Bearer ${t}`
        } else {
            delete API.defaults.headers.common['Authorization']
        }
    }

    const saveSession = async (t: string, u: any, type: AuthType) => {
        if (__DEV__) {
            console.log('[AuthContext] Saving session...')
        }
        setToken(t)
        setUser(u)
        setUserType(type)
        setAuthHeader(t)
        await AsyncStorage.multiSet([
            ['token', t],
            ['user', JSON.stringify(u)],
            ['userType', type],
        ])
    }

    const clearSession = async () => {
        if (__DEV__) console.log('[AuthContext] Clearing session...')
        await AsyncStorage.multiRemove(['token', 'user', 'userType'])
        setToken(null)
        setUser(null)
        setUserType('user')
        setAuthHeader(null)
    }

    useEffect(() => {
        const loadSession = async () => {
            try {
                const [storedToken, storedUser, storedType] = await Promise.all([
                    AsyncStorage.getItem('token'),
                    AsyncStorage.getItem('user'),
                    AsyncStorage.getItem('userType'),
                ])

                if (__DEV__) {
                    console.log('[AuthContext] Loaded token:', storedToken)
                    console.log('[AuthContext] Loaded userType:', storedType)
                }

                if (storedToken && storedUser && storedType) {
                    setToken(storedToken)
                    setUser(JSON.parse(storedUser))
                    setUserType(storedType as AuthType)
                    setAuthHeader(storedToken)

                    console.log('[AuthContext] Refreshing user info...')
                    try {
                        const res = await API.get('/user')
                        const refreshedUser = res.data?.data
                        setUser(refreshedUser)
                        await AsyncStorage.setItem('user', JSON.stringify(refreshedUser))

                        if (!refreshedUser?.phone_verified_at) {
                            await requestOtp()
                            router.replace({
                                pathname: '/(verify)/verify-code',
                                params: { type: storedType },
                            })
                            return
                        }

                        console.log('[AuthContext] Verified user. Redirecting to /tabs')
                        router.replace('/(tabs)')
                    } catch (error) {
                        console.error('[AuthContext] Failed to refresh user:', error)
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

    const login = async ({ login, password, type }: { login: string; password: string; type: AuthType }) => {
        try {
            console.log('[AuthContext] Attempting login:', { login, type })
            const url = type === 'admin' ? '/admin/login' : '/login'
            const res = await API.post(url, { login, password })
            const { token: t, user: u } = type === 'admin' ? res.data.data : res.data

            await saveSession(t, u, type)

            if (!u?.phone_verified_at) {
                console.log('[AuthContext] Phone not verified. Requesting OTP...')
                if (u?.phone) {
                    await AsyncStorage.setItem('pending_phone', String(u.phone))
                }
                await AsyncStorage.setItem('pending_type', type)
                router.replace(`/(verify)/phone-number?type=${type}`)
                return
            }

            console.log('[AuthContext] Login successful. Redirecting to /tabs')
            router.replace('/(tabs)')
        } catch (err: any) {
            console.error('[AuthContext] Login failed:', err?.response?.data || err.message)
            throw err
        }
    }

    const register = async (payload: RegisterPayload, type: AuthType) => {
        try {
            console.log('[AuthContext] Registering:', payload, 'Type:', type)
            const url = type === 'admin' ? '/admin/register' : '/register'
            const res = await API.post(url, payload)
            const { token: t, user: u } = type === 'admin' ? res.data.data : res.data.data.data

            await saveSession(t, u, type)

            if (u?.phone) {
                await AsyncStorage.setItem('pending_phone', String(u.phone))
                await AsyncStorage.setItem('pending_type', type)
            }

            console.log('[AuthContext] Registration successful. Waiting for OTP verification...')
        } catch (err: any) {
            console.error('[AuthContext] Register failed:', err?.response?.data || err.message)
            throw err
        }
    }

    const requestOtp = async () => {
        try {
            if (!token) throw new Error('Not authenticated')
            console.log('[AuthContext] Requesting OTP...')
            const res = await API.post('/request-otp')
            return res.data.message as string
        } catch (err: any) {
            console.error('[AuthContext] OTP request failed:', err?.response?.data || err.message)
            throw err
        }
    }

    const verifyOtp = async (otp: string) => {
        try {
            if (!token) throw new Error('Not authenticated')
            console.log('[AuthContext] Verifying OTP...')
            await API.post('/verify-otp', { otp })
            console.log('[AuthContext] OTP verification successful. Refreshing user...')
            await refreshUser()
            await AsyncStorage.multiRemove(['pending_phone', 'pending_type'])
        } catch (err: any) {
            console.error('[AuthContext] OTP verification failed:', err?.response?.data || err.message)
            throw err
        }
    }

    const refreshUser = async () => {
        try {
            if (!token) throw new Error('No token to refresh user')
            console.log('[AuthContext] Refreshing user profile...')
            const res = await API.get('/user')
            setUser(res.data?.data)
            await AsyncStorage.setItem('user', JSON.stringify(res.data?.data))
        } catch (err: any) {
            console.error('[AuthContext] Failed to fetch user:', err?.response?.data || err.message)
            throw err
        }
    }

    const logout = async () => {
        try {
            console.log('[AuthContext] Logging out...')
            if (token) {
                await API.post('/logout')
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
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
