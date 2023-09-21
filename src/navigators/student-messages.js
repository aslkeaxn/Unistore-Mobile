import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Screen from "../constants/screen";
import ScreenStudentMessages from "../screens/student/messages";
import ScreenStudentConversation from "../screens/student/conversation";

const Stack = createNativeStackNavigator();

export default function NavigatorStudentMessages() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={Screen.StudentMessages}
                component={ScreenStudentMessages}
            />
            <Stack.Screen
                name={Screen.StudentConversation}
                component={ScreenStudentConversation}
            />
        </Stack.Navigator>
    );
}
