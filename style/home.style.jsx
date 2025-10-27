import { StyleSheet } from "react-native";
import theme, { COLORS, SIZES } from "./theme";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Colors } from "react-native/Libraries/NewAppScreen";

const style = StyleSheet.create({
    textStyle: {
        fontFamily: "bold",
        fontSize: 40,
    },
    HomeTopContainer: {
        height: 200,
        padding: 20,
        paddingTop: 20,
        backgroundColor: COLORS.primary
    },
    appBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    appBarleft: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        width: 60,
    },

    appBarright: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    SearchContainer: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        alignContent: 'center',
        justifyContent: 'center',
        height: 37
    },
    textInput: {
        padding: 7,
        paddingHorizontal: 7,
        backgroundColor: COLORS.background,
        borderRadius: 50,
        width: '90%',
        height: '100%'


    },
    searchBarcontainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: COLORS.background,
        borderRadius: 50,
        width: '90%',
        height: '100%'

    },
    searchwrapper: {
        flex: 1,
        marginRight: SIZES.small,
        borderRadius: SIZES.small,
    },
    searchIcon: {
        marginHorizontal: 10

    },
    searchCamera: {
        backgroundColor: COLORS.background,
        width: 45,
        borderRadius: 8,
        justifyContent: "center",
        paddingHorizontal: SIZES.small,
        height: '100%'

    },

    homeBody: {
        height: '100%',
        marginTop: -20,
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    }


})

export default style