import { Layout, Text } from "@ui-kitten/components";
import ScreenContainer from "../../components/ScreenContainer";
import { useNavigation } from "@react-navigation/native";
import Screen from "../../constants/screen";
import AdvertisementType from "../../constants/advertisement-type";
import StoreId from "../../constants/store-id";
import STYLES from "../../constants/design";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import API from "../../api/index";
import { useAuth } from "../../contexts/auth";
import UserType from "../../constants/user-type";
import Toast from "react-native-root-toast";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Query from "../../constants/query";
import PLACEHOLDER_IMAGE from "../../../assets/res/placeholder.png";

export default function ScreenStudentHome() {
    const {
        user: { token: userToken },
    } = useAuth();

    async function readLatestPartnerProducts() {
        try {
            const { advertisements: products, error } =
                await API.Advertisement.readLatestAdvertisements(
                    userToken,
                    AdvertisementType.Product,
                    UserType.Partner
                );

            if (error) {
                return Toast.show(
                    "Could not fetch partner products",
                    Toast.durations.SHORT
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        readLatestPartnerProducts();
    }, []);

    return (
        <ScreenContainer>
            <Layout>
                <ScrollView>
                    <HeaderStudentHome />
                    <ButtonsCatalogues />
                    <LatestPartnerProducts />
                    <LatestStudentProducts />
                    <LatestStudentServices />
                    <LatestStudentRequests />
                </ScrollView>
            </Layout>
        </ScreenContainer>
    );
}

function HeaderStudentHome() {
    const text = "Home";
    return <Text style={STYLES.screen_header}>{text}</Text>;
}

function ButtonsCatalogues() {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                paddingVertical: 10,
            }}
        >
            <ButtonsCataloguesButtonProducts />
            <ButtonsCataloguesButtonServices />
            <ButtonsCataloguesButtonRequests />
            <ButtonsCataloguesButtonStores />
        </View>
    );
}

function ButtonsCataloguesButtonProducts() {
    const text = "Products";

    const type = AdvertisementType.Product;
    const storeId = StoreId.Product;

    const navigation = useNavigation();

    function onPress() {
        navigation.navigate(Screen.StudentHomeAdvertisementCatalogue, {
            type,
            storeId,
        });
    }

    return (
        <Pressable onPress={onPress}>
            <View>
                <Layout style={styles.buttonContainer}>
                    <Feather name={"shopping-bag"} size={18} color="black" />
                    <Text style={STYLES.text}>{text}</Text>
                </Layout>
            </View>
        </Pressable>
    );
}

function ButtonsCataloguesButtonServices() {
    const text = "Services";

    const type = AdvertisementType.Service;
    const storeId = StoreId.Service;

    const navigation = useNavigation();

    function onPress() {
        navigation.navigate(Screen.StudentHomeAdvertisementCatalogue, {
            type,
            storeId,
        });
    }

    return (
        <Pressable onPress={onPress}>
            <View>
                <Layout style={styles.buttonContainer}>
                    <Feather name={"tool"} size={18} color="black" />
                    <Text style={STYLES.text}>{text}</Text>
                </Layout>
            </View>
        </Pressable>
    );
}

function ButtonsCataloguesButtonRequests() {
    const text = "Requests";

    const type = AdvertisementType.Request;
    const storeId = StoreId.Request;

    const navigation = useNavigation();

    function onPress() {
        navigation.navigate(Screen.StudentHomeAdvertisementCatalogue, {
            type,
            storeId,
        });
    }

    return (
        <Pressable onPress={onPress}>
            <View>
                <Layout style={styles.buttonContainer}>
                    <Feather name={"help-circle"} size={18} color="black" />
                    <Text style={STYLES.text}>{text}</Text>
                </Layout>
            </View>
        </Pressable>
    );
}

function ButtonsCataloguesButtonStores() {
    const text = "Stores";

    const navigation = useNavigation();

    function onPress() {
        navigation.navigate(Screen.StudentHomeStoreCatalogue);
    }

    return (
        <Pressable onPress={onPress}>
            <View style={{}}>
                <Layout style={styles.buttonContainer}>
                    <Feather name={"shopping-cart"} size={18} color="black" />
                    <Text style={STYLES.text}>{text}</Text>
                </Layout>
            </View>
        </Pressable>
    );
}

