import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StoreType from "../constants/store-type";
import Screen from "../constants/screen";
import ScreenStoreCatalogue from "../screens/store/catalogue";
import ScreenStoreDetails from "../screens/store/details";
import ScreenAdvertisementDetails from "../screens/advertisement/details";
import ScreenAdvertisementCatalogue from "../screens/advertisement/catalogue";

const Stack = createNativeStackNavigator();

export default function NavigatorStudentPartners() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={Screen.StudentPartnersStoreCatalogue}
                component={ScreenStoreCatalogue}
                initialParams={{ type: StoreType.Partner.toLowerCase() }}
            />
            <Stack.Screen
                name={Screen.StudentPartnersStoreDetails}
                component={ScreenStoreDetails}
            />
            <Stack.Screen
                name={Screen.StudentPartnersAdvertisementDetails}
                component={ScreenAdvertisementDetails}
            />
            <Stack.Screen
                name={Screen.StudentPartnersAdvertisementCatalogue}
                component={ScreenAdvertisementCatalogue}
            />
        </Stack.Navigator>
    );
}
