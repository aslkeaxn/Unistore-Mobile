import { Layout, Text } from "@ui-kitten/components";
import * as ImPicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
const PLACEHOLDER_IMAGE = require("../../assets/res/placeholder.png")

export default function SingleImagePicker({ state, setState }) {
    return (
        <Layout>
            <InputImage state={state} setState={setState}></InputImage>
        </Layout>
    )
}

function InputImage({ state, setState }) {

    const [displayImage, setDisplayImage] = useState(() => {
        if (state.image && (state.image.url || state.image.uri)) {
            return state.image.url || state.image.uri;
        } else {
            return null; // or a default value
        }
    });

    useEffect(() =>{
        setDisplayImage(state.image.url || state.image.uri)
    }, [state.image])

    async function onPress() {
        try {
            const result = await ImPicker.launchImageLibraryAsync({
                mediaTypes: ImPicker.MediaTypeOptions.Images,
                quality: 1,
                allowsMultipleSelection: false,
                allowsEditing: true
            });

            if (!result.assets) {
                return;
            }

            const image = { uri: result.assets[0].uri }

            setState((state) => ({ ...state, image }));
            setDisplayImage(image.uri)
        } catch (error) {
            console.error(error);
            Toast.show("Could not open image picker", Toast.durations.SHORT);
        }
    }

    return (
        <View style={styles.container}>
            {(state.image.url || state.image.uri) ? (
                <TouchableOpacity onPress={onPress} style={styles.button}>
                    <Image source={{ uri: displayImage }} style={styles.image} resizeMode="contain" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity activeOpacity={0.1} onPress={onPress} style={styles.button}>
                    <Image source={PLACEHOLDER_IMAGE} style={styles.image} resizeMode="contain" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 300,
        backgroundColor: "#DDDDDD88",
        alignItems: "center",
    },
    image: {
        height: 300,
        width: 300,
    },
    button: {
        height: 300,
    },
});