function AdCarousel({ title, queryFn, queryKey }) {
    const advertisements = useAdCarouselAdvertisements(queryFn, queryKey);

    // const { isFetching } = useQuery(
    //     [queryKey],
    //     queryFn, {
    //     manual: true,
    // });

    // console.log(isFetching && advertisements.length == 0);
    // useEffect(() => {
    //     console.log("mounted");
    // }, []);

    // if (isFetching && advertisements.length == 0) {
    //     return (
    //         <Layout style={{ paddingHorizontal: 10 }}>
    //             <Text
    //                 style={{
    //                     fontWeight: "bold",
    //                     fontSize: 20,
    //                     marginVertical: "5%",
    //                     fontFamily: "poppins"
    //                 }}
    //             >
    //                 {title}
    //             </Text>
    //             <Text style={{ color: "red", fontFamily: "poppins" }}>
    //                 No Items Added Yet
    //             </Text>
    //         </Layout>
    //     );
    // }

    return (
        <Layout style={{ paddingHorizontal: 10 }}>
            <Text
                style={{
                    fontWeight: "bold",
                    fontSize: 20,
                    marginVertical: "5%",
                    fontFamily: "poppins",
                }}
            >
                {title}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flex: 1, flexDirection: "row", columnGap: 20 }}>
                    {advertisements.map((ad) => (
                        <RecentListHorizontalItem
                            key={ad._id}
                            advertisement={ad}
                        />
                    ))}
                </View>
            </ScrollView>
        </Layout>
    );
}

const RecentListHorizontalItem = ({ advertisement }) => {
    const { title, images, price, type } = advertisement;

    const navigation = useNavigation();

    function onPress() {
        navigation.navigate(Screen.StudentHomeAdvertisementDetails, {
            advertisement,
        });
    }

    const image = images.length === 0 ? null : images[0];

    return (
        <Pressable onPress={onPress}>
            <Layout style={{ maxWidth: 151 }}>
                <View>
                    <View style={{
                        borderRadius: 20,
                        borderWidth: 0.5,
                        zIndex: 100,
                        width: 151,
                        height: 151
                    }}>
                        {image ? (
                            <Image
                                source={{ uri: image.url }}
                                style={styles.imageStyle}
                            />
                        ) : (
                            <Image
                                source={PLACEHOLDER_IMAGE}
                                style={styles.imageStyle}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "column",
                            rowGap: 5,
                            marginVertical: 3,
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{ fontFamily: "poppins" }}
                        >
                            {title}
                        </Text>
                        {type === "Product" ? (
                            <Text
                                style={{ fontFamily: "poppins" }}
                                fontWeight="medium"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                QAR {price}
                            </Text>
                        ) : null}
                    </View>
                </View>
            </Layout>
        </Pressable>
    );
};

function useAdCarouselAdvertisements(queryFn, queryKey, setLoading) {
    const [advertisements, setAdvertisements] = useState([]);

    const { data } = useQuery({
        queryFn,
        queryKey: [queryKey],
        refetchInterval: 10000,
    });


    useEffect(() => {
        if (!data) {
            return;
        }

        setAdvertisements(data);
    }, [data]);

    return advertisements;
}

function LatestStudentProducts() {
    const title = "Latest Student Products";
    const type = AdvertisementType.Product;
    const userType = UserType.Student;
    const errorMessage = "Could not fetch latest student products";

    const queryFn = useReadLatestAdvertisements(type, userType, errorMessage);
    const queryKey = Query.LatestStudentProducts;

    return <AdCarousel title={title} queryFn={queryFn} queryKey={queryKey} />;
}

function LatestStudentServices() {
    const title = "Latest Student Services";
    const type = AdvertisementType.Service;
    const userType = UserType.Student;
    const errorMessage = "Could not fetch latest student services";

    const queryFn = useReadLatestAdvertisements(type, userType, errorMessage);
    const queryKey = Query.LatestStudentServices;

    return <AdCarousel title={title} queryFn={queryFn} queryKey={queryKey} />;
}

function LatestStudentRequests() {
    const title = "Latest Student Requests";
    const type = AdvertisementType.Request;
    const userType = UserType.Student;
    const errorMessage = "Could not fetch latest student requests";

    const queryFn = useReadLatestAdvertisements(type, userType, errorMessage);
    const queryKey = Query.LatestStudentRequests;

    return <AdCarousel title={title} queryFn={queryFn} queryKey={queryKey} />;
}

function LatestPartnerProducts() {
    const title = "Latest Partner Deals";
    const type = AdvertisementType.Product;
    const userType = UserType.Partner;
    const errorMessage = "Could not fetch latest partner products";

    const queryFn = useReadLatestAdvertisements(type, userType, errorMessage);
    const queryKey = Query.LatestPartnerProducts;

    return <AdCarousel title={title} queryFn={queryFn} queryKey={queryKey} />;
}

function useReadLatestAdvertisements(type, userType, errorMessage) {
    const {
        user: { token: userToken },
    } = useAuth();

    return async () => {
        try {
            const { advertisements: products, error } =
                await API.Advertisement.readLatestAdvertisements(
                    userToken,
                    type,
                    userType
                );

            if (error) {
                return Toast.show(errorMessage, Toast.durations.SHORT);
            }

            return products;
        } catch (error) {
            console.error(error);
            Toast.show(errorMessage, Toast.durations.SHORT);
        }
    };
}

const styles = StyleSheet.create({
    buttonContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        rowGap: 5,
    },
    imageStyle: {
        width: 150,
        height: 150,
        borderRadius: 20,
    }
});
