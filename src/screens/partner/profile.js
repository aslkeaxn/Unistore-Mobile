import { Button, Text, Layout } from "@ui-kitten/components";
import ScreenContainer from "../../components/ScreenContainer";
import { useAuth } from "../../contexts/auth";
import UserType from "../../constants/user-type";
import { useNavigation } from "@react-navigation/native";
import Screen from "../../constants/screen";
import STYLES from "../../constants/design";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function ScreenPartnerProfile() {
    return (
        <ScreenContainer>
            <Layout style={STYLES.screenContainer}>
                <HeaderProfile />
                <ButtonEditProfile />
                <ButtonSignOut />
            </Layout>
        </ScreenContainer>
    );
}

function HeaderProfile() {
    return <Text style={STYLES.screen_header}>Profile</Text>;
}

function ButtonEditProfile() {
    const text = "Edit Profile";

    const navigation = useNavigation();

    const {
        user: { token: userToken, details: details },
    } = useAuth();

    function onPress() {
        navigation.navigate(Screen.PartnerProfileDetails, {
            type: UserType.Partner,
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
