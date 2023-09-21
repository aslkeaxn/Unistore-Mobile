import { Layout, Text } from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScreenContainer({ children, padding = 0 }) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Layout style={{ flex: 1, padding }}>{children}</Layout>
        </SafeAreaView>
    );
}
