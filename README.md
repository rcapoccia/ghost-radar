# 👻 GhostRadar

**L'app AI che analizza le tue relazioni e ti dice la verità.**

Incolla una chat o descrivi la situazione → GhostRadar analizza pattern comportamentali, rileva red flag e ti dice esattamente cosa fare.

## Stack

- **App**: React Native + Expo
- **Backend**: Node.js + Express
- **AI**: Claude (Anthropic) con prompt caching

## Struttura

```
ghost-radar/
├── app/        # React Native Expo
└── backend/    # Node.js API
```

## Setup Locale

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Aggiungi ANTHROPIC_API_KEY nel .env
npm run dev
```

### App

```bash
cd app
npm install
# Modifica src/services/api.js con il tuo IP locale
npx expo start
```

## Build Play Store

```bash
cd app
npm install -g eas-cli
eas login
eas build --platform android --profile production
eas submit --platform android
```

## Deploy Backend

Consigliato: **Railway** o **Render** (free tier disponibile)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)
