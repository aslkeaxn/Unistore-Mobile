import { Layout, Text } from "@ui-kitten/components";
import React from "react";
import { View } from "react-native";

const NoItems = () => {
    return (
        <Layout style={{ flex: 1 }}>
            <View
                style={{
                    marginTop: 20,
                    flex: 1,
                    flexDirection: "column",
                    paddingHorizontal: 10,
                }}
            >
                <Text style={{ fontSize: 14, fontWeight: "bold", fontFamily: "poppins" }}>
                    No result...
                </Text>
            </View>
        </Layout>
    );
};

export default NoItems;
