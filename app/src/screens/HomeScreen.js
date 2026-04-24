import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import RadarAnimation from "../components/RadarAnimation";
import { colors, spacing, radius, typography } from "../theme";

export default function HomeScreen({ navigation }) {
  const handleAnalyze = (type) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Analyze", { analysisType: type });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.tag}>👻 RELATIONSHIP AI</Text>
          <Text style={styles.title}>Ghost{"\n"}Radar</Text>
          <Text style={styles.subtitle}>
            Scopri cosa sta succedendo davvero nella tua relazione.
          </Text>
        </View>

        {/* Radar */}
        <View style={styles.radarContainer}>
          <RadarAnimation size={220} />
          <View style={styles.radarLabel}>
            <Text style={styles.radarText}>Analisi in tempo reale</Text>
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => handleAnalyze("chat")}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              <Text style={styles.btnIcon}>💬</Text>
              <View>
                <Text style={styles.btnTitle}>Analizza Chat</Text>
                <Text style={styles.btnSub}>Incolla conversazione WhatsApp / IG</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.85}
            onPress={() => handleAnalyze("situation")}
          >
            <Text style={styles.btnIcon2}>🧠</Text>
            <View>
              <Text style={styles.btnTitle2}>Descrivi Situazione</Text>
              <Text style={styles.btnSub2}>Racconta cosa sta succedendo</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats / Social Proof */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>87%</Text>
            <Text style={styles.statLabel}>Accuratezza</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>50K+</Text>
            <Text style={styles.statLabel}>Analisi fatte</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>4.8★</Text>
            <Text style={styles.statLabel}>Rating store</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Premium teaser */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Premium")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[`${colors.accent}22`, `${colors.primary}22`]}
            style={styles.premiumTeaser}
          >
            <Text style={styles.premiumIcon}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.premiumTitle}>Sblocca Premium</Text>
              <Text style={styles.premiumSub}>
                Analisi illimitate, pattern avanzati, storia completa
              </Text>
            </View>
            <Text style={styles.premiumArrow}>›</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const FEATURES = [
  {
    icon: "🚨",
    title: "Red Flag Detection",
    desc: "Identifica ghosting, manipolazione e disinteresse nascosto",
  },
  {
    icon: "📊",
    title: "Probabilità Reale",
    desc: "Score di interesse basato su pattern comportamentali",
  },
  {
    icon: "💬",
    title: "Piano d'Azione",
    desc: "Ti dice esattamente cosa fare: scrivi, aspetta o sparisci",
  },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 40 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.lg,
  },
  tag: {
    color: colors.ghost,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    ...typography.h1,
    fontSize: 48,
    color: colors.textPrimary,
    lineHeight: 52,
    marginBottom: 12,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  radarContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  radarLabel: {
    marginTop: 16,
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
  },
  radarText: {
    color: colors.ghost,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
  buttons: {
    paddingHorizontal: spacing.lg,
    gap: 12,
  },
  primaryBtn: {
    borderRadius: radius.lg,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  btnGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: 12,
  },
  btnIcon: { fontSize: 28 },
  btnTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  btnSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 2,
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  btnIcon2: { fontSize: 28 },
  btnTitle2: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  btnSub2: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stat: { flex: 1, alignItems: "center" },
  statNum: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  features: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  featureIcon: { fontSize: 24 },
  featureText: { flex: 1 },
  featureTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  featureDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  premiumTeaser: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: `${colors.accent}40`,
    gap: 12,
  },
  premiumIcon: { fontSize: 24 },
  premiumTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  premiumSub: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  premiumArrow: {
    color: colors.accent,
    fontSize: 24,
    fontWeight: "300",
  },
});
