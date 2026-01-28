# Chefie Pie 🥧

Chefie Pie is a smart meal planning and recipe management application built with React Native and Expo. It leverages AI (Google Gemini) to provide intelligent recipe suggestions, creating meal plans, and chat assistance.

## ✨ Features

-   **AI-Powered Recipe Suggestions**: Get recipe ideas based on ingredients you have (using camera or text input) powered by Google Gemini.
-   **Meal Planning**: Organize your weekly meals with an intuitive planner.
-   **Smart Chatbot**: Chat with an AI chef for cooking tips and substitutions.
-   **Recipe Discovery**: Search and save recipes from Spoonacular.
-   **Voice Commands**: Use voice for hands-free interaction.
-   **Nutrition Tracking**: Monitor calories and nutritional info.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (LTS recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [Expo Go](https://expo.dev/client) app on your physical device OR Android Studio / Xcode for emulators.

## 🚀 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/ChefiePie.git
    cd ChefiePie
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

## ⚙️ Configuration

### 1. Environment Variables
Create a `.env` file in the root directory by copying the example:
```bash
cp .env.example .env
```
Fill in the following API keys in your `.env` file:

-   `EXPO_PUBLIC_SPOONACULAR_API_KEY`: Get from [Spoonacular API](https://spoonacular.com/food-api)
-   `EXPO_PUBLIC_GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/)
-   `EXPO_PUBLIC_UNSPLASH_ACCESS_KEY`: Get from [Unsplash Developers](https://unsplash.com/developers)
-   `EXPO_PUBLIC_FIREBASE_*`: Get from your [Firebase Console](https://console.firebase.google.com/) config.
-   `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`: Web Client ID from Google Cloud Console (for Google Sign-In).

### 2. Firebase & Google Services
This app uses Firebase and Google Sign-In, which requires platform-specific configuration files that are **not handled by git** for security reasons.

-   **Android**: Download `google-services.json` from your Firebase Console (Android App) and place it in the root directory.
-   **iOS**: Download `GoogleService-Info.plist` from your Firebase Console (iOS App) and place it in the root directory.

> **Note:** Without these files, the app may crash or fail to initialize Firebase/Auth features.

## 🏃‍♂️ Running the App

Start the development server:

```bash
npx expo start
```

-   **Physical Device**: Scan the QR code with the Expo Go app (Android) or Camera (iOS).
-   **Emulator**: Press `a` for Android Emulator or `i` for iOS Simulator.

## 📱 Build for Development Client
If you added new native code (e.g. valid when you see `expo run:android`), you might need to build a dev client:

```bash
npx expo run:android
# or
npx expo run:ios
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
[MIT License](LICENSE)
