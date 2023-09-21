import { Button, Layout, Text } from "@ui-kitten/components";
import ScreenContainer from "../../components/ScreenContainer";
import { useNavigation } from "@react-navigation/native";
import Screen from "../../constants/screen";
import UserType from "../../constants/user-type";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import STYLES from "../../constants/design";

export default function ScreenSignUpChoice() {
    return (
        <ScreenContainer>
            <HeaderSignUpChoice />
            <ButtonsSignUpChoice />
        </ScreenContainer>
    );
}

function HeaderSignUpChoice() {
    return <Text style={STYLES.screen_header}>Sign Up Choice</Text>;
}

function ButtonsSignUpChoice() {
    return (
        <Layout style={{ flex: 1, justifyContent: "center" }}>
            <ButtonSignUpStudent />
            <ButtonSignUpPartner />
        </Layout>
    );
}

function ButtonSignUpStudent() {
    const navigation = useNavigation();
    const text = "Sign up as a Student";

    function onSignUpStudent() {
        navigation.navigate(Screen.SignUp, { type: UserType.Student });
    }

    return (
        <Button style={STYLES.button} onPress={onSignUpStudent}>
            <View>
                <Layout style={STYLES.buttonContainer}>
                    <Feather name={"user"} size={18} color="black" />
                    <Text style={STYLES.text}>{text}</Text>
                </Layout>
            </View>
        </Button>
    );
}

function ButtonSignUpPartner() {
    const navigation = useNavigation();
    const text = "Sign up as a Partner";

    function onSignUpPartner() {
        navigation.navigate(Screen.SignUp, { type: UserType.Partner });
    }

    return (
        <Button style={STYLES.button} onPress={onSignUpPartner}>
            <View>
                <Layout style={STYLES.buttonContainer}>
                    <Feather name={"users"} size={18} color="black" />
                    <Text style={STYLES.text}>{text}</Text>
                </Layout>
            </View>
        </Button>
    );
}
