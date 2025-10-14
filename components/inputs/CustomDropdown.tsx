import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
} from "react-native";

type Item = { label: string; value: string };

type CustomDropdownProps = {
    label: string;
    items: Item[];
    value: string | null;
    onChange: (val: string) => void;
    placeholder?: string;
    disabled?: boolean;
};

export default function CustomDropdown({
    label,
    items,
    value,
    onChange,
    placeholder = "Select an option",
    disabled = false,
}: CustomDropdownProps) {
    const [open, setOpen] = useState(false);

    const selectedLabel = items.find((i) => i.value === value)?.label;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                style={[styles.button, disabled && styles.disabled]}
                onPress={() => !disabled && setOpen(true)}
                activeOpacity={0.7}
            >
                <Text style={styles.valueText}>
                    {selectedLabel || placeholder}
                </Text>
            </TouchableOpacity>

            <Modal visible={open} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.backdrop}
                    onPress={() => setOpen(false)}
                    activeOpacity={1}
                >
                    <View style={styles.dropdown}>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.item}
                                    onPress={() => {
                                        onChange(item.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Text style={styles.itemText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },
    button: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    disabled: {
        opacity: 0.5,
    },
    valueText: {
        fontSize: 14,
        color: "#333",
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    dropdown: {
        backgroundColor: "#fff",
        borderRadius: 8,
        maxHeight: 300,
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    itemText: {
        fontSize: 14,
        color: "#000",
    },
});
