import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { colors, spacing, radius, typography } from "../theme";

const PLANS = [
  {
    id: "monthly",
    label: "Mensile",
    price: "€4,99",
    period: "/mese",
    popular: false,
    description: "Cancella quando vuoi",
  },
  {
    id: "yearly",
    label: "Annuale",
    price: "€2,99",
    period: "/mese",
    badge: "MIGLIOR PREZZO",
    popular: true,
    description: "€35,99 fatturati annualmente",
  },
  {
    id: "lifetime",
    label: "A vita",
    price: "€49,99",
    period: "una tantum",
    popular: false,
    description: "Paghi una volta, per sempre",
  },
];

const FEATURES_FREE = [
  "3 analisi al giorno",
  "Red flag base",
  "Score di interesse",
  "Consiglio azione",
];

const FEATURES_PREMIUM = [
  "Analisi ILLIMITATE",
  "Pattern comportamentali avanzati",
  "Segnali di manipolazione",
  "Storia analisi completa",
  "Confronto nel tempo",
  "Analisi multi-persona",
  "Export report PDF",
  "Supporto prioritario",
];

export default function PremiumScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  const handlePurchase = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Premium in arrivo! ⚡",
      "Il pagamento in-app sarà disponibile al lancio ufficiale.\n\nSei tra i primi utenti — riceverai accesso gratuito al lancio!",
      [{ text: "OK, ottimo!", style: "default" }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[`${colors.accent}30`, `${colors.primary}20`, colors.bg]}
          style={styles.headerGradient}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>← Indietro</Text>
          </TouchableOpacity>
          <Text style={styles.emoji}>⚡</Text>
          <Text style={styles.title}>Ghost Radar{"\n"}Premium</Text>
          <Text style={styles.subtitle}>
            Smetti di indovinare. Ottieni la verità.
          </Text>
        </LinearGradient>

        {/* Comparison */}
        <View style={styles.comparisonRow}>
          <View style={styles.compCol}>
            <Text style={styles.compTitle}>Gratis</Text>
            {FEATURES_FREE.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.checkGray}>✓</Text>
                <Text style={styles.featureFree}>{f}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.compCol, styles.compColPremium]}>
            <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.premiumTitleGrad}>
              <Text style={styles.compTitlePremium}>Premium ⚡</Text>
            </LinearGradient>
            {FEATURES_PREMIUM.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.checkPurple}>✓</Text>
                <Text style={styles.featurePremium}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Plans */}
        <Text style={styles.sectionTitle}>Scegli il tuo piano</Text>
        <View style={styles.plans}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
                plan.popular && styles.planCardPopular,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedPlan(plan.id);
              }}
              activeOpacity={0.85}
            >
              {plan.badge && (
                <View style={styles.planBadge}>
                  <Text style={styles.planBadgeText}>{plan.badge}</Text>
                </View>
              )}
              <Text style={styles.planLabel}>{plan.label}</Text>
              <View style={styles.planPriceRow}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </View>
              <Text style={styles.planDesc}>{plan.description}</Text>
              {selectedPlan === plan.id && (
                <View style={styles.planSelected}>
                  <Text style={styles.planSelectedText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={handlePurchase}
          activeOpacity={0.85}
          style={styles.ctaBtn}
        >
          <LinearGradient
            colors={[colors.accent, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Sblocca Premium ⚡</Text>
            <Text style={styles.ctaSub}>Cancella in qualsiasi momento</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.legal}>
          L'abbonamento si rinnova automaticamente. Puoi cancellare dalle impostazioni del tuo account Google Play. Nessun rimborso per periodi parziali.
        </Text>

        {/* Social proof */}
        <View style={styles.reviews}>
          {REVIEWS.map((r, i) => (
            <View key={i} style={styles.review}>
              <Text style={styles.reviewStars}>★★★★★</Text>
              <Text style={styles.reviewText}>"{r.text}"</Text>
              <Text style={styles.reviewAuthor}>— {r.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const REVIEWS = [
  { text: "Mi ha aperto gli occhi su una relazione che stava andando storta. Indispensabile.", name: "Giulia M., Milano" },
  { text: "Finalmente un'app che mi dice la verità senza girarci intorno.", name: "Luca R., Roma" },
  { text: "Ho capito in 5 minuti quello che non riuscivo a vedere da mesi.", name: "Sara P., Napoli" },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 40 },
  headerGradient: {
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  back: { marginBottom: spacing.lg },
  backText: { color: colors.ghost, fontSize: 15, fontWeight: "600" },
  emoji: { fontSize: 48, marginBottom: 8 },
  title: {
    ...typography.h1,
    fontSize: 36,
    color: colors.textPrimary,
    lineHeight: 42,
    marginBottom: 10,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  comparisonRow: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    gap: 10,
  },
  compCol: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compColPremium: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  compTitle: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  premiumTitleGrad: {
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  compTitlePremium: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  featureRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 6,
    alignItems: "flex-start",
  },
  checkGray: { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  checkPurple: { color: colors.primary, fontSize: 12, marginTop: 1 },
  featureFree: { color: colors.textMuted, fontSize: 12, flex: 1, lineHeight: 18 },
  featurePremium: { color: colors.textPrimary, fontSize: 12, flex: 1, lineHeight: 18 },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  plans: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    gap: 8,
    marginBottom: spacing.lg,
  },
  planCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
  },
  planCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  planCardPopular: {
    borderColor: colors.primary,
  },
  planBadge: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  planBadgeText: { color: colors.textPrimary, fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  planLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: "600", marginBottom: 4 },
  planPriceRow: { flexDirection: "row", alignItems: "flex-end", gap: 2, marginBottom: 2 },
  planPrice: { color: colors.textPrimary, fontSize: 20, fontWeight: "800" },
  planPeriod: { color: colors.textMuted, fontSize: 11, marginBottom: 2 },
  planDesc: { color: colors.textMuted, fontSize: 10, lineHeight: 14 },
  planSelected: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  planSelectedText: { color: colors.textPrimary, fontSize: 10, fontWeight: "800" },
  ctaBtn: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    marginBottom: spacing.md,
  },
  ctaGradient: { paddingVertical: 20, alignItems: "center" },
  ctaText: { color: colors.textPrimary, fontSize: 18, fontWeight: "800" },
  ctaSub: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 3 },
  legal: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
    lineHeight: 16,
    marginBottom: spacing.xl,
  },
  reviews: { paddingHorizontal: spacing.lg, gap: 10 },
  review: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewStars: { color: colors.warning, fontSize: 14, marginBottom: 4 },
  reviewText: { color: colors.textPrimary, fontSize: 13, lineHeight: 20, fontStyle: "italic" },
  reviewAuthor: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
});
