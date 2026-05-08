# StreakDayscore

**A personal habit and task tracker with an XP and level system.**

Track what truly matters in your life — spirituality, health, professional growth, family — and build consistency day by day.

> 📱 **Works as an app on iPhone** — no App Store needed. See install instructions below.

---

## ✨ Features

- **Daily habits** — recurring, checked off every day
- **Tasks** — one-time items with an optional deadline
- **5 life areas** — Spirituality, Health & Sport, Professional, Family & Relations, Other
- **XP & Level system** — each item is worth 1–20 XP; reach 100 XP to level up
- **Daily stats** — completed items, XP earned today, progress percentage
- **Dark mode** — automatic, follows your system preference
- **Offline support** — works without internet once installed
- **Installable on iPhone** — sits on your home screen like a real app
- **No server, no account** — data is saved locally on your device

---

## 📱 Install on iPhone (PWA)

1. Open **Safari** on your iPhone
2. Go to `https://mihai-gitto.github.io/streakdayscore`
3. Tap the **Share** button (the box with an arrow pointing up)
4. Scroll down and tap **"Add to Home Screen"**
5. Tap **"Add"** in the top right corner

The app now appears on your home screen like any other app. It works offline too.

> ⚠️ Must be opened in **Safari** — Chrome on iPhone does not support PWA install.

---

## 🗂️ Project structure

```
streakdayscore/
├── index.html              ← page structure
├── manifest.json           ← PWA config (name, icons, colors)
├── css/
│   └── style.css           ← all styles
├── js/
│   ├── app.js              ← app logic
│   ├── service-worker.js   ← offline caching
│   └── sw-register.js      ← registers the service worker
├── icons/
│   ├── icon-192.png        ← app icon (home screen)
│   └── icon-512.png        ← app icon (splash screen)
└── README.md
```

---

## 🚀 Getting started

### Local
```bash
git clone https://github.com/Mihai-gitto/streakdayscore.git
cd streakdayscore
```
Open `index.html` in your browser.

### GitHub Pages (live + installable on iPhone)
1. Push to GitHub
2. **Settings → Pages → Source:** `main` branch, `/ (root)` → Save
3. Live at: `https://mihai-gitto.github.io/streakdayscore`

---

## 📖 How to use

| Action | How |
|---|---|
| Check off an item | Click on the card |
| Undo a check | Click the card again |
| Add a habit | "Add habit" button |
| Add a task | "Add task" button |
| Edit an item | Hover over card → pencil icon ✏️ |
| Delete an item | Hover over card → trash icon 🗑️ |
| Filter by area | Sidebar menu |

---

## ⚙️ Customization

**Change colors** → `css/style.css`, `:root` section

**Change default habits/tasks** → `js/app.js`, `DEFAULT_STATE` constant

**Change XP per level** → `js/app.js`, `XP_PER_LEVEL` constant (default: `100`)

---

## 🛠️ Tech stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styles, dark mode, responsive |
| Vanilla JavaScript | App logic, no frameworks |
| Web App Manifest | PWA installability |
| Service Worker | Offline caching |
| localStorage | Local data persistence |
| Google Fonts | Typography |
| Tabler Icons | Icons |

---

*Built for daily consistency.*
