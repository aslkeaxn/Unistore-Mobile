import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Screen from "../constants/screen";
import ScreenStudentMessages from "../screens/student/messages";
import ScreenStudentConversation from "../screens/student/conversation";

const Stack = createNativeStackNavigator();

export default function NavigatorPartnerMessages() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={Screen.PartnerMessages}
                component={ScreenStudentMessages}
                initialParams={{ partner: true }}
            />
            <Stack.Screen
                name={Screen.PartnerConversation}
                component={ScreenStudentConversation}
            />
        </Stack.Navigator>
    );
}
