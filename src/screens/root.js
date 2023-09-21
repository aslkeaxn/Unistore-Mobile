import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth";
import ScreenSplash from "./splash";
import UserType from "../constants/user-type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavigatorAuth from "../navigators/auth";
import NavigatorStudent from "../navigators/student";
import NavigatorPartner from "../navigators/partner";

export default function ScreenRoot() {
    const [loading, setLoading] = useState(true);
    const { user, setUser } = useAuth();

    async function readUserFromAsyncStorage() {
        try {
            setLoading(true);
            const user = await AsyncStorage.getItem("user");

            if (!user) {
                return;
            }

            const json = JSON.parse(user);
            setUser(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        readUserFromAsyncStorage();
    }, []);

    if (loading) {
        return <ScreenSplash />;
    }

    if (!user) {
        return <NavigatorAuth />;
    }

    if (user.details.type === UserType.Student) {
        return <NavigatorStudent />;
    }

    if (user.details.type === UserType.Partner) {
        return <NavigatorPartner />;
    }
}
