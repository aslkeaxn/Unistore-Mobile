import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ScreenPartnerProfile from "../screens/partner/profile";
import ScreenSignUp from "../screens/auth/sign-up";
import Screen from "../constants/screen";

const Stack = createNativeStackNavigator();

export default function NavigatorPartnerProfile() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={Screen.PartnerProfile}
                component={ScreenPartnerProfile}
            />
            <Stack.Screen
                name={Screen.PartnerProfileDetails}
                component={ScreenSignUp}
            />
        </Stack.Navigator>
    );
}
