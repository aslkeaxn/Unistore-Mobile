import { Layout, Text } from "@ui-kitten/components";
import ScreenContainer from "../../components/ScreenContainer";
import { useNavigation, useRoute } from "@react-navigation/native";
import API from "../../api";
import Error from "../../constants/error";
import Screen from "../../constants/screen";
import Toast from "react-native-root-toast";
import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function ScreenForgotPasswordEmail() {
    return (
        <ScreenContainer padding={15}>
            <HeaderForgotPasswordEmail />
            <Layout style={{ flex: 1, justifyContent: "center" }}>
                <FormForgotPasswordEmail />
            </Layout>
        </ScreenContainer>
    );
}

function HeaderForgotPasswordEmail() {
    return (
        <Text
            style={{ fontWeight: "bold", fontSize: 24, fontFamily: "poppins" }}
        >
            Reset Password
        </Text>
    );
}

function FormForgotPasswordEmail() {
    const route = useRoute();
    const { email } = route.params;

    const [state, setState] = useState({ email, loading: false });

    return (
        <Layout style={{ gap: 20 }}>
            <FormForgotPasswordEmailInputEmail
                state={state}
                setState={setState}
            />
            <FormForgotPasswordEmailButtonSendEmail
                state={state}
                setState={setState}
            />
        </Layout>
    );
}

function FormForgotPasswordEmailInputEmail({ state, setState }) {
    const label = "Email";
    const placeholder = "student@qu.edu.qa";
    const { email, loading } = state;

    function onChange(email) {
        setState((state) => ({ ...state, email }));
    }

    return (
        <Input
            label={label}
            placeholder={placeholder}
            value={email}
            onChangeText={onChange}
            disabled={loading}
            email
        />
    );
}

function FormForgotPasswordEmailButtonSendEmail({ state, setState }) {
    const text = "Submit";
    const { loading } = state;

    const navigation = useNavigation();

    async function requestPasswordReset() {
        try {
            setState((state) => ({ ...state, loading: true }));
            const { email } = state;

            const { error } = await API.Verification.requestPasswordReset(
                email
            );

            if (error && error !== Error.VerificationCodeError) {
                return Toast.show(error, { duration: Toast.durations.SHORT });
            }

            navigation.replace(Screen.ForgotPasswordCode, { email });
        } catch (error) {
            Toast.show("Could not start the process, please try later", {
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
            onPress={requestPasswordReset}
            disabled={loading}
            loading={loading}
        />
    );
}
