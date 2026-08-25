# 🧘 Abidar — The Cosmic Carpet Ride

> *"MANTENHA A PRESENÇA — VOCÊ NUNCA FOI A LUGAR NENHUM"*

**Versão:** 1.2  
**APK:** https://github.com/dimenuvel/Evangelho-das-Dimenuveis-Abidar/releases/tag/v1.2  
**Versão online:** https://abidar-the-cosmic-carpet-ride.ai.studio/

Arcade retro 16-bits em que **O Cara** viaja em seu tapete voador intergaláctico, desviando de perigos cósmicos, coletando itens e mantendo a presença através da mecânica **ABIDE**.

## 🗺️ Ecossistema

- 🌐 Landing Page: https://dimenuvel.github.io/Evangelho-das-Dimenuveis-site/
- 📱 Aplicativo Principal: https://github.com/dimenuvel/Evangelho-das-Dimenuveis
- 〰️ Laboratório de Som: https://github.com/dimenuvel/Evangelho-das-Dimenuveis-Som
- 🎳 Abida — O Jogo: https://github.com/dimenuvel/Evangelho-das-Dimenuveis-Abida
- 🧘 Abidar — The Cosmic Carpet Ride: https://github.com/dimenuvel/Evangelho-das-Dimenuveis-Abidar

## 🧭 Mapa do Jogo

```text
Abidar — The Cosmic Carpet Ride
├── 🎮 Modo História
│   ├── Fase 1 — Mundo Material
│   ├── Fase 2 — Correntes Elementais
│   ├── Fase 3 — Vazio Primordial
│   ├── Fase 4 — Espiral Dourada
│   └── Fase 5 — Pleroma & Grande Vazio
├── ♾️ Modo Infinito
├── ✨ Colecionáveis
├── 🔥 Power-ups elementais
├── 🧘 Mecânica ABIDE
└── 📺 Opções retro / áudio / ranking
```

## 🎮 Mecânicas e Controles

### Desktop

- `Espaço` / `W` / `↑` ou qualquer tecla: subir o tapete.
- Soltar: deixar o tapete cair suavemente.
- `P` / `ESC`: pausar.

### Mobile / Android

- Tocar e segurar em qualquer parte: elevar o tapete.
- Soltar: deixar o tapete descer.

### 🧘 ABIDE

Ao manter o tapete estável e sereno:

- Recarrega a Barra de Energia Abidar.
- Concede +1000 Pontos de Presença.
- Evita o *Material Mode* quando a energia se esgota.

## 🔮 Modos de Jogo

### História

1. **Mundo Material** — cidade cósmica, pinos e cafés.
2. **Correntes Elementais** — tempestade de meteoros e quatro orbes.
3. **Vazio Primordial** — nébulas e sons IEOUA.
4. **Espiral Dourada** — galáxias, clones e rolagem rápida.
5. **Pleroma & Grande Vazio** — Grande Espiral do Vazio e os cinco Pinos do Vazio.

### Infinito

Velocidade e obstáculos aumentam progressivamente, com ranking Top 10 local.

## ✨ Colecionáveis e Power-ups

- 🎳 **Pinos:** +100; combos x2, x3 e x5.
- ☕ **Café / White Russian:** +50 e energia; três seguidos ativam Coffee Rush.
- ⭐ **Estrela Dourada:** +200 e bônus de iluminação.
- 🔮 **Orbes IEOUA:** `I → E → O → U → A` ativa *The Sound of the Spiral*.
- 🔥 **Fogo:** escudo.
- 💨 **Ar:** velocidade.
- 💧 **Água:** câmera lenta.
- 🌍 **Terra:** ímã de coletáveis.

## ⚙️ Recursos

- Filtro CRT Scanlines 16-bits.
- Música chiptune/synth e efeitos independentes.
- Ranking Top 10 local.
- Interface otimizada para landscape mobile.

## 🚀 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- NPM 9+

```bash
npm install
npm run dev
npm run build
```

## 📱 Capacitor / Android

```bash
npm run cap:sync
npm run build:apk
```

O build local do APK requer **Java JDK 21** e Android SDK.

### GitHub Actions

1. Faça push ou abra PR em `main`/`master`.
2. Abra **Actions** no GitHub.
3. Selecione **Build Android APK**.
4. Baixe `Abidar-The-Cosmic-Carpet-Ride-APK`, contendo `Abidar-The-Cosmic-Carpet-Ride.apk`.

## 🛠️ Tecnologias

- React + Vite + TypeScript
- Tailwind CSS
- HTML5 Canvas 2D
- Web Audio API
- Capacitor 7
- GitHub Actions
- Java 21 Temurin + Gradle 8.14

## 📧 Créditos

**Projeto:** Evangelho Dimenúveis  
**Contato:** samuel.tiem@proton.me  
**Licença:** MIT
