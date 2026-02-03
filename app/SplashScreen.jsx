// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   StyleSheet,
//   Text,
//   StatusBar,
//   Animated,
//   Dimensions,
//   Image,
// } from "react-native";
// import Svg, { Defs, LinearGradient, Stop, Rect, G, Path } from "react-native-svg";
// import * as Font from "expo-font";

// const { width, height } = Dimensions.get("window");

// const COLORS = {
//   primary: "#172d55",
//   secondary: "#2196f3",
//   background: "#ffffff",
//   text: "#808080",
//   gradientStart: "#e3f2fd",
//   gradientEnd: "#bbdefb",
//   accent: "#64b5f6",
//   darkBlue: "#0d1b3a",
// };

// const AnimatedRect = Animated.createAnimatedComponent(Rect);
// const AnimatedG = Animated.createAnimatedComponent(G);

// const SplashScreen = ({ navigation }) => {
//   const [fontsLoaded, setFontsLoaded] = useState(false);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const progressAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.8)).current;
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const wingAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const loadFont = async () => {
//       await Font.loadAsync({
//         "orbitron-bold": require("../assets/fonts/Orbitron-Bold.ttf"),
//         "orbitron-medium": require("../assets/fonts/Orbitron-Medium.ttf"),
//       });
//       setFontsLoaded(true);
//     };
//     loadFont();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.05,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(wingAnim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(wingAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();

//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 5,
//         useNativeDriver: true,
//       }),
//       Animated.timing(progressAnim, {
//         toValue: 1,
//         duration: 2500,
//         useNativeDriver: false,
//       }),
//     ]).start();

//     const timer = setTimeout(() => {
//       navigation.replace("Home");
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, []);

//   if (!fontsLoaded) return null;

//   const progressWidth = progressAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, width * 0.6],
//   });

//   const wingRotation = wingAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "20deg"],
//   });

//   return (
//     <View style={styles.container}>
//       <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

//       <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
//         <Defs>
//           <LinearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
//             <Stop offset="0" stopColor={COLORS.gradientStart} />
//             <Stop offset="1" stopColor={COLORS.gradientEnd} />
//           </LinearGradient>
//         </Defs>
//         <Rect x="0" y="0" width={width} height={height} fill="url(#bgGradient)" />
//       </Svg>

//       {/* Logo */}
//       <Animated.View
//         style={[
//           styles.logoContainer,
//           {
//             opacity: fadeAnim,
//             transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
//           },
//         ]}
//       >
//         <Image
//           source={require("../assets/imgs/biznest-new.png")}
//           style={styles.logoImage}
//           resizeMode="contain"
//         />
//         <Text style={styles.brandName}>BIZNEST</Text>
//         <Text style={styles.tagline}>Your one stop local online market</Text>
//       </Animated.View>


//       <View style={styles.progressContainer}>
//         <Svg width={width * 0.6} height="40">
//           <Defs>
//             <LinearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
//               <Stop offset="0" stopColor={COLORS.secondary} />
//               <Stop offset="1" stopColor={COLORS.primary} />
//             </LinearGradient>
//           </Defs>

//           <Rect
//             x="0"
//             y="15"
//             width={width * 0.6}
//             height="10"
//             rx="5"
//             ry="5"
//             fill="rgba(33, 150, 243, 0.1)"
//           />


//           <AnimatedRect
//             x="0"
//             y="15"
//             width={progressWidth}
//             height="10"
//             rx="5"
//             ry="5"
//             fill="url(#progressGradient)"
//           />

//           <AnimatedG
//             transform={[
//               { translateX: progressWidth },
//               { translateY: 5 },
//             ]}
//           >

//             <Path
//               d="M5 15 Q10 5 20 15 Q10 20 5 15"
//               fill={COLORS.secondary}
//               stroke="#fff"
//               strokeWidth="1"
//             />

//             <AnimatedG
//               origin="12,12"
//               style={{
//                 transform: [{ rotate: wingRotation }],
//               }}
//             >
//               <Path
//                 d="M10 10 Q12 0 14 10 Q12 14 10 10"
//                 fill={COLORS.accent}
//                 stroke="#fff"
//                 strokeWidth="0.5"
//               />
//             </AnimatedG>
//           </AnimatedG>
//         </Svg>
//       </View>

//       <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
//         Loading your experience...
//       </Animated.Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "transparent",
//   },
//   logoContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logoImage: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   brandName: {
//     fontFamily: "orbitron-bold",
//     fontSize: 32,
//     color: COLORS.primary,
//     letterSpacing: 1.5,
//     marginTop: 10,
//     textShadowColor: "rgba(23, 45, 85, 0.2)",
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 4,
//   },
//   tagline: {
//     fontFamily: "orbitron-medium",
//     fontSize: 14,
//     color: COLORS.text,
//     marginTop: 8,
//     letterSpacing: 1,
//   },
//   progressContainer: {
//     position: "absolute",
//     bottom: height * 0.12,
//     alignSelf: "center",
//     width: width * 0.6,
//   },
//   loadingText: {
//     position: "absolute",
//     bottom: height * 0.06,
//     alignSelf: "center",
//     fontFamily: "orbitron-medium",
//     fontSize: 12,
//     color: COLORS.text,
//     letterSpacing: 1,
//   },
// });

// export default SplashScreen;

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Animated,
  Dimensions,
  Image,
  Easing,
} from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import * as Font from "expo-font";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

