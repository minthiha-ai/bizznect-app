import { Canvas, DiffRect, rect, rrect } from '@shopify/react-native-skia';
import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const scanBoxSize = 280;
const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
    rect(
        width / 2 - scanBoxSize / 2,
        height / 2 - scanBoxSize / 2,
        scanBoxSize,
        scanBoxSize
    ),
    30,
    30
);

export default function Overlay() {
    return (
        <Canvas
            style={
                Platform.OS === 'android' ? { flex: 1 } : StyleSheet.absoluteFillObject
            }
        >
            <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
        </Canvas>
    );
}
