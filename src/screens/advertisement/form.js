import {
    IndexPath,
    Layout,
    Select,
    SelectItem,
    Text,
} from "@ui-kitten/components";
import ScreenContainer from "../../components/ScreenContainer";
import { useNavigation, useRoute } from "@react-navigation/native";
import AdvertisementType from "../../constants/advertisement-type";
import { useEffect, useState } from "react";
import API from "../../api/index";
import { useAuth } from "../../contexts/auth";
import Toast from "react-native-root-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Query from "../../constants/query";
import LoadingIndicator from "../../components/LoadingIndicator";
import ImagePicker from "../../components/ImagePicker";
import StoreId from "../../constants/store-id";
import Input from "../../components/Input";
import Button, { ButtonType } from "../../components/Button";
import STYLES from "../../constants/design";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function ScreenAdvertisementForm() {
    return (
        <ScreenContainer>
            <HeaderAdvertisementForm />
            <FormAdvertisement />
        </ScreenContainer>
    );
}

function HeaderAdvertisementForm() {
    const route = useRoute();
    const { type } = route.params;

    const navigation = useNavigation();
    return (
        <Layout
            style={{
                flexDirection: "row",
                alignItems: "baseline",
                paddingHorizontal: 5,
            }}
        >
            <Feather
                name="chevron-left"
                size={20}
                color="black"
                onPress={() => {
                    navigation.goBack();
                }}
            />
            <Text style={STYLES.screen_header}>
                {AdvertisementType[type]}Form
            </Text>
        </Layout>
    );
}

function FormAdvertisement() {
    const route = useRoute();
    const { type, storeId = null, advertisementId } = route.params;

    const [state, setState] = useState({
        storeId,
        categoryId: null,
        title: "",
        description: "",
        price: "",
        stock: "",
        images: [],
        imagesToKeep: [],
        imagesToDelete: [],
        type,
    });

    const {
        user: { token: userToken },
    } = useAuth();

    const navigation = useNavigation();

    async function getAdvertisement() {
        try {
            setState((state) => ({ ...state, loading: true }));

            const { advertisement, error } =
                await API.Advertisement.getAdvertisement(
                    userToken,
                    advertisementId
                );

            if (error) {
                Toast.show("Could load advertisement details, try later");
                return navigation.goBack();
            }

            const {
                storeId,
                categoryId,
                title,
                description,
                price,
                stock,
                images,
                type,
            } = advertisement;

            const newState = {
                storeId,
                categoryId,
                title,
                description,
                price: String(price),
                stock: String(stock),
                imagesToKeep: images,
                type,
            };

            setState((state) => ({ ...state, ...newState }));
        } catch (error) {
            console.error(error);
            Toast.show("Could load advertisement details, try later");
            navigation.goBack();
        } finally {
            setState((state) => ({ ...state, loading: false }));
        }
    }

    useEffect(() => {
        if (!advertisementId) {
            return;
        }

        getAdvertisement();
    }, []);

    return (
        <Layout style={STYLES.formLayout}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                >
                    <FormAdvertisementInputTitle
                        state={state}
                        setState={setState}
                    />
                    <FormAdvertisementInputDescription
                        state={state}
                        setState={setState}
                    />
                    <FormAdvertisementInputCategory
                        state={state}
                        setState={setState}
                    />
                    <FormAdvertisementInputPrice
                        state={state}
                        setState={setState}
                    />
                    <FormAdvertisementInputStock
                        state={state}
                        setState={setState}
                    />
                    <ImagePicker
                        state={state}
                        setState={setState}
                        isEdit={advertisementId}
                    />
                    <FormAdvertisementButtonSubmit
                        state={state}
                        setState={setState}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </Layout>
    );
}

function FormAdvertisementInputTitle({ state, setState }) {
    const placeholder = "Title";
    const { title, loading } = state;

    function onChange(title) {
        setState((state) => ({ ...state, title }));
    }

    return (
        <View style={{ marginVertical: "5%" }}>
            <Input
                placeholder={placeholder}
                value={title}
                onChangeText={onChange}
                disabled={loading}
                multiline={true}
            />
        </View>
    );
}

function FormAdvertisementInputDescription({ state, setState }) {
    const placeholder = "Description";
    const { description, loading } = state;

    function onChange(description) {
        setState((state) => ({ ...state, description }));
    }

    return (
        <View style={{ marginVertical: "5%" }}>
            <Input
                placeholder={placeholder}
                value={description}
                onChangeText={onChange}
                disabled={loading}
                multiline={true}
            />
        </View>
    );
}

