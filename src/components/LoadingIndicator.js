import { Spinner } from "@ui-kitten/components";
import { View } from "react-native";

export default function LoadingIndicator() {
    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Spinner size="small" />
        </View>
    );
}
