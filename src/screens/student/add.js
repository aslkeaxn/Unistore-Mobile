import { Button, Layout, Text } from "@ui-kitten/components";
import ScreenContainer from "../../components/ScreenContainer";
import { useNavigation } from "@react-navigation/native";
import Screen from "../../constants/screen";
import AdvertisementType from "../../constants/advertisement-type";
import StoreType from "../../constants/store-type";
import STYLES from "../../constants/design";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function ScreenStudentAdd() {
    return (
        <ScreenContainer>
            <HeaderStudentHome />
            <ButtonsCatalogues />
        </ScreenContainer>
    );
}

function ButtonsCatalogues() {
    return (
        <Layout style={{ flex: 1 }}>
            <ButtonAddProduct />
            <ButtonOfferService />
            <ButtonMakeRequest />
            <ButtonCreateStore />
        </Layout>
    );
}

function HeaderStudentHome() {
    const text = "Add an Item to a Catalogue";
    return <Text style={STYLES.screen_header}>{text}</Text>;
}

function ButtonAddProduct() {
    const text = "Add Product";

    const navigate = useNavigation();

    function onPress() {
        navigate.navigate(Screen.StudentAddAdvertisementForm, {
            type: AdvertisementType.Product,
        });
    }

    return (
        <Button style={STYLES.button} onPress={onPress}>
            <View>
                <Layout style={STYLES.buttonContainer}>
                    <Feather name={"shopping-bag"} size={18} color="black" />
                    <Text style={STYLES.text}>{text}</Text>
                </Layout>
            </View>
        </Button>
    );
}

function ButtonOfferService() {
    const text = "Offer Service";

    const navigate = useNavigation();

    function onPress() {
        navigate.navigate(Screen.StudentAddAdvertisementForm, {
            type: AdvertisementType.Service,
        });
    }

    return (
        <Button style={STYLES.button} onPress={onPress}>
            <View>
                <Layout style={STYLES.buttonContainer}>
                    <Feather name={"tool"} size={18} color="black" />
                    <Text style={STYLES.text}>{text}</Text>
                </Layout>
            </View>
        </Button>
    );
}

function ButtonMakeRequest() {
    const text = "Make Request";

    const navigate = useNavigation();

    function onPress() {
        navigate.navigate(Screen.StudentAddAdvertisementForm, {
            type: AdvertisementType.Request,
        });
    }

    return (
        <Button style={STYLES.button} onPress={onPress}>
            <View>
                <Layout style={STYLES.buttonContainer}>
                    <Feather name={"help-circle"} size={18} color="black" />
                    <Text style={STYLES.text}>{text}</Text>
                </Layout>
            </View>
        </Button>
    );
}

function ButtonCreateStore() {
    const text = "Create Small Business";

    const navigate = useNavigation();

    function onPress() {
        navigate.navigate(Screen.StudentAddStoreForm, {
            type: StoreType.User,
        });
    }

    return (
        <Button style={STYLES.button} onPress={onPress}>
            <View>
                <Layout style={STYLES.buttonContainer}>
                    <Feather name={"shopping-cart"} size={18} color="black" />
                    <Text style={STYLES.text}>{text}</Text>
                </Layout>
            </View>
        </Button>
    );
}
