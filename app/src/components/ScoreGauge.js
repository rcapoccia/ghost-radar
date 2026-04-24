import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { colors } from "../theme";

export function ScoreGauge({ value = 0, label, color }) {
  const animValue = useRef(new Animated.Value(0)).current;
  const displayValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value,
      duration: 1200,
      useNativeDriver: false,
    }).start();
    Animated.timing(displayValue, {
      toValue: value,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const width = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const gaugeColor = color || (value >= 70 ? colors.danger : value >= 40 ? colors.warning : colors.success);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Animated.Text style={[styles.score, { color: gaugeColor }]}>
          {displayValue.interpolate({
            inputRange: [0, 100],
            outputRange: ["0", "100"],
          })}
          %
        </Animated.Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            { width, backgroundColor: gaugeColor, shadowColor: gaugeColor },
          ]}
        />
      </View>
    </View>
  );
}

export function BigScore({ value = 0, label }) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const color = value >= 70 ? colors.danger : value >= 40 ? colors.warning : colors.success;
  const emoji = value >= 70 ? "👻" : value >= 40 ? "⚠️" : "✅";

  return (
    <View style={styles.bigContainer}>
      <Text style={styles.bigEmoji}>{emoji}</Text>
      <Animated.Text style={[styles.bigScore, { color }]}>
        {animValue.interpolate({
          inputRange: [0, 100],
          outputRange: ["0", "100"],
        })}
      </Animated.Text>
      <Text style={[styles.bigLabel, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  score: {
    fontSize: 16,
    fontWeight: "700",
  },
  track: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  bigContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  bigEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  bigScore: {
    fontSize: 72,
    fontWeight: "900",
    letterSpacing: -2,
    lineHeight: 80,
  },
  bigLabel: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 4,
  },
});
