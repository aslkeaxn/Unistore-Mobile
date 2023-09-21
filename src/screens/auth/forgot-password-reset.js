import { Layout, Text } from "@ui-kitten/components";
import ScreenContainer from "../../components/ScreenContainer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import Toast from "react-native-root-toast";
import API from "../../api";
import Screen from "../../constants/screen";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function ScreenForgotPasswordReset() {
    return (
        <ScreenContainer padding={15}>
            <HeaderForgotPasswordReset />
            <FormForgotPasswordReset />
        </ScreenContainer>
    );
}

function HeaderForgotPasswordReset() {
    return (
        <Text style={{ fontWeight: "bold", fontSize: 24, fontFamily: "poppins" }}>
            Reset Password Code
        </Text>
    );
}

function FormForgotPasswordReset() {
    const route = useRoute();
    const { passwordResetToken } = route.params;

    const [state, setState] = useState({
        password1: "",
        password2: "",
        passwordResetToken,
        loading: false,
    });

    return (
        <Layout style={{ gap: 20 }}>
            <Layout style={{ gap: 5 }}>
                <FormForgotPasswordResetInputPassword1
                    state={state}
                    setState={setState}
                />
                <FormForgotPasswordResetInputPassword2
                    state={state}
                    setState={setState}
                />
            </Layout>
            <FormForgotPasswordResetButtonSave
                state={state}
                setState={setState}
            />
        </Layout>
    );
}

function FormForgotPasswordResetInputPassword1({ state, setState }) {
    const label = "New password";
    const placeholder = 'Not "password"';
    const { password1, loading } = state;

    function onChange(password1) {
        setState((state) => ({ ...state, password1 }));
    }

    return (
        <Input
            label={label}
            placeholder={placeholder}
            value={password1}
            onChangeText={onChange}
            disabled={loading}
            password
        />
    );
}

function FormForgotPasswordResetInputPassword2({ state, setState }) {
    const label = "Confirm password";
    const placeholder = "Whatever you wrote above";
    const { password2, loading } = state;

    function onChange(password2) {
        setState((state) => ({ ...state, password2 }));
    }

    return (
        <Input
            label={label}
            placeholder={placeholder}
            value={password2}
            onChangeText={onChange}
            disabled={loading}
            password
        />
    );
}

function FormForgotPasswordResetButtonSave({ state, setState }) {
    const text = "Save new password";
    const { loading } = state;

    const navigation = useNavigation();

    async function resetPassword() {
        try {
            setState((state) => ({ ...state, loading: true }));
            const { passwordResetToken, password1, password2 } = state;

            if (password1 !== password2) {
                return Toast.show("The passwords do not match", {
                    duration: Toast.durations.SHORT,
                });
            }

            const { error } = await API.User.resetPassword(
                passwordResetToken,
                password1
            );

            if (error) {
                return Toast.show(error, { duration: Toast.durations.SHORT });
            }

            Toast.show("Password successfully reset", {
                duration: Toast.durations.SHORT,
            });

            navigation.replace(Screen.SignIn);
        } catch (error) {
            Toast.show("Could not reset password, please try later", {
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
            onPress={resetPassword}
            disabled={loading}
            loading={loading}
        />
    );
}
