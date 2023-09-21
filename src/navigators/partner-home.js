import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Screen from "../constants/screen";
import { useStore } from "../contexts/store";
import ScreenStoreDetails from "../screens/store/details";
import ScreenStoreForm from "../screens/store/form";
import ScreenAdvertisementDetails from "../screens/advertisement/details";
import ScreenAdvertisementForm from "../screens/advertisement/form";
import ScreenAdvertisementCatalogue from "../screens/advertisement/catalogue";

const Stack = createNativeStackNavigator();

export default function NavigatorPartnerHome() {
    const { store } = useStore();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name={Screen.PartnerHomeStoreDetails}
                component={ScreenStoreDetails}
                initialParams={{ store }}
            />
            <Stack.Screen
                name={Screen.PartnerHomeStoreForm}
                component={ScreenStoreForm}
            />
            <Stack.Screen
                name={Screen.PartnerHomeAdvertisementDetails}
                component={ScreenAdvertisementDetails}
            />
            <Stack.Screen
                name={Screen.PartnerHomeAdvertisementForm}
                component={ScreenAdvertisementForm}
            />
            <Stack.Screen
                name={Screen.PartnerHomeAdvertisementCatalogue}
                component={ScreenAdvertisementCatalogue}
            />
        </Stack.Navigator>
    );
}
