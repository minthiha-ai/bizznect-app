import React, { useState } from 'react';
import { Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type DropdownProps = {
    label: string;
    items: { label: string; value: string }[];
    value: string;
    onChangeValue: (val: string) => void;
    placeholder?: string;
    zIndex?: number;
    zIndexInverse?: number;
    searchable?: boolean;
    disabled?: boolean;
};

export default function Dropdown({
    label,
    items,
    value,
    onChangeValue,
    placeholder = 'Select an option',
    zIndex = 1000,
    zIndexInverse = 3000,
    searchable = true,
    disabled = false,
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const [localItems, setLocalItems] = useState(items);

    return (
        <View className="mb-3" style={{ zIndex }}>
            <Text className="mb-2 font-quicksand-semibold text-base text-black">
                {label}
            </Text>
            <DropDownPicker
                open={open}
                value={localValue}
                items={localItems}
                setOpen={setOpen}
                setValue={(callback) => {
                    const selected = callback(localValue);
                    setLocalValue(selected as string);
                    onChangeValue(selected as string);
                }}
                setItems={setLocalItems}
                placeholder={placeholder}
                listMode="SCROLLVIEW"
                searchable={searchable}
                searchPlaceholder="Search..."
                style={{
                    borderColor: '#ccc',
                    borderWidth: 1,
                    borderRadius: 10,
                    minHeight: 42,
                }}
                dropDownContainerStyle={{
                    borderColor: '#ccc',
                    borderRadius: 10,
                }}
                textStyle={{
                    fontSize: 14,
                }}
                zIndex={zIndex}
                zIndexInverse={zIndexInverse}
                disabled={disabled}
            />
        </View>
    );
}
