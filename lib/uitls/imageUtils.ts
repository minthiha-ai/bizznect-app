import * as ImageManipulator from 'expo-image-manipulator'
import * as FileSystem from 'expo-file-system'

export const compressAndEncodeImage = async (uri: string): Promise<string | null> => {
    try {
        const manipulated = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 800 } }],
            { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
        )

        const base64 = await FileSystem.readAsStringAsync(manipulated.uri, {
            encoding: FileSystem.EncodingType.Base64,
        })

        return `data:image/jpeg;base64,${base64}`
    } catch (error) {
        console.error('[compressAndEncodeImage] Error:', error)
        return null
    }
}
