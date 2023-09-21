import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Screen from "../constants/screen";
import ScreenStudentHome from "../screens/student/home";
import ScreenAdvertisementCatalogue from "../screens/advertisement/catalogue";
import ScreenAdvertisementDetails from "../screens/advertisement/details";
import ScreenAdvertisementForm from "../screens/advertisement/form";
import ScreenStoreCatalogue from "../screens/store/catalogue";
import ScreenStoreDetails from "../screens/store/details";
import ScreenStoreForm from "../screens/store/form";
import StoreType from "../constants/store-type";

const Stack = createNativeStackNavigator();

export default function NavigatorStudentHome() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={Screen.StudentHome}
                component={ScreenStudentHome}
            />
            <Stack.Screen
                name={Screen.StudentHomeAdvertisementCatalogue}
                component={ScreenAdvertisementCatalogue}
            />
            <Stack.Screen
                name={Screen.StudentHomeAdvertisementDetails}
                component={ScreenAdvertisementDetails}
            />
            <Stack.Screen
                name={Screen.StudentHomeAdvertisementForm}
                component={ScreenAdvertisementForm}
            />
            <Stack.Screen
                name={Screen.StudentHomeStoreCatalogue}
                component={ScreenStoreCatalogue}
                initialParams={{ type: StoreType.User.toLowerCase() }}
            />
            <Stack.Screen
                name={Screen.StudentHomeStoreDetails}
                component={ScreenStoreDetails}
            />
            <Stack.Screen
                name={Screen.StudentHomeStoreForm}
                component={ScreenStoreForm}
            />
        </Stack.Navigator>
    );
}
