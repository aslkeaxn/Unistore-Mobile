import { useState } from "react";
import ScreenContainer from "../../components/ScreenContainer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Layout, Text } from "@ui-kitten/components";
import API from "../../api";
import Error from "../../constants/error";
import Screen from "../../constants/screen";
import Toast from "react-native-root-toast";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function ScreenForgotPasswordCode() {
    return (
        <ScreenContainer padding={15}>
            <HeaderForgotPasswordCode />
            <FormForgotPasswordCode />
        </ScreenContainer>
    );
}

function HeaderForgotPasswordCode() {
    return (
        <Text style={{ fontWeight: "bold", fontSize: 24, fontFamily: "poppins" }}>
            Reset Password Code
        </Text>
    );
}

function FormForgotPasswordCode() {
    const route = useRoute();
    const { email } = route.params;

    const [state, setState] = useState({
        passwordResetCode: "",
        email,
        loading: false,
    });

    return (
        <Layout style={{ gap: 20 }}>
            <FormForgotPasswordCodeInputCode
                state={state}
                setState={setState}
            />
            <FormForgotPasswordCodeButtonVerifyCode
                state={state}
                setState={setState}
            />
        </Layout>
    );
}

function FormForgotPasswordCodeInputCode({ state, setState }) {
    const label = "Password reset code";
    const placeholder = "1a2b3c";
    const { passwordResetCode, loading } = state;

    function onChange(passwordResetCode) {
        setState((state) => ({ ...state, passwordResetCode }));
    }

    return (
        <Input
            label={label}
            placeholder={placeholder}
            value={passwordResetCode}
            onChangeText={onChange}
            disabled={loading}
        />
    );
}

function FormForgotPasswordCodeButtonVerifyCode({ state, setState }) {
    const text = "Submit";
    const { loading } = state;

    const navigation = useNavigation();

    async function validatePasswordResetCode() {
        try {
            setState((state) => ({ ...state, loading: true }));
            const { email, passwordResetCode } = state;

            const { error, passwordResetToken } =
                await API.Verification.validatePasswordResetCode(
                    passwordResetCode,
                    email
                );

            if (error) {
                Toast.show(error, { duration: Toast.durations.SHORT });

                if (error === Error.ExpiredPasswordResetCodeError) {
                    navigation.replace(Screen.SignIn);
                }

                return;
            }

            navigation.replace(Screen.ForgotPasswordReset, {
                passwordResetToken,
            });
        } catch (error) {
            Toast.show("Could not verify code, please try later", {
                duration: Toast.durations.SHORT,
            });
            console.error(error);
        } finally {
            setState((state) => ({ ...state, loading: false }));
        }
    }

    return (
        <Button
            text={text}
            onPress={validatePasswordResetCode}
            disabled={loading}
            loading={loading}
        />
    );
}
