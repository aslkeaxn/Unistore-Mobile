import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Screen from "../constants/screen";
import ScreenSignIn from "../screens/auth/sign-in";
import ScreenSignUpChoice from "../screens/auth/sign-up-choice";
import ScreenSignUp from "../screens/auth/sign-up";
import ScreenSignUpCode from "../screens/auth/sign-up-code";
import ScreenForgotPasswordEmail from "../screens/auth/forgot-password-email";
import ScreenForgotPasswordCode from "../screens/auth/forgot-password-code";
import ScreenForgotPasswordReset from "../screens/auth/forgot-password-reset";

const Stack = createNativeStackNavigator();

export default function NavigatorAuth() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screen.SignIn} component={ScreenSignIn} />
            <Stack.Screen
                name={Screen.SignUpChoice}
                component={ScreenSignUpChoice}
            />
            <Stack.Screen name={Screen.SignUp} component={ScreenSignUp} />
            <Stack.Screen
                name={Screen.SignUpCode}
                component={ScreenSignUpCode}
            />
            <Stack.Screen
                name={Screen.ForgotPasswordEmail}
                component={ScreenForgotPasswordEmail}
            />
            <Stack.Screen
                name={Screen.ForgotPasswordCode}
                component={ScreenForgotPasswordCode}
            />
            <Stack.Screen
                name={Screen.ForgotPasswordReset}
                component={ScreenForgotPasswordReset}
            />
        </Stack.Navigator>
    );
}
