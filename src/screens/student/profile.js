import { Button, Layout, Text } from "@ui-kitten/components";
import ScreenContainer from "../../components/ScreenContainer";
import { useAuth } from "../../contexts/auth";
import { useNavigation } from "@react-navigation/native";
import Screen from "../../constants/screen";
import UserType from "../../constants/user-type";
import StoreId from "../../constants/store-id";
import AdvertisementType from "../../constants/advertisement-type";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import STYLES from "../../constants/design";
import AdBanner from "../../components/AdBanner";

export default function ScreenStudentProfile() {
    return (
        <ScreenContainer>
            <HeaderProfile />
            <AdBanner />
            <Layout style={{}}>
                <ButtonsProfile />
                <ButtonSignOut />
            </Layout>
        </ScreenContainer>
    );
}

function HeaderProfile() {
    return <Text style={STYLES.screen_header}>Profile</Text>;
}

function ButtonsProfile() {
    return (
        <Layout>
            <ButtonEditProfile />
            <ButtonMyProducts />
            <ButtonMyServices />
            <ButtonMyRequests />
            <ButtonMySmallBusiness />
        </Layout>
    );
}

function ButtonEditProfile() {
    const text = "Edit Profile";

    const navigation = useNavigation();

    const {
        user: { token: userToken, details: details },
    } = useAuth();

    function onPress() {
        navigation.navigate(Screen.StudentProfileDetails, {
            type: UserType.Student,
            user: details,
            token: userToken,
        });
    }

    return (
        <Button style={STYLES.button} onPress={onPress}>
            <View>
                <Layout style={STYLES.buttonContainer}>
                    <Feather name={"edit"} size={18} color="black" />
                    <Text style={STYLES.text}>{text}</Text>
                </Layout>
            </View>
        </Button>
    );
}

function ButtonMyProducts() {
    const text = "My Products";

    const navigation = useNavigation();

    const {
        user: {
            details: { userId },
        },
    } = useAuth();

    const type = AdvertisementType.Product;
    const storeId = StoreId.Product;

    function onPress() {
        navigation.navigate(Screen.StudentProfileProducts, {
            type,
            storeId,
            userId,
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

function ButtonMyServices() {
    const text = "My Services";

    const navigation = useNavigation();

    const {
        user: {
            details: { userId },
        },
    } = useAuth();

    const type = AdvertisementType.Service;
    const storeId = StoreId.Service;

    function onPress() {
        navigation.navigate(Screen.StudentProfileServices, {
            type,
            storeId,
            userId,
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

function ButtonMyRequests() {
    const text = "My Requests";

    const navigation = useNavigation();

    const {
        user: {
            details: { userId },
        },
    } = useAuth();

    const type = AdvertisementType.Request;
    const storeId = StoreId.Request;

    function onPress() {
        navigation.navigate(Screen.StudentProfileRequests, {
            type,
            storeId,
            userId,
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

function ButtonMySmallBusiness() {
    const text = "My Small Business";

    const navigation = useNavigation();

    const {
        user: {
            details: { userId },
        },
    } = useAuth();

    function onPress() {
        navigation.navigate(Screen.StudentProfileSmallBusiness, {
            userId,
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

function ButtonSignOut() {
    const text = "Sign out";
    const { signOut } = useAuth();

    return (
        <Button
            style={[STYLES.button, STYLES.logOutContainer]}
            onPress={signOut}
            status="danger"
        >
            <View>
                <Layout style={STYLES.buttonContainer}>
                    <Feather name={"log-out"} size={18} color="red" />
                    <Text style={STYLES.textLogOut}>{text}</Text>
                </Layout>
            </View>
        </Button>
    );
}
