import { useState } from "react";
import { TextInput as InputMaterial } from "react-native-paper";

export const InputType = {
    MaterialFlatWhite: "MaterialFlatWhite",
    MaterialOutlined: "MaterialOutlined",
};

export const InputMode = {
    Email: "email",
    Numeric: "numeric",
};

export default function Input({
    type = InputType.MaterialFlatWhite,
    label,
    placeholder,
    value,
    onChangeText,
    disabled,
    email,
    numeric,
    password,
    returnKeyType,
    ...props
}) {
    let inputMode, secureTextEntry;

    if (email) {
        inputMode = InputMode.Email;
    }

    if (numeric) {
        inputMode = InputMode.Numeric;
        returnKeyType = "done";
    }

    if (password) {
        secureTextEntry = true;
    }

    const [passwordVisibility, setPasswordVisibility] = useState(secureTextEntry ? false : true);

    if (type === InputType.MaterialFlatWhite) {
        if (password) {
            return (
                <InputMaterial
                    mode="flat"
                    {...props}
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    disabled={disabled}
                    style={{ backgroundColor: "white" }}
                    inputMode={inputMode}
                    secureTextEntry={!passwordVisibility}
                    right={(passwordVisibility) ? <InputMaterial.Icon icon="eye" onPress={() => { setPasswordVisibility(!passwordVisibility); }} /> : <InputMaterial.Icon icon="eye-off" onPress={() => { setPasswordVisibility(!passwordVisibility); }} />}
                    returnKeyType={returnKeyType}
                />
            );
        }
        return (
            <InputMaterial
                mode="flat"
                {...props}
                label={label}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                disabled={disabled}
                style={{ backgroundColor: "white" }}
                inputMode={inputMode}
                secureTextEntry={secureTextEntry}
                returnKeyType={returnKeyType}
            />
        );
    }



    if (type === InputType.MaterialOutlined) {
        if (password) {
            <InputMaterial
                mode="outlined"
                {...props}
                label={label}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                disabled={disabled}
                inputMode={inputMode}
                secureTextEntry={!passwordVisibility}
                right={(passwordVisibility) ? <InputMaterial.Icon icon="eye" onPress={() => { setPasswordVisibility(!passwordVisibility); }} /> : <InputMaterial.Icon icon="eye-off" onPress={() => { setPasswordVisibility(!passwordVisibility); }} />}
                returnKeyType={returnKeyType}
            />;
        }
        return (
            <InputMaterial
                mode="outlined"
                {...props}
                label={label}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                disabled={disabled}
                inputMode={inputMode}
                secureTextEntry={secureTextEntry}
                returnKeyType={returnKeyType}
            />
        );
    }
}
