import { AuthProvider } from "./src/contexts/auth";
import {
    NavigationContainer,
    useNavigationContainerRef,
} from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import ScreenRoot from "./src/screens/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "./src/contexts/store";
import { Provider as PaperProvider } from "react-native-paper";
import { useState } from "react";
import * as Font from 'expo-font';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const queryClient = new QueryClient();

export default function App() {

    const [fontLoaded, setFontLoaded] = useState(false);

    const loadFont = async () => {
        await Font.loadAsync({
            'poppins': require("./assets/fonts/Poppins-Medium.ttf"),
        });
        setFontLoaded(true);
    };

    if (!fontLoaded) {
        loadFont();
        return <ActivityIndicator animating={true} color={MD2Colors.purple800} />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <StoreProvider>
                    <SafeAreaProvider>
                        <NavigationContainer>
                            <ApplicationProvider {...eva} theme={eva.light}>
                                <PaperProvider>
                                    <ScreenRoot />
                                </PaperProvider>
                            </ApplicationProvider>
                        </NavigationContainer>
                    </SafeAreaProvider>
                </StoreProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
