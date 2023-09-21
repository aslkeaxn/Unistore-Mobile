import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Navigator from "../constants/navigator";
import NavigatorPartnerHome from "./partner-home";
import NavigatorPartnerProfile from "./partner-profile";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Screen from "../constants/screen";
import ScreenStoreForm from "../screens/store/form";
import StoreType from "../constants/store-type";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth";
import API from "../api";
import Toast from "react-native-root-toast";
import { useStore } from "../contexts/store";
import ScreenSplash from "../screens/splash";
import { Feather } from "@expo/vector-icons";
import NavigatorPartnerMessages from "./partner-messages";
import { useQuery } from "@tanstack/react-query";
import Query from "../constants/query";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function NavigatorPartner() {
    const unreadMessagesCount = useUnreadMessagesCount();
    const { store, loading } = useHasStore();

    if (loading) {
        return <ScreenSplash />;
    }

    if (!store) {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name={Screen.PartnerHomeStoreForm}
                    component={ScreenStoreForm}
                    initialParams={{ type: StoreType.Partner }}
                />
            </Stack.Navigator>
        );
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === Navigator.PartnerHome) {
                        iconName = "home";
                    } else if (route.name === Navigator.PartnerProfile) {
                        iconName = "users";
                    } else if (route.name === Navigator.PartnerMessages) {
                        iconName = "message-circle";
                    }

                    return (
                        <Feather
                            name={iconName}
                            size={size}
                            color={
                                route.name === Navigator.PartnerMessages &&
                                unreadMessagesCount > 0
                                    ? "red"
                                    : color
                            }
                        />
                    );
                },
                tabBarActiveTintColor: "#0000FF",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tab.Screen
                name={Navigator.PartnerHome}
                component={NavigatorPartnerHome}
            />
            <Tab.Screen
                name={Navigator.PartnerProfile}
                component={NavigatorPartnerProfile}
            />
            <Tab.Screen
                name={Navigator.PartnerMessages}
                component={NavigatorPartnerMessages}
            />
        </Tab.Navigator>
    );
}

function useUnreadMessagesCount() {
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    const {
        user: { token: userToken },
    } = useAuth();

    async function readUnreadMessagesCount() {
        try {
            const { unreadMessagesCount, error } =
                await API.Chat.readUnreadMessagesCount(userToken);

            if (error) {
                return console.error(error);
            }

            return unreadMessagesCount;
        } catch (error) {
            console.error(error);
        }
    }

    const { data } = useQuery({
        queryKey: [Query.UnreadMessagesCount],
        queryFn: readUnreadMessagesCount,
        refetchInterval: 2000,
    });

    useEffect(() => {
        if (data === undefined || data === null) {
            return;
        }

        setUnreadMessagesCount(data);
    }, [data]);

    return unreadMessagesCount;
}

function useHasStore() {
    const [loading, setLoading] = useState(true);
    const { store, setStore } = useStore();

    const {
        user: { token: userToken },
        signOut,
    } = useAuth();

    async function readStore() {
        try {
            const { error, store } = await API.Store.getOwnStore(userToken);

            if (error) {
                Toast.show(error, Toast.durations.SHORT);
                return signOut();
            }

            setStore(store);
            setLoading(false);
        } catch (error) {
            console.error(error);
            Toast.show("Server error, please try later", Toast.durations.SHORT);
            signOut();
        }
    }

    useEffect(() => {
        readStore();
    }, []);

    return { store, loading };
}

// check if they create store
// render the store creation page
// render partner-home tab navigator
//  page1: store details
//  page2: profile stack navigator
//      edit details
//      subscription
//      payment page
