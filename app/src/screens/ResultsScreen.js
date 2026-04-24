import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { BigScore, ScoreGauge } from "../components/ScoreGauge";
import { colors, spacing, radius, typography } from "../theme";

const ACTION_CONFIG = {
  scrivi_ora: { emoji: "✍️", color: colors.success, label: "SCRIVI ORA" },
  aspetta: { emoji: "⏳", color: colors.warning, label: "ASPETTA" },
  vai_avanti: { emoji: "👋", color: colors.danger, label: "VAI AVANTI" },
  blocca_e_sparisci: { emoji: "🚫", color: colors.dangerDark, label: "BLOCCALO/A" },
};

const URGENCY_CONFIG = {
  bassa: { color: colors.success, label: "Bassa urgenza" },
  media: { color: colors.warning, label: "Urgenza media" },
  alta: { color: colors.danger, label: "Alta urgenza" },
  critica: { color: colors.dangerDark, label: "CRITICA" },
};

export default function ResultsScreen({ navigation, route }) {
  const { analysis, analysisType } = route.params || {};

  if (!analysis) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.textPrimary }}>Nessuna analisi disponibile.</Text>
      </View>
    );
  }

  const action = ACTION_CONFIG[analysis.recommendation?.action] || ACTION_CONFIG.aspetta;
  const urgency = URGENCY_CONFIG[analysis.urgency] || URGENCY_CONFIG.media;

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `👻 GhostRadar – Analisi relazione\n\nGhost Score: ${analysis.ghostScore}%\nInteresse: ${analysis.interestScore}%\n\n"${analysis.verdict}"\n\n${analysis.summary}\n\n🔍 Analizza anche tu su GhostRadar`,
        title: "GhostRadar – La mia analisi",
      });
    } catch (err) {
      Alert.alert("Errore", "Impossibile condividere.");
    }
  };

  const handleNewAnalysis = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Analyze", { analysisType });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.back}>
            <Text style={styles.backText}>← Home</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Risultati</Text>
          <View style={[styles.urgencyBadge, { borderColor: urgency.color, backgroundColor: `${urgency.color}20` }]}>
            <Text style={[styles.urgencyText, { color: urgency.color }]}>{urgency.label}</Text>
          </View>
        </View>

        {/* Verdict */}
        <LinearGradient
          colors={[`${colors.bgCard}`, `${colors.bgCardAlt}`]}
          style={styles.verdictCard}
        >
          <Text style={styles.verdictLabel}>VERDETTO</Text>
          <Text style={styles.verdictText}>"{analysis.verdict}"</Text>
        </LinearGradient>

        {/* Big Score */}
        <View style={styles.scoresRow}>
          <View style={styles.scoreBlock}>
            <BigScore value={analysis.ghostScore} label="GHOST SCORE" />
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreBlock}>
            <BigScore
              value={analysis.interestScore}
              label="INTERESSE"
            />
          </View>
        </View>

        {/* Score Gauges */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📈 Probabilità</Text>
          <ScoreGauge
            value={analysis.ghostScore}
            label="Probabilità di ghosting"
            color={analysis.ghostScore >= 70 ? colors.danger : analysis.ghostScore >= 40 ? colors.warning : colors.success}
          />
          <ScoreGauge
            value={analysis.interestScore}
            label="Interesse genuino"
            color={analysis.interestScore >= 60 ? colors.success : analysis.interestScore >= 30 ? colors.warning : colors.danger}
          />
        </View>

        {/* Recommendation */}
        <LinearGradient
          colors={[`${action.color}20`, `${action.color}08`]}
          style={[styles.card, { borderColor: `${action.color}40` }]}
        >
          <Text style={styles.cardTitle}>💡 Cosa fare</Text>
          <View style={styles.actionRow}>
            <Text style={styles.actionEmoji}>{action.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
              <Text style={styles.actionText}>{analysis.recommendation?.text}</Text>
            </View>
          </View>
          {analysis.recommendation?.reason && (
            <Text style={styles.actionReason}>Perché: {analysis.recommendation.reason}</Text>
          )}
        </LinearGradient>

        {/* Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔍 Analisi</Text>
          <Text style={styles.summaryText}>{analysis.summary}</Text>
        </View>

        {/* Red Flags */}
        {analysis.redFlags?.length > 0 && (
          <View style={[styles.card, styles.redCard]}>
            <Text style={styles.cardTitle}>🚩 Red Flag ({analysis.redFlags.length})</Text>
            {analysis.redFlags.map((flag, i) => (
              <View key={i} style={styles.flagRow}>
                <Text style={styles.flagDot}>●</Text>
                <Text style={styles.redText}>{flag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Green Flags */}
        {analysis.greenFlags?.length > 0 && (
          <View style={[styles.card, styles.greenCard]}>
            <Text style={styles.cardTitle}>✅ Green Flag ({analysis.greenFlags.length})</Text>
            {analysis.greenFlags.map((flag, i) => (
              <View key={i} style={styles.flagRow}>
                <Text style={[styles.flagDot, { color: colors.success }]}>●</Text>
                <Text style={styles.greenText}>{flag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Manipulation Signs */}
        {analysis.manipulationSigns?.length > 0 && (
          <View style={[styles.card, { borderColor: `${colors.accent}40` }]}>
            <Text style={styles.cardTitle}>⚠️ Segnali di Manipolazione</Text>
            {analysis.manipulationSigns.map((sign, i) => (
              <View key={i} style={styles.flagRow}>
                <Text style={[styles.flagDot, { color: colors.accent }]}>●</Text>
                <Text style={[styles.redText, { color: colors.accent }]}>{sign}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Behavior Patterns */}
        {analysis.behaviorPatterns?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🧩 Pattern Comportamentali</Text>
            {analysis.behaviorPatterns.map((pattern, i) => (
              <View key={i} style={styles.flagRow}>
                <Text style={[styles.flagDot, { color: colors.ghost }]}>●</Text>
                <Text style={styles.patternText}>{pattern}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <Text style={styles.shareBtnText}>📤 Condividi Risultati</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.newBtn}
            onPress={handleNewAnalysis}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.newBtnGradient}
            >
              <Text style={styles.newBtnText}>🔍 Nuova Analisi</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 48 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  back: { marginRight: "auto" },
  backText: { color: colors.ghost, fontSize: 15, fontWeight: "600" },
  title: { ...typography.h2, color: colors.textPrimary },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  urgencyText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  verdictCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  verdictLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  verdictText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    fontStyle: "italic",
    lineHeight: 26,
  },
  scoresRow: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  scoreBlock: { flex: 1 },
  scoreDivider: { width: 1, backgroundColor: colors.border },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  redCard: { borderColor: `${colors.danger}30` },
  greenCard: { borderColor: `${colors.success}30` },
  summaryText: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 8,
  },
  actionEmoji: { fontSize: 28 },
  actionLabel: { fontSize: 13, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  actionText: { color: colors.textPrimary, fontSize: 15, lineHeight: 22, marginTop: 4 },
  actionReason: { color: colors.textMuted, fontSize: 12, lineHeight: 18, fontStyle: "italic" },
  flagRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  flagDot: { color: colors.danger, fontSize: 10, marginTop: 4 },
  redText: { color: colors.textPrimary, fontSize: 14, lineHeight: 20, flex: 1 },
  greenText: { color: colors.textPrimary, fontSize: 14, lineHeight: 20, flex: 1 },
  patternText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, flex: 1 },
  actions: {
    paddingHorizontal: spacing.lg,
    gap: 12,
    marginTop: spacing.sm,
  },
  shareBtn: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  shareBtnText: { color: colors.textPrimary, fontSize: 16, fontWeight: "600" },
  newBtn: {
    borderRadius: radius.lg,
    overflow: "hidden",
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  newBtnGradient: { paddingVertical: 18, alignItems: "center" },
  newBtnText: { color: colors.textPrimary, fontSize: 17, fontWeight: "700" },
});
