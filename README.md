# 🕌 Khutba AI — Smart Reflection on Islamic Sermons

Khutba AI is a cross-platform mobile application built with **React Native** that allows users to upload their khutbah (Islamic sermon) audio recordings and receive meaningful AI-generated summaries and reflections. It is designed to promote spiritual growth by helping users reflect on the messages of khutbahs, track weekly goals, and engage in continuous self-improvement.

---

## 📱 Features

### 🔊 Audio Upload & Reflection
- Upload khutbah audio (MP3/WAV)
- AI analyzes content and provides reflections
- Summarized output in plain, easy-to-understand text

### 🎯 Weekly Goals
- Users can set and track weekly spiritual goals
- Reflect on khutbahs and compare with set intentions

### 👤 User Accounts & Plan Management
- Register/login functionality
- AsyncStorage stores user data locally
- Demo Plan → Directs to Home screen  
- Premium Plan → Unlocks full features (e.g., AI summaries)

### ⚙️ Profile Management
- Upload profile image
- View full name from AsyncStorage
- Drawer navigation with user info and settings link

---

## 🛠️ Tech Stack

| Layer         | Technology                     |
| ------------- | ------------------------------ |
| Frontend      | React Native                   |
| Backend       | Flask (Python)                 |
| Database      | MySQL                          |
| State Mgmt    | AsyncStorage                   |
| Networking    | Axios                          |
| ML/NLP        | Hugging Face Transformers (BERT) |
| Hosting (Optional) | Render, Vercel, etc.     |

---

## 🚀 Getting Started

### 📦 Installation

```bash
git clone https://github.com/muhammadHabib-glitch/KhutbaAi-FrontEnd.git
cd KhutbaAIApp
npm install
