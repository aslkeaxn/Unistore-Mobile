import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Screen from "../constants/screen";
import ScreenStudentAdd from "../screens/student/add";
import ScreenAdvertisementForm from "../screens/advertisement/form";
import ScreenStoreForm from "../screens/store/form";

const Stack = createNativeStackNavigator();

export default function NavigatorStudentAdd() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={Screen.StudentAdd}
                component={ScreenStudentAdd}
            />
            <Stack.Screen
                name={Screen.StudentAddAdvertisementForm}
                component={ScreenAdvertisementForm}
            />
            <Stack.Screen
                name={Screen.StudentAddStoreForm}
                component={ScreenStoreForm}
            />
        </Stack.Navigator>
    );
}
