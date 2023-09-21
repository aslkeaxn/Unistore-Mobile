import * as Font from 'expo-font';

export const loadFonts = async () => {
    await Font.loadAsync({
        'poppins': require("./assets/fonts/Poppins-Medium.ttf")
    });
};
