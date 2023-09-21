import { Layout, Text } from "@ui-kitten/components";
import ScreenContainer from "../../components/ScreenContainer";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect } from "react";
import API from "../../api";
import Error from "../../constants/error";
import Screen from "../../constants/screen";
import Toast from "react-native-root-toast";
import LoadingIndicator from "../../components/LoadingIndicator";
import ModeType from "../../constants/mode-type";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function ScreenSignUp() {
    return (
        <ScreenContainer padding={15}>
            <HeaderSignUp />
            <FormSignUp />
        </ScreenContainer>
    );
}

function HeaderSignUp() {
    const route = useRoute();
    const { user } = route.params;
    const text = user ? "Edit Details" : "Sign Up";

    return <Text style={{ fontWeight: "bold", fontSize: 24, fontFamily: "poppins" }}>{text}</Text>;
}

function FormSignUp() {
    const route = useRoute();
    const { type, user, token } = route.params;

    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
        type,
        loading: false,
        mode: ModeType.Add,
    });

    const navigation = useNavigation();

    async function getUserDetails() {
        try {
            setState((state) => ({ ...state, loading: true }));

            const { user, error } = await API.User.getUser(token);

            if (error) {
                Toast.show("Could load user details, try later");
                return navigation.goBack();
            }

            const { firstName, lastName, username, email, phoneNumber } = user;

            const newState = {
                firstName,
                lastName,
                username,
                email,
                phoneNumber,
                type,
                mode: ModeType.Edit,
            };

            setState((state) => ({ ...state, ...newState }));
        } catch (error) {
            console.error(error);
            Toast.show("Could load user details, try later");
            navigation.goBack();
        } finally {
            setState((state) => ({ ...state, loading: false }));
        }
    }

    useEffect(() => {
        if (!user && !token) {
            return;
        }

        getUserDetails();
    }, []);

    return (
        <Layout style={{ gap: 20 }}>
            <Layout style={{ gap: 5 }}>
                <FormSignUpInputFirstName state={state} setState={setState} />
                <FormSignUpInputLastName state={state} setState={setState} />
                <FormSignUpInputUsername state={state} setState={setState} />
                <FormSignUpInputEmail state={state} setState={setState} />
                {!user && (
                    <FormSignUpInputPassword
                        state={state}
                        setState={setState}
                    />
                )}
                <FormSignUpInputPhoneNumber state={state} setState={setState} />
            </Layout>
            {state.mode === ModeType.Add && (
                <FormSignUpButtonSignUp state={state} setState={setState} />
            )}
            {state.mode === ModeType.Edit && (
                <FormEditButton state={state} setState={setState} />
            )}
        </Layout>
    );
}

function FormSignUpInputFirstName({ state, setState }) {
    const label = "First name";
    const placeholder = "John";
    const { firstName, loading } = state;

    function onChange(firstName) {
        setState((state) => ({ ...state, firstName }));
    }

    return (
        <Input
            label={label}
            placeholder={placeholder}
            value={firstName}
            onChangeText={onChange}
            disabled={loading}
        />
    );
}

function FormSignUpInputLastName({ state, setState }) {
    const label = "Last name";
    const placeholder = "Doe";
    const { lastName, loading } = state;

    function onChange(lastName) {
        setState((state) => ({ ...state, lastName }));
    }

    return (
        <Input
            label={label}
            placeholder={placeholder}
            value={lastName}
            onChangeText={onChange}
            disabled={loading}
        />
    );
}

function FormSignUpInputUsername({ state, setState }) {
    const label = "Username";
    const placeholder = "very_cool_student";
    const { username, loading } = state;

    function onChange(username) {
        setState((state) => ({ ...state, username }));
    }

    return (
        <Input
            label={label}
            placeholder={placeholder}
            value={username}
            onChangeText={onChange}
            disabled={loading}
        />
    );
}

function FormSignUpInputEmail({ state, setState }) {
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

function FormSignUpInputPassword({ state, setState }) {
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

function FormSignUpInputPhoneNumber({ state, setState }) {
    const label = "Phone number";
    const placeholder = "55555555";
    const { phoneNumber, loading } = state;

    function onChange(phoneNumber) {
        setState((state) => ({ ...state, phoneNumber }));
    }

    return (
        <Input
            label={label}
            placeholder={placeholder}
            value={phoneNumber}
            onChangeText={onChange}
            disabled={loading}
            numeric
        />
    );
}

function FormSignUpButtonSignUp({ state, setState }) {
    const text = "Sign Up";
    const { loading } = state;

    const navigation = useNavigation();

    async function signUp() {
        try {
            setState((state) => ({ ...state, loading: true }));
            const { loading, mode, ...user } = state;

            const { error } = await API.User.createUser(user);

            if (error && error !== Error.VerificationCodeError) {
                return Toast.show(error, {
                    duration: Toast.durations.SHORT,
                });
            }

            navigation.replace(Screen.SignUpCode, { email: user.email });
        } catch (error) {
            Toast.show("Could not sign in, please try later", {
                duration: Toast.durations.SHORT,
            });
        } finally {
            setState((state) => ({ ...state, loading: false }));
        }
    }

    return (
        <Button
            text={text}
            onPress={signUp}
            disabled={loading}
            loading={loading}
        />
    );
}

function FormEditButton({ state, setState }) {
    const text = "Save";
    const { loading } = state;

    const route = useRoute();
    const userToken = route.params.token;
    const navigation = useNavigation();

    async function edit() {
        try {
            setState((state) => ({ ...state, loading: true }));
            const { loading, mode, password, ...user } = state;

            const { error } = await API.User.updateUser(userToken, user);

            if (error) {
                return Toast.show(error, {
                    duration: Toast.durations.SHORT,
                });
            }
            navigation.goBack();
        } catch (error) {
            Toast.show("Could not edit details, please try later", {
                duration: Toast.durations.SHORT,
            });
        } finally {
            setState((state) => ({ ...state, loading: false }));
        }
    }

    return (
        <Button
            text={text}
            onPress={edit}
            disabled={loading}
            loading={loading}
        />
    );
}
