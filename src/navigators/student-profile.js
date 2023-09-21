import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Screen from "../constants/screen";
import ScreenStudentProfile from "../screens/student/profile";
import ScreenSignUp from "../screens/auth/sign-up";
import ScreenAdvertisementCatalogue from "../screens/advertisement/catalogue";
import ScreenStoreCatalogue from "../screens/store/catalogue";
import ScreenAdvertisementForm from "../screens/advertisement/form";
import ScreenAdvertisementDetails from "../screens/advertisement/details";
import ScreenStoreDetails from "../screens/store/details";
import ScreenStoreForm from "../screens/store/form";
import StoreType from "../constants/store-type";

const Stack = createNativeStackNavigator();

export default function NavigatorStudentProfile() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={Screen.StudentProfile}
                component={ScreenStudentProfile}
            />
            <Stack.Screen
                name={Screen.StudentProfileDetails}
                component={ScreenSignUp}
            />
            <Stack.Screen
                name={Screen.StudentProfileProducts}
                component={ScreenAdvertisementCatalogue}
            />
            <Stack.Screen
                name={Screen.StudentProfileServices}
                component={ScreenAdvertisementCatalogue}
            />
            <Stack.Screen
                name={Screen.StudentProfileRequests}
                component={ScreenAdvertisementCatalogue}
            />
            <Stack.Screen
                name={Screen.StudentProfileSmallBusiness}
                component={ScreenStoreCatalogue}
                initialParams={{ type: StoreType.User.toLowerCase() }}
            />
            <Stack.Screen
                name={Screen.StudentProfileAdvertisementDetails}
                component={ScreenAdvertisementDetails}
            />
            <Stack.Screen
                name={Screen.StudentProfileAdvertisementForm}
                component={ScreenAdvertisementForm}
            />
            <Stack.Screen
                name={Screen.StudentProfileStoreDetails}
                component={ScreenStoreDetails}
            />
            <Stack.Screen
                name={Screen.StudentProfileStoreForm}
                component={ScreenStoreForm}
            />
            <Stack.Screen
                name={Screen.StudentProfileAdvertisementCalogue}
                component={ScreenAdvertisementCatalogue}
            />
        </Stack.Navigator>
    );
}
