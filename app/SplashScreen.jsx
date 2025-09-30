import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect, G, Path } from "react-native-svg";
import * as Font from "expo-font";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#172d55",
  secondary: "#2196f3",
  background: "#ffffff",
  text: "#808080",
  gradientStart: "#e3f2fd",
  gradientEnd: "#bbdefb",
  accent: "#64b5f6",
  darkBlue: "#0d1b3a",
};

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedG = Animated.createAnimatedComponent(G);

const SplashScreen = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const wingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        "orbitron-bold": require("../assets/fonts/Orbitron-Bold.ttf"),
        "orbitron-medium": require("../assets/fonts/Orbitron-Medium.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFont();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(wingAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(wingAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) return null;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.6],
  });

  const wingRotation = wingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "20deg"],
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={COLORS.gradientStart} />
            <Stop offset="1" stopColor={COLORS.gradientEnd} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill="url(#bgGradient)" />
      </Svg>

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
          },
        ]}
      >
        <Image
          source={require("../assets/imgs/biznest-new.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.brandName}>BIZNEST</Text>
        <Text style={styles.tagline}>Your one stop local online market</Text>
      </Animated.View>


      <View style={styles.progressContainer}>
        <Svg width={width * 0.6} height="40">
          <Defs>
            <LinearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={COLORS.secondary} />
              <Stop offset="1" stopColor={COLORS.primary} />
            </LinearGradient>
          </Defs>

          <Rect
            x="0"
            y="15"
            width={width * 0.6}
            height="10"
            rx="5"
            ry="5"
            fill="rgba(33, 150, 243, 0.1)"
          />


          <AnimatedRect
            x="0"
            y="15"
            width={progressWidth}
            height="10"
            rx="5"
            ry="5"
            fill="url(#progressGradient)"
          />

          <AnimatedG
            transform={[
              { translateX: progressWidth },
              { translateY: 5 },
            ]}
          >

            <Path
              d="M5 15 Q10 5 20 15 Q10 20 5 15"
              fill={COLORS.secondary}
              stroke="#fff"
              strokeWidth="1"
            />

            <AnimatedG
              origin="12,12"
              style={{
                transform: [{ rotate: wingRotation }],
              }}
            >
              <Path
                d="M10 10 Q12 0 14 10 Q12 14 10 10"
                fill={COLORS.accent}
                stroke="#fff"
                strokeWidth="0.5"
              />
            </AnimatedG>
          </AnimatedG>
        </Svg>
      </View>

      <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
        Loading your experience...
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  brandName: {
    fontFamily: "orbitron-bold",
    fontSize: 32,
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginTop: 10,
    textShadowColor: "rgba(23, 45, 85, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontFamily: "orbitron-medium",
    fontSize: 14,
    color: COLORS.text,
    marginTop: 8,
    letterSpacing: 1,
  },
  progressContainer: {
    position: "absolute",
    bottom: height * 0.12,
    alignSelf: "center",
    width: width * 0.6,
  },
  loadingText: {
    position: "absolute",
    bottom: height * 0.06,
    alignSelf: "center",
    fontFamily: "orbitron-medium",
    fontSize: 12,
    color: COLORS.text,
    letterSpacing: 1,
  },
});

export default SplashScreen;
