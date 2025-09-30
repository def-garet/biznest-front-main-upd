
import { Dimensions, Text, StyleSheet, View } from 'react-native'
const { height, width } = Dimensions.get('window');

const COLORS = {
  primary: '#172d55',
  secondary: '#2196f3',
  background: '#ffffff',
  text: '#808080',

};


const SIZES = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 44,
  height,
  width
};


const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

function HeadingText({ text, isViewAll }) {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.Header}>{text}</Text>
      {isViewAll ? <Text>View all</Text> : null}
    </View>

  )
}

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  Header: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'outfit-medium',
    marginBottom: 10,
    color: COLORS.text,
  },
})

export { COLORS, SIZES, SHADOWS, HeadingText };
