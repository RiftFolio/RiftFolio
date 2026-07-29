<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=160&section=header&text=RIFT%20VAULT&fontSize=48&fontColor=6ec6ff&fontAlignY=40&desc=Your%20Riftbound%20Card%20Stock%2C%20Organized&descAlignY=62&descSize=17&descColor=8fd3ff&animation=fadeIn" width="100%"/>


*Browse, sort, and manage your Riftbound card collection right from your browser.*

<br/>

![Node.js](https://img.shields.io/badge/Node.js-Required-1e3a5f?style=for-the-badge&logo=node.js&logoColor=6ec6ff)
![React](https://img.shields.io/badge/React-18-1e3a5f?style=for-the-badge&logo=react&logoColor=6ec6ff)
![Status](https://img.shields.io/badge/Status-Early%20Build-1e3a5f?style=for-the-badge&logo=riot-games&logoColor=6ec6ff)
![Data](https://img.shields.io/badge/Data-riftcodex.com-1e3a5f?style=for-the-badge&logo=databricks&logoColor=6ec6ff)

</div>

---

## 🔷 About

**Rift Folio** is a local app for tracking your *Riftbound* card stock. It's built with React and TypeScript, and pulls card data straight from the public [RiftCodex](https://api.riftcodex.com) API.

---

## 👥 Collaborators

| | Name | GitHub |
|---|---|---|
| 👩‍💻 | Clara Fernández Pérez | [@megu-hub](https://github.com/megu-hub) |
| 👨‍💻 | Sergio Fernández-Miranda Longo | [@clubserg](https://github.com/clubserg) |

---

## 🗃️ File Structure

> *Note: this is an early, minimal version — the structure will evolve. Still missing: a database and auth/security.*

```
rift-folio/
├── index.html          🔹 Vite entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── types/          🔹 Card, Stock, Deck types
    ├── services/       🔹 RiftCodex API calls
    ├── hooks/          🔹 useStock and useDecks (state + localStorage)
    ├── components/     🔹 Reusable pieces (CardTile, StockTile)
    ├── views/          🔹 Screens (search, collection, decks)
    ├── App.tsx         🔹 Layout and navigation between views
    ├── main.tsx        🔹 React entry point
    └── styles.css
```

---

## 📘 Requirements

| Requirement | Detail |
|---|---|
| 🔵 **Node.js** | Any recent version |

Check whether you already have it installed by opening a terminal and running:

```bash
node -v
```

If no version number shows up, download it for free from [nodejs.org](https://nodejs.org) (choose the **LTS** version).

---

## 🚀 Getting Started

1. Open a terminal (or command prompt) in this folder — the one containing `package.json`.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm run dev
   ```
4. You should see a message like:
   ```
   ➜  Local:   http://localhost:5173/
   ```
5. Open that address in your browser.
6. To stop the app, go back to the terminal and press `Ctrl+C`.

> 🔁 Every time you want to use the app again, just repeat steps 3–5.

### Building for production

```bash
npm run build
npm run preview
```

---

<div align="center">

*Made with 💙 by Clubserg & Megu*

</div>