// Market/Shop Theme Colors (Bright & Clean)
const COLORS = {
  primary: "#172d55",      // Brand Navy
  secondary: "#2196f3",    // Action Blue
  accent: "#FF9800",       // Orange (common for 'Buy' buttons/Carts)
  backgroundTop: "#ffffff",
  backgroundBottom: "#e3f2fd", // Very light blue
  text: "#333333",
  subText: "#666666",
};

// Import your actual product assets here
const PRODUCT_IMAGES = [
  require("../assets/products/mango.png"),
  require("../assets/products/corn.png"),
  require("../assets/products/tapa.png"), // Assuming you have this
  require("../assets/products/tocino.png"), // Assuming you have this
  require("../assets/products/wallet.png"), // Shows variety
];

const SplashScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Animation Values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const cartSlide = useRef(new Animated.Value(-100)).current;
  const textFade = useRef(new Animated.Value(0)).current;

  // Create animated values for each product
  const productAnims = useRef(PRODUCT_IMAGES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const loadFont = async () => {
      try {
        await Font.loadAsync({
          "orbitron-bold": require("../assets/fonts/Orbitron-Bold.ttf"),
          "orbitron-medium": require("../assets/fonts/Orbitron-Medium.ttf"),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
        setFontsLoaded(true);
      }
    };
    loadFont();

    // 1. Logo Appearance
    Animated.parallel([
        Animated.spring(logoScale, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        })
    ]).start();

    // 2. Products "Pop" out after logo
    const productAnimations = productAnims.map((anim, index) => {
        return Animated.spring(anim, {
            toValue: 1,
            friction: 5,
            tension: 50,
            delay: 400 + (index * 150), // Staggered effect
            useNativeDriver: true,
        });
    });

    Animated.stagger(100, productAnimations).start();

    // 3. Cart slides in & Text fades
    Animated.parallel([
        Animated.timing(cartSlide, {
            toValue: 0,
            duration: 1000,
            delay: 1000,
            easing: Easing.out(Easing.back(1.5)), // Bounces slightly past then back
            useNativeDriver: true,
        }),
        Animated.timing(textFade, {
            toValue: 1,
            duration: 1000,
            delay: 1200,
            useNativeDriver: true,
        })
    ]).start();

    // Navigate away
    const timer = setTimeout(() => {
      navigation.replace("Home"); // Or "CustomerLogin" depending on your flow
    }, 3800);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) return null;

  // Helper to position products in a circle/arc around the logo
  const getProductStyle = (index, total) => {
    const angle = (index / total) * 2 * Math.PI - (Math.PI / 2); // Spread in circle
    const radius = 110; // Distance from center
    
    // Final position
    const translateX = Math.cos(angle) * radius;
    const translateY = Math.sin(angle) * radius;

    // Interpolate animation 0 -> 1 to move from Center -> Out
    const moveX = productAnims[index].interpolate({
        inputRange: [0, 1],
        outputRange: [0, translateX]
    });
    const moveY = productAnims[index].interpolate({
        inputRange: [0, 1],
        outputRange: [0, translateY]
    });
    const scale = productAnims[index].interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    });

    return {
        transform: [{ translateX: moveX }, { translateY: moveY }, { scale }],
        opacity: productAnims[index],
        position: 'absolute',
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Bright Market Gradient Background */}
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={COLORS.backgroundTop} />
            <Stop offset="1" stopColor={COLORS.backgroundBottom} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill="url(#bgGradient)" />
      </Svg>

      <View style={styles.centerContainer}>
        
        {/* Orbiting Products */}
        {PRODUCT_IMAGES.map((img, index) => (
            <Animated.Image 
                key={index} 
                source={img} 
                style={[styles.productImage, getProductStyle(index, PRODUCT_IMAGES.length)]} 
            />
        ))}

        {/* Main Logo */}
        <Animated.View style={[styles.logoWrapper, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
            <Image
                source={require("../assets/imgs/biznest-new.png")}
                style={styles.logoImage}
                resizeMode="contain"
            />
        </Animated.View>

      </View>

      {/* Footer Text & Cart Animation */}
      <View style={styles.footerContainer}>
        <Animated.View style={{ transform: [{ translateX: cartSlide }], marginBottom: 10 }}>
             <Ionicons name="cart" size={40} color={COLORS.accent} />
        </Animated.View>

        <Animated.View style={{ opacity: textFade, alignItems: 'center' }}>
            <Text style={styles.brandName}>BIZNEST</Text>
            <Text style={styles.tagline}>LOCAL • FRESH • CONVENIENT</Text>
            <View style={styles.loaderLine} />
            <Text style={styles.loadingText}>Opening the marketplace...</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundTop,
  },
  centerContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrapper: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 80,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    zIndex: 10, // Keep logo on top
  },
  logoImage: {
    width: 130,
    height: 130,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    resizeMode: 'contain',
    zIndex: 1, // Behind logo initially
  },
  footerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  brandName: {
    fontFamily: "orbitron-bold",
    fontSize: 36,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  tagline: {
    fontFamily: "orbitron-medium",
    fontSize: 12,
    color: COLORS.subText,
    marginTop: 5,
    marginBottom: 20,
    letterSpacing: 3,
  },
  loaderLine: {
      width: 40,
      height: 4,
      backgroundColor: COLORS.secondary,
      borderRadius: 2,
      marginBottom: 10,
  },
  loadingText: {
    fontFamily: "orbitron-medium",
    fontSize: 10,
    color: "#999",
  },
});

export default SplashScreen;
