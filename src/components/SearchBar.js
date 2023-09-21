import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Input, Text } from "@ui-kitten/components";
import AdvertisementType from "../constants/advertisement-type";

const SearchBar = ({
    searchText,
    setSearchText,
    showFilterModal,
    setShowFilterModal,
    type,
}) => {
    function onPressClose() {
        setSearchText("");
    }

    function onPressFilter() {
        setShowFilterModal(!showFilterModal);
    }

    return (
        <View>
            <View style={styles.container}>
                <Input
                    style={styles.input}
                    onChangeText={setSearchText}
                    value={searchText}
                    placeholderTextColor="gray"
                    placeholder="Search"
                    accessoryRight={(props) => (
                        <TouchableWithoutFeedback onPress={onPressClose}>
                            <AntDesign name="close" size={22} />
                        </TouchableWithoutFeedback>
                    )}
                />
                {type && (
                    <TouchableOpacity onPress={onPressFilter}>
                        <AntDesign
                            name="filter"
                            size={22}
                            color="black"
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    filterText: {
        textAlign: "right",
        marginRight: 5,
    },
});

export default SearchBar;
