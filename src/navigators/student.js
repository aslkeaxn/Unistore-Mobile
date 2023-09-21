import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { View } from "react-native";
import API from "../api";
import Navigator from "../constants/navigator";
import Query from "../constants/query";
import StoreType from "../constants/store-type";
import { useAuth } from "../contexts/auth";
import NavigatorStudentAdd from "./student-add";
import NavigatorStudentHome from "./student-home";
import NavigatorStudentMessages from "./student-messages";
import NavigatorStudentPartners from "./student-partners";
import NavigatorStudentProfile from "./student-profile";

const Tab = createBottomTabNavigator();

export default function NavigatorStudent() {
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

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === Navigator.StudentHome) {
                        iconName = "home";
                    } else if (route.name === Navigator.StudentPartners) {
                        iconName = "users";
                    } else if (route.name === Navigator.StudentAdd) {
                        iconName = "plus-circle";
                    } else if (route.name === Navigator.StudentMessages) {
                        iconName = "message-circle";
                    } else if (route.name === Navigator.StudentProfile) {
                        iconName = "user";
                    }

                    return (
                        <Feather
                            name={iconName}
                            size={size}
                            color={
                                route.name === Navigator.StudentMessages &&
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
                name={Navigator.StudentHome}
                component={NavigatorStudentHome}
            />
            <Tab.Screen
                name={Navigator.StudentPartners}
                component={NavigatorStudentPartners}
                initialParams={{ type: StoreType.Partner.toLowerCase() }}
            />
            <Tab.Screen
                name={Navigator.StudentAdd}
                component={NavigatorStudentAdd}
            />
            <Tab.Screen
                name={Navigator.StudentMessages}
                component={NavigatorStudentMessages}
            />
            <Tab.Screen
                name={Navigator.StudentProfile}
                component={NavigatorStudentProfile}
            />
        </Tab.Navigator>
    );
}
