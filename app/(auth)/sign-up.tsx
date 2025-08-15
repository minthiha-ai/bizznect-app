import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View
} from 'react-native'
import CustomButton from '../../components/CustomButton'
import CustomInput from '../../components/CustomInput'
import { useAuth } from '../../contexts/AuthContext'

type FieldKey =
    | 'userName'
    | 'email'
    | 'phone'
    | 'password'
    | 'confirmPw'
    | 'division'
    | 'township'
    | 'address'

const fieldMeta: Record<FieldKey, any> = {
    userName: { label: 'User Name', required: true, leftIcon: 'user', placeholder: 'Enter your name' },
    email: { label: 'Email', required: true, leftIcon: 'mail', placeholder: 'Enter your email', keyboardType: 'email-address' },
    phone: { label: 'Phone', required: true, leftIcon: 'phone', placeholder: '09xxxxxxxxx', keyboardType: 'phone-pad' },
    password: { label: 'Password', required: true, leftIcon: 'lock', placeholder: 'Enter password', isPassword: true },
    confirmPw: { label: 'Confirm Password', required: true, leftIcon: 'lock', placeholder: 'Re-enter password', isPassword: true },
    division: { label: 'Division', required: true },
    township: { label: 'Township', required: true },
    address: { label: 'Address', required: false, leftIcon: 'map-pin', placeholder: 'Enter address', multiline: true },
}

const steps: FieldKey[][] = [
    ['userName', 'phone', 'email'],
    ['password', 'confirmPw'],
    ['division', 'township', 'address'],
]

const divisionOptions = ['Yangon', 'Mandalay', 'Ayeyarwady']
const townshipOptions = ['Hlaing', 'Thanlyin', 'Insein']

const SignUp: React.FC = () => {
    const { register } = useAuth()
    const [form, setForm] = useState<Record<FieldKey, string>>({
        userName: '',
        email: '',
        phone: '',
        password: '',
        confirmPw: '',
        division: '',
        township: '',
        address: ''
    })
    const [step, setStep] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (name: FieldKey, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const validateStep = (): boolean => {
        const fields = steps[step]
        for (const field of fields) {
            if (fieldMeta[field].required && !form[field]) {
                Alert.alert('Error', `Please enter ${fieldMeta[field].label.toLowerCase()}.`)
                return false
            }
        }
        if (fields.includes('confirmPw') && form.password !== form.confirmPw) {
            Alert.alert('Error', 'Passwords do not match.')
            return false
        }
        return true
    }

    const handleNext = () => {
        if (validateStep()) setStep(prev => prev + 1)
    }

    const handlePrev = () => setStep(prev => prev - 1)

    const handleSignUp = async () => {
        if (!validateStep()) return
        setIsLoading(true)
        try {
            // 1) Register (returns token + user; phone not verified yet)
            await register(
                {
                    name: form.userName,
                    phone: form.phone,
                    email: form.email,
                    password: form.password,
                    password_confirmation: form.confirmPw
                },
                'user'
            )

            // 2) Keep some UI state for verify screens
            await AsyncStorage.multiSet([
                ['pending_phone', form.phone],
                ['pending_type', 'user']
            ])

            // 4) Go to verify screen with type
            router.replace('/(verify)/phone-number?type=user')
        } catch (error: any) {
            Alert.alert('Error', error?.response?.data?.message || error.message || 'Sign-up failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const renderPicker = (field: 'division' | 'township', options: string[]) => (
        <Pressable
            key={`picker-${field}`}
            className="border-b-2 border-gray-200 px-0 py-3 bg-white text-base mb-6 flex-row items-center justify-between"
            onPress={() => {
                const idx = options.indexOf(form[field])
                const nextValue = options[(idx + 1) % options.length] || options[0]
                handleChange(field, nextValue)
            }}
        >
            <Text className={`text-base ${form[field] ? 'text-black' : 'text-gray-400'}`}>
                {form[field] || `Select ${field}`}
            </Text>
            <Feather name="chevron-down" size={20} color="#bbb" />
        </Pressable>
    )

    const renderStep = () => {
        const fields = steps[step]
        return fields.map(field => {
            const key = `${step}-${field}`
            if (field === 'division') return <View key={key}>{renderPicker('division', divisionOptions)}</View>
            if (field === 'township') return <View key={key}>{renderPicker('township', townshipOptions)}</View>
            return (
                <CustomInput
                    key={key}
                    {...fieldMeta[field]}
                    value={form[field]}
                    onChangeText={val => handleChange(field, val)}
                    inputClassName="text-base"
                    containerClassName="mb-6"
                    autoCapitalize={field === 'email' ? 'none' : undefined}
                    autoCorrect={field === 'email' ? false : undefined}
                />
            )
        })
    }

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
            >
                <Text className="text-center text-2xl font-quicksand-bold text-[#176da6] my-8">Sign Up</Text>

                {renderStep()}

                <View className="flex-row justify-between mt-3">
                    <CustomButton
                        type="secondary"
                        title="Prev"
                        icon="arrow-left"
                        iconPosition="left"
                        onPress={handlePrev}
                        disabled={step === 0 || isLoading}
                        containerClassName="flex-1 mr-2"
                    />
                    {step < steps.length - 1 ? (
                        <CustomButton
                            type="primary"
                            title="Next"
                            icon="arrow-right"
                            iconPosition="right"
                            onPress={handleNext}
                            disabled={isLoading}
                            containerClassName="flex-1 ml-2"
                        />
                    ) : (
                        <CustomButton
                            type="primary"
                            title="Sign Up"
                            icon="user-plus"
                            iconPosition="right"
                            isLoading={isLoading}
                            disabled={isLoading}
                            onPress={handleSignUp}
                            containerClassName="flex-1 ml-2"
                        />
                    )}
                </View>

                <View className="flex-row items-center my-6">
                    <View className="flex-1 h-px bg-gray-200/60" />
                    <Text className="mx-2 text-gray-400 text-sm">Or continue as</Text>
                    <View className="flex-1 h-px bg-gray-200/60" />
                </View>

                <CustomButton
                    type="secondary"
                    title="Sign Up as Business Owner"
                    secondaryText="For business account holders only"
                    onPress={() => router.push('/(auth)/business-sign-up')}
                />

                <View className="flex-row justify-center mt-6">
                    <Text className="text-base text-gray-700">Already have an account? </Text>
                    <CustomButton
                        type="text"
                        title="Sign In"
                        onPress={() => router.push('/(auth)/sign-in')}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default SignUp
