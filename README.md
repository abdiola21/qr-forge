# QR Forge

Générateur de QR Code gratuit et open source — créez des codes QR personnalisés directement dans votre navigateur.

## Fonctionnalités

- **10 types de contenu** : URL, contact (vCard), vidéo, musique, PDF, lieu (Google Maps), réseau social, texte, email, Wi-Fi
- **Design personnalisé** : couleurs, motifs du corps, formes des yeux, logo, 8 modèles prédéfinis
- **Export** : PNG et PDF en haute résolution
- **100% local** : aucune donnée envoyée à un serveur

## Démarrage

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173)

## Build production

```bash
npm run build
npm run preview
```

## Stack

- React + TypeScript + Vite
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) — rendu QR avancé
- [jsPDF](https://github.com/parallax/jsPDF) — export PDF
- [Lucide React](https://lucide.dev/) — icônes
