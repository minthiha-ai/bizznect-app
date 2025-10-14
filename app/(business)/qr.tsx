import Overlay from '@/components/ui/Overlay';
import { scanQr } from '@/lib/services/businessService';
import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
    Alert,
    AppState,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QRScannerPage() {
    const router = useRouter();
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                qrLock.current = false;
            }
            appState.current = nextAppState;
        });

        return () => subscription.remove();
    }, []);

    const handleQRCodeScanned = async ({ data }: { data: string }) => {
        if (!data || qrLock.current) return;
        qrLock.current = true;

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        setTimeout(async () => {
            try {
                const res = await scanQr({ code: data });
                const businessId = res.data?.data?.id;

                if (businessId) {
                    router.push(`/business/${businessId}`);
                } else {
                    Alert.alert('Invalid QR Code', 'Business not found.');
                    qrLock.current = false;
                }
            } catch (err) {
                Alert.alert('Error', 'Failed to scan business QR.');
                console.error(err);
                qrLock.current = false;
            }
        }, 500);
    };

    return (
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
            <Stack.Screen options={{ title: 'QR Scan', headerShown: false }} />
            {Platform.OS === 'android' && <StatusBar hidden />}

            {/* Back Button */}
            <Pressable
                onPress={() => router.back()}
                style={{
                    position: 'absolute',
                    top: 50,
                    left: 20,
                    zIndex: 10,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    padding: 8,
                    borderRadius: 999,
                }}
            >
                <Ionicons name="chevron-back" size={28} color="white" />
            </Pressable>

            {/* Camera */}
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={handleQRCodeScanned}
            />

            {/* Skia Overlay */}
            <Overlay />
        </SafeAreaView>
    );
}
