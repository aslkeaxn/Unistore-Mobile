import { Layout, Text } from "@ui-kitten/components";
import ScreenContainer from "../../components/ScreenContainer";
import { useAuth } from "../../contexts/auth";
import Toast from "react-native-root-toast";
import { useState } from "react";
import API from "../../api/index";
import { useNavigation } from "@react-navigation/native";
import Screen from "../../constants/screen";
import Error from "../../constants/error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../../components/Input";
import Button, { ButtonType } from "../../components/Button";
import STYLES from "../../constants/design";

export default function ScreenSignIn() {
    const [state, setState] = useState({
        email: "",
        password: "",
        loading: false,
    });
    return (
        <ScreenContainer padding={15}>
            <Layout style={STYLES.screenContainer}>
                <HeaderSignIn />
                <FormSignIn
                    style={STYLES.formContainer}
                    state={state}
                    setState={setState}
                />
                <FormSignInButtonSignUpInstead
                    state={state}
                    setState={setState}
                />
            </Layout>
        </ScreenContainer>
    );
}

function HeaderSignIn() {
    return (
        <Text
            style={{ fontWeight: "bold", fontSize: 24, fontFamily: "poppins" }}
        >
            Sign In
        </Text>
    );
}

function FormSignIn({ state, setState }) {
    return (
        <Layout style={STYLES.formContainer}>
            <Layout style={{ gap: 5 }}>
                <FormSignInInputEmail state={state} setState={setState} />
                <FormSignInInputPassword state={state} setState={setState} />
            </Layout>
            <Layout style={{ gap: 5 }}>
                <FormSignInButtonSignIn state={state} setState={setState} />
            </Layout>
            <Layout>
                <FormSignInButtonForgotPassword
                    state={state}
                    setState={setState}
                />
            </Layout>
        </Layout>
    );
}

function FormSignInInputEmail({ state, setState }) {
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

function FormSignInInputPassword({ state, setState }) {
    const label = "Password";
    const placeholder = 'Not "password"';

    const { password, loading } = state;

    function onChange(password) {
        setState((state) => ({ ...state, password }));
    }

    return (
        <Input
            label={label}
            placeholder={placeholder}
            value={password}
            onChangeText={onChange}
            disabled={loading}
            password
        />
    );
}

function FormSignInButtonSignIn({ state, setState }) {
    const text = "Sign In";
    const { loading } = state;

    const { setUser } = useAuth();
    const navigation = useNavigation();

    async function signIn() {
        try {
            setState((state) => ({ ...state, loading: true }));
            const { loading, ...user } = state;

            const { error: signInError, userToken: token } =
                await API.Auth.signIn(user);

            if (signInError) {
                if (signInError === Error.UserUnverifiedError) {
                    return navigation.navigate(Screen.SignUpCode, {
                        email: user.email,
                    });
                }

                return Toast.show(signInError, {
                    duration: Toast.durations.SHORT,
                });
            }

            const { error: meError, user: details } = await API.Auth.me(token);

            if (meError) {
                return Toast.show(meError, { duration: Toast.durations.SHORT });
            }

            const localUser = { details, token };
            setUser(localUser);
            AsyncStorage.setItem("user", JSON.stringify(localUser)).catch(
                (error) => console.error(error)
            );
        } catch (error) {
            Toast.show("Could not sign in, please try later", {
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
            onPress={signIn}
            disabled={loading}
            loading={loading}
        />
    );
}

function FormSignInButtonSignUpInstead({ state }) {
    const text1 = "Don't have an account?";
    const text2 = "Sign up";
    const { loading } = state;

    const navigation = useNavigation();

    function signUpInstead() {
        if (loading) {
            return;
        }

        navigation.navigate(Screen.SignUpChoice);
    }

    return (
        <Layout
            style={{
                flexDirection: "row",
                gap: 2,
                alignSelf: "center",
                paddingLeft: 2,
                paddingBottom: 10,
            }}
        >
            <Text style={{ fontFamily: "poppins" }}>{text1}</Text>
            <Text
                onPress={signUpInstead}
                style={{
                    fontWeight: "bold",
                    color: "rgba(97, 79, 224, 1)",
                    fontFamily: "poppins",
                }}
            >
                {text2}
            </Text>
        </Layout>
    );
}

function FormSignInButtonForgotPassword({ state }) {
    const text = "Forgot Password?";
    const { loading } = state;

    const navigation = useNavigation();

    function forgotPassword() {
        if (loading) {
            return;
        }

        const { email } = state;

        navigation.navigate(Screen.ForgotPasswordEmail, { email });
    }

    return (
        <Layout style={{ flexDirection: "row", gap: 2, alignSelf: "flex-end" }}>
            <Text
                onPress={forgotPassword}
                style={{
                    fontWeight: "bold",
                    color: "rgba(97, 79, 224, 1)",
                    fontFamily: "poppins",
                }}
            >
                {text}
            </Text>
        </Layout>
    );
}
