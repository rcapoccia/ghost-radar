import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { colors } from "../theme";

export default function RadarAnimation({ size = 220 }) {
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;
  const ring3 = useRef(new Animated.Value(0)).current;
  const scanRotate = useRef(new Animated.Value(0)).current;
  const blip1 = useRef(new Animated.Value(0)).current;
  const blip2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = (ref, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(ref, {
            toValue: 1,
            duration: 2200,
            useNativeDriver: true,
          }),
          Animated.timing(ref, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

    const scan = Animated.loop(
      Animated.timing(scanRotate, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    const blipAnim = (ref, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(ref, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(ref, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.delay(3000),
        ])
      );

    pulse(ring1, 0).start();
    pulse(ring2, 700).start();
    pulse(ring3, 1400).start();
    scan.start();
    blipAnim(blip1, 800).start();
    blipAnim(blip2, 2100).start();
  }, []);

  const spin = scanRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const r = size / 2;

  const ringStyle = (anim) => ({
    opacity: anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.5, 0] }),
    transform: [
      {
        scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
      },
    ],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer rings */}
      <View style={[styles.circle, styles.ringOuter, { width: size, height: size, borderRadius: r }]} />
      <View style={[styles.circle, styles.ringMid, { width: size * 0.66, height: size * 0.66, borderRadius: r * 0.66, marginLeft: r * 0.17, marginTop: r * 0.17 }]} />
      <View style={[styles.circle, styles.ringInner, { width: size * 0.33, height: size * 0.33, borderRadius: r * 0.33, marginLeft: r * 0.335, marginTop: r * 0.335 }]} />

      {/* Crosshair lines */}
      <View style={[styles.crossH, { top: r, width: size }]} />
      <View style={[styles.crossV, { left: r, height: size }]} />

      {/* Pulse rings */}
      <Animated.View
        style={[
          styles.pulseRing,
          { width: size, height: size, borderRadius: r },
          ringStyle(ring1),
        ]}
      />
      <Animated.View
        style={[
          styles.pulseRing,
          { width: size, height: size, borderRadius: r },
          ringStyle(ring2),
        ]}
      />
      <Animated.View
        style={[
          styles.pulseRing,
          { width: size, height: size, borderRadius: r },
          ringStyle(ring3),
        ]}
      />

      {/* Scan sweep */}
      <Animated.View
        style={[
          styles.scanSweep,
          { width: r, height: size, top: 0, left: r },
          { transform: [{ rotate: spin }, { translateX: -r / 2 }] },
        ]}
      />

      {/* Blips */}
      <Animated.View
        style={[
          styles.blip,
          { opacity: blip1, left: r + r * 0.3, top: r - r * 0.4 },
        ]}
      />
      <Animated.View
        style={[
          styles.blip,
          { opacity: blip2, left: r - r * 0.5, top: r + r * 0.2, backgroundColor: colors.accent },
        ]}
      />

      {/* Center dot */}
      <View style={[styles.center, { left: r - 5, top: r - 5 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  circle: {
    position: "absolute",
    borderWidth: 1,
    borderColor: `${colors.primary}55`,
    backgroundColor: "transparent",
  },
  ringOuter: { borderColor: `${colors.primary}33` },
  ringMid: { borderColor: `${colors.primary}44` },
  ringInner: { borderColor: `${colors.primary}66` },
  crossH: {
    position: "absolute",
    height: 1,
    backgroundColor: `${colors.primary}22`,
  },
  crossV: {
    position: "absolute",
    width: 1,
    backgroundColor: `${colors.primary}22`,
  },
  pulseRing: {
    position: "absolute",
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  scanSweep: {
    position: "absolute",
    backgroundColor: `${colors.primary}18`,
    transformOrigin: "0% 50%",
  },
  blip: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  center: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
});
