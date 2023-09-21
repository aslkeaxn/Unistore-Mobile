import {
    BannerAd,
    BannerAdSize,
    TestIds,
} from "react-native-google-mobile-ads";
import AdMobId from "../constants/admob-id";

export default function AdBanner() {
    const adUnitId = TestIds.BANNER; //AdMobId.android;

    return (
        <BannerAd
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
                requestNonPersonalizedAdsOnly: true,
            }}
        />
    );
}
