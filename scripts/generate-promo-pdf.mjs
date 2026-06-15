/** Génère le PDF promotion LinkedIn / WhatsApp pour QR Forge */
import { jsPDF } from 'jspdf';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'docs');
const outPath = join(outDir, 'QR-Forge-Promotion-LinkedIn-WhatsApp.pdf');

const SITE_URL = 'https://qrforge-tg.vercel.app';

const content = {
  title: 'QR Forge — Textes promotionnels',
  subtitle: 'Versions courtes pour LinkedIn et WhatsApp',
  date: 'Juin 2026',
  linkedin: {
    label: 'Version LinkedIn',
    hint: 'Longueur conseillée : 120 à 200 mots · Copier-coller tel quel',
    body: `Vous avez besoin d'un QR code pour votre menu, votre carte de visite, votre Instagram ou un PDF — mais les outils gratuits sont souvent limités, moches ou demandent une inscription ?

J'ai créé QR Forge : un générateur de QR code 100 % gratuit, sans compte, qui fonctionne directement dans le navigateur.

Ce que vous pouvez faire en quelques secondes :
→ Créer un QR pour URL, contact, Wi-Fi, PDF, réseaux sociaux et plus
→ Personnaliser couleurs, formes et logo
→ Télécharger en PNG, SVG ou PDF, prêt à imprimer

Vos données restent chez vous : rien n'est envoyé à un serveur.

Essayez gratuitement : ${SITE_URL}

#QRCode #Togo #Digital #Entrepreneuriat #Marketing #Gratuit #QRForge`,
  },
  whatsapp: {
    label: 'Version WhatsApp',
    hint: 'Message court · Idéal pour contacts, groupes ou statut',
    body: `Salut ! 👋

Tu connais QR Forge ? C'est un générateur de QR code *100 % gratuit* — sans inscription.

Parfait pour :
• Menu restaurant
• Carte de visite
• Lien Instagram / WhatsApp
• PDF, vidéo, Wi-Fi…

Tu personnalises les couleurs, tu ajoutes ton logo, tu télécharges en PNG ou PDF. Tout se fait dans le navigateur, tes données ne partent nulle part.

👉 ${SITE_URL}

Partage si ça peut servir à quelqu'un autour de toi ! 🚀`,
  },
  whatsappShort: {
    label: 'Version WhatsApp (ultra-courte)',
    hint: 'Pour un statut ou un message rapide',
    body: `QR Forge — générateur de QR code gratuit, sans inscription. Logo, couleurs, export PNG/PDF. Tout dans le navigateur.

👉 ${SITE_URL}`,
  },
  pitch: {
    label: 'En une phrase',
    body: `QR Forge permet à n'importe qui de créer gratuitement, en quelques secondes, un QR code professionnel et personnalisé — sans inscription et sans envoyer ses données à un serveur.`,
  },
};

function wrapText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function sectionTitle(doc, text, y) {
  doc.setFillColor(0, 119, 182);
  doc.rect(20, y - 5, 3, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(26, 35, 50);
  doc.text(text, 26, y);
  doc.setFont('helvetica', 'normal');
  return y + 10;
}

function bodyBlock(doc, text, y, maxWidth) {
  doc.setFontSize(10.5);
  doc.setTextColor(45, 55, 72);
  return wrapText(doc, text, 20, y, maxWidth, 5.2) + 4;
}

function hint(doc, text, y, maxWidth) {
  doc.setFontSize(9);
  doc.setTextColor(113, 128, 150);
  doc.setFont('helvetica', 'italic');
  const ny = wrapText(doc, text, 20, y, maxWidth, 4.5);
  doc.setFont('helvetica', 'normal');
  return ny + 6;
}

function box(doc, text, y, maxWidth, pageHeight) {
  doc.setFontSize(10.5);
  const lines = doc.splitTextToSize(text, maxWidth - 16);
  const boxH = lines.length * 5.2 + 14;
  if (y + boxH > pageHeight - 20) {
    doc.addPage();
    y = 24;
  }
  doc.setDrawColor(0, 150, 199);
  doc.setFillColor(244, 247, 251);
  doc.roundedRect(20, y, maxWidth, boxH, 3, 3, 'FD');
  doc.setTextColor(26, 35, 50);
  doc.text(lines, 28, y + 10);
  return y + boxH + 14;
}

const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
const pageW = doc.internal.pageSize.getWidth();
const pageH = doc.internal.pageSize.getHeight();
const maxW = pageW - 40;

// Cover band
doc.setFillColor(6, 8, 15);
doc.rect(0, 0, pageW, 52, 'F');
doc.setFillColor(0, 245, 212);
doc.rect(0, 50, pageW, 2, 'F');

doc.setTextColor(255, 255, 255);
doc.setFont('helvetica', 'bold');
doc.setFontSize(22);
doc.text('QR Forge', 20, 24);
doc.setFont('helvetica', 'normal');
doc.setFontSize(12);
doc.setTextColor(200, 210, 225);
doc.text(content.subtitle, 20, 34);
doc.setFontSize(9);
doc.text(`${SITE_URL}  ·  ${content.date}`, 20, 44);

let y = 66;

y = sectionTitle(doc, content.pitch.label, y);
y = bodyBlock(doc, content.pitch.body, y, maxW);
y += 6;

y = sectionTitle(doc, content.linkedin.label, y);
y = hint(doc, content.linkedin.hint, y, maxW);
y = box(doc, content.linkedin.body, y, maxW, pageH);

y = sectionTitle(doc, content.whatsapp.label, y);
y = hint(doc, content.whatsapp.hint, y, maxW);
y = box(doc, content.whatsapp.body, y, maxW, pageH);

y = sectionTitle(doc, content.whatsappShort.label, y);
y = hint(doc, content.whatsappShort.hint, y, maxW);
y = box(doc, content.whatsappShort.body, y, maxW, pageH);

// Footer
doc.setFontSize(8);
doc.setTextColor(113, 128, 150);
doc.text(
  'Document généré pour QR Forge — libre d\'utilisation pour vos publications.',
  20,
  pageH - 12,
);

mkdirSync(outDir, { recursive: true });
const buffer = Buffer.from(doc.output('arraybuffer'));
writeFileSync(outPath, buffer);
console.log(`PDF créé : ${outPath}`);
