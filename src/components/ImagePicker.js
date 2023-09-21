import { Layout } from "@ui-kitten/components";
import * as ImPicker from "expo-image-picker";
import { Image, Pressable, ScrollView, View } from "react-native";
import Toast from "react-native-root-toast";
import Button from "../components/Button";
import STYLES from "../constants/design";

export default function ImagePicker({ state, setState, isEdit }) {
    return (
        <Layout style={{ flex: 1 }}>
            <InputImages state={state} setState={setState} />
            <ListImages state={state} setState={setState} />
        </Layout>
    );
}

function InputImages({ state, setState }) {
    const text = "Add images";
    const { loading } = state;

    async function onPress() {
        try {
            const result = await ImPicker.launchImageLibraryAsync({
                mediaTypes: ImPicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
            });

            if (!result.assets) {
                return;
            }

            const images = result.assets.map(({ uri }) => ({ uri }));
            setState((state) => ({ ...state, images }));
        } catch (error) {
            console.error(error);
            Toast.show("Could not open image picker", Toast.durations.SHORT);
        }
    }

    return (
        <Button onPress={onPress} disabled={loading} text={text} style={{ marginVertical: "5%", width: "40%",  }}>
        </Button>
    );
}

function ListImages({ state, setState }) {
    const { imagesToDelete, images, imagesToKeep } = state;

    return (
        <ScrollView horizontal={true} style={{ padding: 5, borderWidth: 1, minHeight: 100, flex: 1, columnGap: 3 }}>
            {imagesToDelete.map((image) => (
                <ListImage
                    key={image.uri || image.url}
                    image={image}
                    toDelete={true}
                    setState={setState}
                />
            ))}
            {images.map((image) => (
                <ListImage
                    key={image.uri || image.url}
                    image={image}
                    setState={setState}
                />
            ))}
            {imagesToKeep.map((image) => (
                <ListImage
                    key={image.uri || image.url}
                    image={image}
                    setState={setState}
                />
            ))}
        </ScrollView>
    );
}

function ListImage({ image, toDelete = false, setState }) {
    const { uri, url } = image;

    function onPress() {
        if (uri) {
            return setState((state) => ({
                ...state,
                images: [...state.images.filter((image) => image.uri !== uri)],
            }));
        }

        if (!toDelete) {
            return setState((state) => ({
                ...state,
                imagesToKeep: [
                    ...state.imagesToKeep.filter((image) => image.url !== url),
                ],
                imagesToDelete: [...state.imagesToDelete, image],
            }));
        }

        if (toDelete) {
            return setState((state) => ({
                ...state,
                imagesToDelete: [
                    ...state.imagesToDelete.filter(
                        (image) => image.url !== url
                    ),
                ],
                imagesToKeep: [...state.imagesToKeep, image],
            }));
        }
    }

    return (
        <Pressable onPress={onPress}>
            <Image
                source={{ uri: uri || url }}
                style={{
                    width: 100,
                    height: 100,
                    resizeMode: "cover",
                    borderWidth: toDelete ? 10 : 0,
                    borderColor: toDelete ? "red" : "black",
                    marginRight: 5
                }}
            />
        </Pressable>
    );
}
