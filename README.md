# StreakDayscore

**A personal habit and task tracker with an XP and level system.**

Track what truly matters in your life — spirituality, health, professional growth, family — and build consistency day by day.

---

## ✨ Features

- **Daily habits** — recurring, checked off every day
- **Tasks** — one-time items with an optional deadline
- **5 life areas** — Spirituality, Health & Sport, Professional, Family & Relations, Other
- **XP & Level system** — each item is worth 1–20 XP; reach 100 XP to level up
- **Daily stats** — completed items, XP earned today, progress percentage
- **Dark mode** — automatic, follows your system preference
- **Responsive** — works on desktop and mobile
- **No server, no account** — data is saved locally in your browser (localStorage)

---

## 🗂️ Project structure

```
streakdayscore/
├── index.html        ← page structure (semantic HTML)
├── css/
│   └── style.css     ← all styles (CSS custom properties, dark mode, responsive)
├── js/
│   └── app.js        ← all app logic (Vanilla JS, no frameworks)
└── README.md
```

---

## 🚀 Getting started

### Option 1 — Local (simplest, no install needed)

```bash
git clone https://github.com/Mihai-gitto/streakdayscore.git
cd streakdayscore
```

Open `index.html` directly in your browser. That's it.

---

### Option 2 — GitHub Pages (free, online)

1. Push the repo to GitHub
2. Go to **Settings → Pages**
3. Source: `main` branch, folder `/ (root)`
4. Save — your app will be live in a few minutes at:

```
https://mihai-gitto.github.io/streakdayscore
```

---

### Option 3 — Netlify (drag & drop, no terminal)

1. Go to [netlify.com](https://netlify.com) and create a free account
2. Drag the `streakdayscore` folder into the browser
3. Get a public link instantly

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

**Change colors** → `css/style.css`, `:root` section (CSS variables)

**Change default habits/tasks** → `js/app.js`, `DEFAULT_STATE` constant

**Change XP per level** → `js/app.js`, `XP_PER_LEVEL` constant (default: `100`)

**Add a new life area:**
1. Add it to `ZONES` in `js/app.js`
2. Add a nav button in the sidebar in `index.html`
3. Add an `<option>` to the select in the modal

---

## 🛠️ Tech stack

| Technology | Purpose |
|---|---|
| HTML5 (semantic) | Page structure |
| CSS3 (custom properties) | Styles, dark mode, responsive layout |
| Vanilla JavaScript (ES2020) | All logic, no frameworks |
| localStorage | Local data persistence |
| [DM Sans & DM Serif Display](https://fonts.google.com) | Typography (Google Fonts) |
| [Tabler Icons](https://tabler.io/icons) | Icons (CDN) |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an Issue first to discuss what you'd like to change.

---

*Built for daily consistency.*
