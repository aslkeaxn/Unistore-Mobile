import { useNavigation, useRoute } from "@react-navigation/native";
import { Layout, Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import API from "../../api";
import ScreenContainer from "../../components/ScreenContainer";
import SingleImagePicker from "../../components/SingleImagePicker";
import { useAuth } from "../../contexts/auth";
import { useQueryClient } from "@tanstack/react-query";
import LoadingIndicator from "../../components/LoadingIndicator";
import Toast from "react-native-root-toast";
import Query from "../../constants/query";
import StoreType from "../../constants/store-type";
import { useStore } from "../../contexts/store";
import STYLES from "../../constants/design";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Platform } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function ScreenStoreForm() {
    return (
        <ScreenContainer>
            <HeaderStoreForm></HeaderStoreForm>
            <FormStore></FormStore>
        </ScreenContainer>
    );
}

function HeaderStoreForm() {
    const navigation = useNavigation();
    return (
        <Layout style={{ flexDirection: "row", alignItems: "baseline", paddingHorizontal: 5 }}>
            <Feather
                name="chevron-left"
                size={20}
                color="black"
                onPress={() => { navigation.goBack(); }} />
            <Text style={STYLES.screen_header}>Small Business Form</Text>
        </Layout>);
}

function FormStore() {
    const route = useRoute();
    const { type, storeId } = route.params;

    const [state, setState] = useState({
        name: "",
        description: "",
        image: {},
        type,
        loading: false
    });

    const {
        user: { token: userToken },
    } = useAuth();

    const navigation = useNavigation();

    async function getStore() {
        try {
            setState((state) => ({ ...state, loading: true }));

            const { store, error } = await API.Store.getStore(
                userToken,
                storeId
            );

            if (error) {
                Toast.show("Unable to load Store details, try later");
                return navigation.goBack();
            }

            const { name, description, image, type } = store;

            const newState = {
                name,
                description,
                image,
                type,
            };

            setState((state) => ({ ...state, ...newState }));
        } catch (error) {
            Toast.show("Unable to load Store details, try later");
            navigation.goBack();
        } finally {
            setState((state) => ({ ...state, loading: false }));
        }
    }

    useEffect(() => {
        if (!storeId) {
            return;
        }

        getStore();
    }, []);

    return (
        <Layout style={STYLES.formLayout}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={90}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <SingleImagePicker state={state} setState={setState} />
                    <View style={{ marginVertical: "5%" }}></View>
                    <FormStoreInputName
                        state={state}
                        setState={setState}
                    ></FormStoreInputName>
                    <View style={{ marginVertical: "5%" }}></View>
                    <FormStoreInputDescription
                        state={state}
                        setState={setState}
                    ></FormStoreInputDescription>
                    <View style={{ marginTop: "15%" }}></View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <FormStoreSubmitButton
                            state={state}
                            setState={setState}
                        ></FormStoreSubmitButton>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Layout>
    );
}

function FormStoreInputName({ state, setState }) {
    const placeholder = "Store Name";
    const { name, loading } = state;

    function onChange(name) {
        setState((state) => ({ ...state, name }));
    }

    return (
        <Input
            label="Store Name"
            placeholder={placeholder}
            value={name}
            onChangeText={onChange}
            disabled={loading}
        />
    );
}

function FormStoreInputDescription({ state, setState }) {
    const placeholder = "Store Description";
    const { description, loading } = state;

    function onChange(description) {
        setState((state) => ({ ...state, description }));
    }

    return (
        <Input
            label="Description"
            numberOfLines={2}
            multiline
            placeholder={placeholder}
            value={description}
            onChangeText={onChange}
            disabled={loading}
        />
    );
}

function FormStoreSubmitButton({ state, setState,}) {
    const route = useRoute();

    const { storeId } = route.params;
    const buttonText = storeId ? "Save" : "Submit";
    const { loading } = state;

    const navigation = useNavigation();

    const {
        user: { token: userToken },
    } = useAuth();

    const { setStore } = useStore();

    const queryClient = useQueryClient();

    function createStore() {
        return API.Store.createStore(userToken, state);
    }

    function updateStore() {
        return API.Store.updateStore(userToken, storeId, state);
    }

    async function onSubmit() {
        try {
            setState((state) => ({ ...state, loading: true }));

            const call = storeId ? updateStore : createStore;

            const { error, message, store } = await call();

            if (error) {
                return Toast.show(error, Toast.durations.SHORT);
            }

            if (store && store.type === StoreType.Partner) {
                return setStore(store);
            }

            if (!error) {
                Toast.show(message, Toast.durations.SHORT);
            }

            if (storeId && message) {
                queryClient.invalidateQueries({
                    queryKey: [Query.Store(storeId)],
                });
            }

            if (message) {
                queryClient.invalidateQueries({
                    queryKey: [Query.Stores],
                });
            }

            navigation.goBack();
        } catch (error) {
            if (error.message === "No Store Image") {
                return Toast.show("You must choose an image for your store");
            }

            console.error(error);
            Toast.show("Could not submit the request, try later");
        } finally {
             setState((state) => ({ ...state, loading: false }));
        }
    }

    return (
        <Button
            disabled={loading}
            onPress={onSubmit}
            text={buttonText}
            style={{ width: "40%" }}
        >
            {loading ? <LoadingIndicator /> : <></>} {buttonText}
        </Button>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%",
    },
});