function FormAdvertisementInputCategory({ state, setState }) {
    const placeholder = "Category";
    const { loading, type, categoryId } = state;

    if (type !== AdvertisementType.Product) {
        return;
    }

    const navigation = useNavigation();

    const {
        user: { token: userToken },
    } = useAuth();

    function getCategories() {
        return API.Category.getCategories(userToken);
    }

    const { data, error, isLoading } = useQuery({
        queryKey: [Query.Categories],
        queryFn: getCategories,
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (!data) {
            return;
        }

        const { categories, error } = data;

        if (error) {
            Toast.show("Could not fetch categories", Toast.durations.SHORT);
            return navigation.goBack();
        }

        setCategories(categories);
    }, [data, error]);

    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        const categoryIdIndex = categories.findIndex(
            ({ _id }) => categoryId === _id
        );

        if (categoryIdIndex !== -1) {
            setSelectedIndex(new IndexPath(categoryIdIndex));
        }
    }, [categoryId]);

    const value = selectedIndex && categories[selectedIndex.row].name;

    function onSelect(index) {
        setSelectedIndex(index);
        setState((state) => ({
            ...state,
            categoryId: categories[index.row]._id,
        }));
    }

    return (
        <View style={{ marginVertical: "5%" }}>
            <Select
                placeholder={placeholder}
                value={value}
                selectedIndex={selectedIndex}
                onSelect={onSelect}
                disabled={isLoading || loading}
                size="large"
            >
                {categories.map(({ _id, name }) => (
                    <SelectItem key={_id} title={name} />
                ))}
            </Select>
        </View>
    );
}

function FormAdvertisementInputPrice({ state, setState }) {
    const placeholder = "Price";
    const { price, type, loading } = state;

    if (type !== AdvertisementType.Product) {
        return;
    }

    function onChange(price) {
        setState((state) => ({ ...state, price }));
    }

    return (
        <View style={{ marginVertical: "5%" }}>
            <Input
                placeholder={placeholder}
                value={price}
                onChangeText={onChange}
                disabled={loading}
                keyboardType="numeric"
                returnKeyType="done"
            />
        </View>
    );
}

function FormAdvertisementInputStock({ state, setState }) {
    const placeholder = "Stock";
    const { stock, type, loading } = state;

    if (type !== AdvertisementType.Product) {
        return;
    }

    function onChange(stock) {
        setState((state) => ({ ...state, stock }));
    }

    return (
        <View style={{ marginVertical: "5%" }}>
            <Input
                placeholder={placeholder}
                value={stock}
                onChangeText={onChange}
                disabled={loading}
                keyboardType="numeric"
                returnKeyType="done"
            />
        </View>
    );
}

function FormAdvertisementButtonSubmit({ state, setState }) {
    const route = useRoute();

    const { advertisementId } = route.params;
    const text = advertisementId ? "Save" : "Submit";
    const { loading, storeId, type } = state;

    const advertisement = { ...state, title: state.title.trim() };

    const navigation = useNavigation();
    const {
        user: { token: userToken },
    } = useAuth();

    const queryClient = useQueryClient();

    function createAdvertisement() {
        return API.Advertisement.createAdvertisement(userToken, advertisement);
    }

    function updateAdvertisement() {
        return API.Advertisement.updateAdvertisement(
            userToken,
            advertisementId,
            advertisement
        );
    }

    async function onSubmit() {
        try {
            setState((state) => ({ ...state, loading: true }));

            const call = advertisementId
                ? updateAdvertisement
                : createAdvertisement;

            const { error } = await call();

            if (error) {
                return Toast.show(error, Toast.durations.SHORT);
            }

            let invalidateLatest;

            switch (type) {
                case AdvertisementType.Product:
                    invalidateLatest = [Query.LatestStudentProducts];
                    break;
                case AdvertisementType.Request:
                    invalidateLatest = [Query.LatestStudentRequests];
                    break;
                case AdvertisementType.Service:
                    invalidateLatest = [Query.LatestStudentServices];
                    break;
                default:
                    break;
            }

            if (storeId && !StoreId[storeId]) {
                queryClient.invalidateQueries({
                    queryKey: [Query.StoreProduct(storeId)],
                });
            }

            if ((storeId && StoreId[storeId]) || !advertisementId) {
                queryClient.invalidateQueries({
                    queryKey: [Query[type]],
                });
            }

            if (advertisementId) {
                queryClient.invalidateQueries({
                    queryKey: [Query.Advertisement(advertisementId)],
                });
            }

            if (invalidateLatest) {
                queryClient.invalidateQueries({ queryKey: invalidateLatest });
                queryClient.invalidateQueries({
                    queryKey: [Query.LatestPartnerProducts],
                });
            }

            const message = advertisementId
                ? "Successfully edited Item"
                : "Successfully added Item";
            Toast.show(message, Toast.durations.SHORT);

            navigation.goBack();
        } catch (error) {
            console.error(error);
            Toast.show("Could not submit the request, try later");
        } finally {
            setState((state) => ({ ...state, loading: false }));
        }
    }

    return (
        <Button
            onPress={onSubmit}
            disabled={loading}
            loading={loading}
            text={text}
            style={{ marginVertical: "10%", width: "40%" }}
        >
            {loading ? <LoadingIndicator /> : text}
        </Button>
    );
}
