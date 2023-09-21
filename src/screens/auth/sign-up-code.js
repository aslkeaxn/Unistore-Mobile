import { Layout, Text } from "@ui-kitten/components";
import ScreenContainer from "../../components/ScreenContainer";
import { useNavigation, useRoute } from "@react-navigation/native";
import Error from "../../constants/error";
import Screen from "../../constants/screen";
import Toast from "react-native-root-toast";
import API from "../../api";
import { useState } from "react";
import LoadingIndicator from "../../components/LoadingIndicator";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function ScreenSignUpCode() {
    return (
        <ScreenContainer padding={15}>
            <HeaderSignUpCode />
            <FormSignUpCode />
        </ScreenContainer>
    );
}

function HeaderSignUpCode() {
    return (
        <Text style={{ fontWeight: "bold", fontSize: 24, fontFamily: "poppins" }}>Sign Up Code</Text>
    );
}

function FormSignUpCode() {
    const route = useRoute();
    const { email } = route.params;

    const [state, setState] = useState({
        verificationCode: "",
        email,
        loading: false,
    });

    return (
        <Layout style={{ gap: 20 }}>
            <FormSignUpCodeInputCode state={state} setState={setState} />
            <FormSignUpCodeButtonVerifyCode state={state} setState={setState} />
        </Layout>
    );
}

function FormSignUpCodeInputCode({ state, setState }) {
    const label = "Verification code";
    const placeholder = "1a2b3c";
    const { verificationCode, loading } = state;

    function onChange(verificationCode) {
        setState((state) => ({ ...state, verificationCode }));
    }

    return (
        <Input
            label={label}
            placeholder={placeholder}
            value={verificationCode}
            onChangeText={onChange}
            disabled={loading}
        />
    );
}

function FormSignUpCodeButtonVerifyCode({ state, setState }) {
    const text = "Submit";
    const { loading } = state;

    const navigation = useNavigation();

    async function verifyCode() {
        try {
            setState((state) => ({ ...state, loading: true }));
            const { verificationCode, email } = state;

            const { error } = await API.Verification.validateVerificationCode(
                verificationCode,
                email
            );

            if (error) {
                Toast.show(error, {
                    duration: Toast.durations.SHORT,
                });

                if (error === Error.ExpiredVerificationCodeError) {
                    navigation.replace(Screen.SignUp);
                }

                return;
            }

            Toast.show("Please sign in", {
                duration: Toast.durations.SHORT,
            });

            navigation.replace(Screen.SignIn);
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
            onPress={verifyCode}
            disabled={loading}
            loading={loading}
        />
    );
}
