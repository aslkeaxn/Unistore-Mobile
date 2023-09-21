import { Button as ButtonRNE } from "@rneui/themed";
import { Button as ButtonMaterial } from "react-native-paper";

export const ButtonType = {
    RNESolid: "RNE",
    MaterialContained: "MaterialContained",
    MaterialText: "MaterialText",
    MaterialOutlined: "MaterialOutlined",
};

export default function Button({
    type = ButtonType.MaterialContained,
    text,
    onPress,
    disabled,
    loading,
    ...props
}) {
    if (type === ButtonType.MaterialText) {
        return (
            <ButtonMaterial
                mode="text"
                onPress={onPress}
                disabled={disabled}
                loading={loading}
                {...props}
            >
                {text}
            </ButtonMaterial>
        );
    }

    if (type === ButtonType.MaterialOutlined) {
        return (
            <ButtonMaterial
                mode="outlined"
                onPress={onPress}
                disabled={disabled}
                loading={loading}
                {...props}
            >
                {text}
            </ButtonMaterial>
        );
    }

    if (type === ButtonType.MaterialContained) {
        return (
            <ButtonMaterial
                mode="contained"
                onPress={onPress}
                disabled={disabled}
                loading={loading}
                style={{ borderRadius: 8 }}
                buttonColor="rgba(97, 79, 224, 1)"
                {...props}
            >
                {text}
            </ButtonMaterial>
        );
    }

    if (type === ButtonType.RNESolid) {
        return (
            <ButtonRNE
                title={text}
                onPress={onPress}
                disabled={disabled}
                loading={loading}
                {...props}
            />
        );
    }
}
