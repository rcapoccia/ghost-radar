import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { analyzeRelationship } from "../services/api";
import { colors, spacing, radius, typography } from "../theme";

const CHAT_PLACEHOLDER = `Incolla qui la tua chat...

Esempio:
[10:30] Marco: Ciao! Come stai?
[10:45] Tu: Bene grazie, e tu?
[11:20] Marco: Sì tutto ok
[Letto ✓✓]
...`;

const SITUATION_PLACEHOLDER = `Descrivi la situazione nel dettaglio...

Esempio: "Ci siamo visti 3 settimane fa e sembrava tutto ok, ma da quando ho proposto di rivederci risponde solo con messaggi brevi dopo ore. Prima mi scriveva sempre per primo e ora..."`;

const SITUATION_PROMPTS = [
  "Da quanto tempo vi conoscete?",
  "Cosa è cambiato ultimamente nel suo comportamento?",
  "Quante volte vi siete visti/e di persona?",
  "Cosa ti preoccupa di più?",
];

export default function AnalyzeScreen({ navigation, route }) {
  const { analysisType: initialType } = route.params || {};
  const [analysisType, setAnalysisType] = useState(initialType || "chat");
  const [content, setContent] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContextInput, setShowContextInput] = useState(false);

  const charCount = content.length;
  const maxChars = 8000;
  const isReady = content.trim().length >= 20;

  const handleAnalyze = async () => {
    if (!isReady) {
      Alert.alert("Contenuto troppo breve", "Aggiungi almeno 20 caratteri per un'analisi accurata.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setLoading(true);
    try {
      const analysis = await analyzeRelationship({ content, analysisType, context });
      navigation.navigate("Results", { analysis, analysisType });
    } catch (err) {
      Alert.alert("Errore", err.message || "Qualcosa è andato storto. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>← Indietro</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nuova Analisi</Text>
          <Text style={styles.subtitle}>
            Più dettagli fornisci, più precisa sarà l'analisi.
          </Text>
        </View>

        {/* Toggle */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, analysisType === "chat" && styles.toggleActive]}
            onPress={() => { setAnalysisType("chat"); setContent(""); }}
          >
            <Text style={[styles.toggleText, analysisType === "chat" && styles.toggleTextActive]}>
              💬 Chat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, analysisType === "situation" && styles.toggleActive]}
            onPress={() => { setAnalysisType("situation"); setContent(""); }}
          >
            <Text style={[styles.toggleText, analysisType === "situation" && styles.toggleTextActive]}>
              🧠 Situazione
            </Text>
          </TouchableOpacity>
        </View>

        {/* Situation prompts */}
        {analysisType === "situation" && (
          <View style={styles.promptsContainer}>
            <Text style={styles.promptsTitle}>Suggerimenti da includere:</Text>
            {SITUATION_PROMPTS.map((p, i) => (
              <Text key={i} style={styles.prompt}>• {p}</Text>
            ))}
          </View>
        )}

        {/* Main input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={analysisType === "chat" ? CHAT_PLACEHOLDER : SITUATION_PLACEHOLDER}
            placeholderTextColor={colors.textMuted}
            multiline
            value={content}
            onChangeText={(t) => setContent(t.slice(0, maxChars))}
            textAlignVertical="top"
            selectionColor={colors.primary}
          />
          <View style={styles.charCountRow}>
            <Text style={[styles.charCount, charCount > maxChars * 0.9 && { color: colors.warning }]}>
              {charCount}/{maxChars}
            </Text>
          </View>
        </View>

        {/* Optional context */}
        <TouchableOpacity
          onPress={() => setShowContextInput(!showContextInput)}
          style={styles.contextToggle}
        >
          <Text style={styles.contextToggleText}>
            {showContextInput ? "▼" : "▶"} Aggiungi contesto opzionale
          </Text>
        </TouchableOpacity>

        {showContextInput && (
          <TextInput
            style={styles.contextInput}
            placeholder="Età, quanto vi conoscete, storia relazionale..."
            placeholderTextColor={colors.textMuted}
            multiline
            value={context}
            onChangeText={setContext}
            maxLength={500}
            textAlignVertical="top"
            selectionColor={colors.primary}
          />
        )}

        {/* Analyze Button */}
        <TouchableOpacity
          onPress={handleAnalyze}
          disabled={!isReady || loading}
          activeOpacity={0.85}
          style={[styles.analyzeBtn, (!isReady || loading) && styles.analyzeBtnDisabled]}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={colors.textPrimary} size="small" />
              <Text style={styles.analyzeBtnText}>Analisi in corso...</Text>
            </View>
          ) : (
            <LinearGradient
              colors={isReady ? [colors.primary, colors.accent] : [colors.bgCardAlt, colors.bgCardAlt]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.analyzeGradient}
            >
              <Text style={styles.analyzeBtnText}>
                {isReady ? "🔍 Avvia Analisi" : "Scrivi qualcosa..."}
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          🔒 La tua chat viene analizzata e non viene salvata sui nostri server.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 40 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.md,
  },
  back: { marginBottom: spacing.md },
  backText: { color: colors.ghost, fontSize: 15, fontWeight: "600" },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: 6 },
  subtitle: { ...typography.body, color: colors.textSecondary },
  toggle: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: 4,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: radius.md,
  },
  toggleActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  toggleText: { color: colors.textSecondary, fontSize: 14, fontWeight: "600" },
  toggleTextActive: { color: colors.textPrimary },
  promptsContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: `${colors.primary}15`,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  promptsTitle: {
    color: colors.ghost,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  prompt: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  inputContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 200,
    padding: spacing.md,
  },
  charCountRow: {
    alignItems: "flex-end",
    paddingHorizontal: spacing.md,
    paddingBottom: 10,
  },
  charCount: {
    color: colors.textMuted,
    fontSize: 11,
  },
  contextToggle: {
    marginHorizontal: spacing.lg,
    marginBottom: 8,
  },
  contextToggleText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
  },
  contextInput: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    fontSize: 14,
    minHeight: 80,
    padding: spacing.md,
    textAlignVertical: "top",
  },
  analyzeBtn: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  analyzeBtnDisabled: { opacity: 0.6, elevation: 0, shadowOpacity: 0 },
  analyzeGradient: { paddingVertical: 18, alignItems: "center" },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCardAlt,
    paddingVertical: 18,
    justifyContent: "center",
    gap: 10,
  },
  analyzeBtnText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  disclaimer: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    lineHeight: 18,
  },
});
