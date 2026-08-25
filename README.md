# 🧘 Abidar - The Cosmic Carpet Ride (v1.1)

> *"MANTENHA A PRESENÇA — VOCÊ NUNCA FOI A LUGAR NENHUM"*

**Abidar - The Cosmic Carpet Ride** (versão **v1.1**) é um jogo arcade estilo retro 16-bits ambientado nas dimensões místicas do cosmos. O jogador controla **"O Cara"** em seu tapete voador intergaláctico, desviando de perigos estelares, coletando itens espirituais, ativando power-ups elementais e buscando a iluminação plena através da serenidade, presença e da mecânica *Abide*.

---

## 🎮 Introdução ao Jogo

Em um universo repleto de distrações, ilusões temporais e tempestades de poeira estelar, O Cara viaja pelo manto cósmico mantendo a mente serena no presente. Cada fase representa uma dimensão cósmica diferente com desafios únicos, trilhas sonoras sintetizadas em tempo real e perigos cósmicos (buracos negros, falsos clones, e vilões do espaço).

O jogo foi completamente otimizado para **jogabilidade em modo horizontal (landscape)** tanto no computador quanto em dispositivos móveis (smartphones e tablets).

---

## 🕹️ Mecânicas de Jogo & Controles

### Controles
- **Teclado (Desktop)**:
  - `Espaço` / `W` / `Seta para Cima (↑)` ou qualquer tecla: Pressionar ou segurar para **SUBIR** o tapete voador contra a gravidade cósmica.
  - `Soltar teclas`: Deixar o tapete **CAIR** suavemente.
  - `P` / `ESC`: Pausar o jogo.
- **Telas Sensíveis ao Toque (Mobile / Android APK)**:
  - **Toque / Segurar em qualquer parte da tela**: Eleva o tapete voador.
  - **Soltar a tela**: Deixa o tapete flutuar para baixo.

### 🧘 A Mecânica "ABIDE" (The Stillness)
Ao manter a posição do tapete estável e serena no ar por alguns segundos sem movimentos bruscos, O Cara ativa a aura dourada de presença (**ABIDE**):
- Recarrega a **Barra de Energia Abidar**.
- Concede **+1000 Pontos de Presença** instantâneos.
- Protege o jogador de entrar no *Material Mode* (movimentos pesados quando a energia esgota).

---

## 🔮 Modos de Jogo

### 1. Modo História (Fases Selecionáveis)
1. **Fase 1: O Mundo Material (The Material World)** — Cidade cósmica e introdução aos pinos de boliche e cafés.
2. **Fase 2: As Correntes Elementais (The Elemental Current)** — Tempestade de meteoros com os 4 orbes elementais (Fogo, Ar, Água e Terra).
3. **Fase 3: O Vazio Primordial (The Void)** — Nébulas místicas e a busca pelos 5 sons sagrados (IEOUA).
4. **Fase 4: A Espiral Dourada (The Spiral)** — Galáxias surreais com ilusões de falsos clones e rolagem rápida.
5. **Fase 5: O Pleroma & O Grande Vazio (The Pleroma & The Great Void)** — A fase final suprema! Após viajar pelas profundezas do Pleroma, a **Grande Espiral do Vazio** se abre. Colete os 5 Pinos do Vazio para entrar no Vazio Primordial em paz absoluta e assistir aos Créditos do Cosmos (*"ENTROU NO VAZIO!"*).

### 2. Modo Infinito (Endless Cosmic Ride)
Uma jornada sem fim onde a velocidade e os obstáculos aumentam progressivamente. Teste sua presença e registre sua pontuação no **Ranking Top 10**.

---

## ✨ Colecionáveis & Power-ups

- 🎳 **Pinos de Boliche (Bowling Pins)**: +100 pontos. Coletar em sequência ativa e aumenta o multiplicador de COMBO (x2, x3, x5)!
- ☕ **Xícara de Café / White Russian**: +50 pontos & recarrega a energia Abidar. Coletar 3 cafés seguidos ativa o **Coffee Rush Time**!
- ⭐ **Estrela Dourada**: +200 pontos e bônus de iluminação temporária.
- 🔮 **Orbes IEOUA**: Colete os 5 sons sagrados (**I → E → O → U → A**) para ativar o efeito harmonizador *The Sound of the Spiral*.
- 🔥 **Orbe de Fogo**: Escudo flamejante contra colisões.
- 💨 **Orbe de Ar**: Aumento de velocidade de navegação.
- 💧 **Orbe de Água**: Efeito de câmera lenta cósmica (Slow Motion).
- 🌍 **Orbe de Terra**: Ímã de ouro que atrai todos os coletáveis próximos.

---

## ⚙️ Recursos & Opções

- 📺 **Filtro CRT Scanlines (16-bits)**: Alterne o visual estilo tubo retro.
- 🔊 **Engine de Áudio Integrada**: Músicas de fundo chiptune/synth e efeitos sonoros com controles independentes de volume.
- 🏆 **Ranking Top 10**: Armazenamento local de recordes com inserção de nome/iniciais.
- 📱 **Otimização Landscape Mobile**: Menus, diálogos e caixas de texto com rolagem fluida e layout adaptado para telas na horizontal.

---

## 🚀 Como Compilar o APK no GitHub Actions

O repositório possui um fluxo de integração contínua (CI/CD) automatizado via **GitHub Actions** (`.github/workflows/build-apk.yml`).

### Passos para gerar o arquivo `.apk`:
1. Faça o **Push** ou envie um **Pull Request** para a branch `main` ou `master`.
2. Vá para a aba **Actions** no repositório no GitHub.
3. Selecione o workflow **Build Android APK**.
4. Baixe o artefato **`Abidar-The-Cosmic-Carpet-Ride-APK`**, que conterá o instalador **`Abidar-The-Cosmic-Carpet-Ride.apk`**.

---

## 💻 Desenvolvimento Local

### Pré-requisitos
- **Node.js**: Versão 18 ou superior
- **NPM**: Versão 9 ou superior

### Instalação & Execução

```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Iniciar o servidor de desenvolvimento local (Porta 3000)
npm run dev

# 3. Compilar a versão web para produção
npm run build
```

### Comandos do Capacitor (Android)

```bash
# Sincronizar o build web com o projeto nativo Android
npm run cap:sync

# Compilar o APK debug localmente (requer Java JDK 21 e Android SDK)
npm run build:apk
```

---

## 🎨 Especificações Técnicas

- **Framework**: React + Vite + TypeScript
- **Estilização**: Tailwind CSS (Estética Retro Pixel & Neon 16-bits)
- **Engine Gráfica**: HTML5 Canvas 2D + Web Audio API
- **Empacotador Nativo**: Capacitor 7 (Android)
- **CI/CD**: GitHub Actions (Java 21 Temurin + Gradle 8.14)
- **Versão Atual**: `v1.1`

---

## 📧 Contato & Créditos

- **Projeto**: Evangelho Dimenúveis
- **E-mail de Contato**: [samuel.tiem@proton.me](mailto:samuel.tiem@proton.me?subject=Abidar%20-%20The%20Cosmic%20Carpet%20Ride)
- **Licença**: MIT
