# StrideFall

A modern take on the classic endless runner genre, built with **TypeScript**, **React**, and **Phaser**. Jump, dodge obstacles, and customize your character in this enhanced Chrome Dino-style game featuring beautiful pixel art graphics and extensive character customization.

![StrideFall Gameplay Preview](https://res.cloudinary.com/djaqusrpx/image/upload/v1757933165/stridefall_preview_qllqpk.gif)

## 🎮 Game Features

### Core Gameplay
- **Endless Running**: Navigate through procedurally generated landscapes
- **Dynamic Difficulty**: Speed and obstacle frequency increase over time
- **Multiple Enemies**: Face different mob types including snails, bees, and boars
- **Collectibles**: Gather coins and power-ups during your run
- **Health System**: Multi-hit health bar with visual feedback
- **Progressive Environments**: Terrain and vegetation change as you advance

### Character Customization
- **Gender Selection**: Choose between male and female characters
- **Skin Tones**: 5 different character skin colors (ivory, onyx, bronze, sandstone, umber)
- **Clothing Options**:
  - **Male**: Hats, hair styles, tops, bottoms, footwear, hand items
  - **Female**: Hats, hair styles, outfits, skirts, footwear, hand items
- **Visual Preview**: Real-time character preview in customization menu
- **Persistent Customization**: Your choices are saved between sessions

### Economy & Progression
- **Coin System**: Collect coins during gameplay to purchase items
- **Item Shop**: Buy new customization options with earned coins
- **High Score Tracking**: Personal best distance and coin records
- **Owned Items**: Permanent unlocks that persist across sessions

## 🕹️ Controls

- **SPACE**: Jump
- **P**: Pause/Resume (during gameplay)

## 🚀 Upcoming Features

- **Pet Companions**: Customizable animal companions to accompany your character
- **Mobile Compatibility**: Touch controls and responsive design for mobile devices

## 🐛 Known Issues

### Character Switching Bug
When switching between male and female characters in the customization menu, there's a visual synchronization issue:

- **Symptom**: After gender switching, equipped items may not appear selected in the customization interface
- **Reality**: The items are actually equipped in-game and will be applied correctly
- **Workaround**: The items will display properly after clicking the "Apply" button
- **Status**: This is a UI state management issue that doesn't affect actual gameplay

## 🛠️ Technical Stack

- **Frontend Framework**: React 18 with TypeScript
- **Game Engine**: Phaser 3
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Asset Management**: Custom asset mapping system
- **Build Tool**: Vite (assumed based on modern React setup)

## 📱 System Requirements

- **Browser**: Modern web browser with HTML5 Canvas support
- **JavaScript**: ES6+ support required
- **Performance**: Recommended for desktop browsers (mobile support coming soon)

## 🎨 Art Style

- **Pixel Art**: Retro-inspired 16-bit style graphics
- **Animated Sprites**: Smooth character and enemy animations
- **Dynamic Backgrounds**: Procedurally changing environments
- **UI Elements**: Custom pixel art interface components

## 🎯 Game Mechanics

### Obstacle Types
- **Snails**: Slow-moving ground enemies that hide in shells
- **Bees**: Flying enemies that move at medium speed
- **Boars**: Fast ground enemies in multiple colors

### Scoring System
- **Distance-Based**: Score increases with distance traveled
- **Coin Collection**: Additional points for collecting coins
- **Speed Scaling**: Faster gameplay yields higher scores

### Progression Curve
- **Adaptive Speed**: Game speed increases exponentially over time
- **Enemy Variety**: Different enemy types unlock at specific distances
- **Spawn Rates**: Obstacle frequency increases with progression

## 💾 Save System

The game automatically saves:
- Character customization choices
- Owned items and unlocks
- High scores and statistics
- Coin balance

Data persists between browser sessions using local storage.

## 🚧 Development Status

This game is in **near-complete** state with core gameplay and customization systems fully functional. The remaining features (pet companions and mobile support) are planned for upcoming releases.

## 🎮 How to Play

1. **Start**: Click to begin your endless run
2. **Jump**: Use SPACE to avoid obstacles and enemies
3. **Collect**: Gather coins for purchasing customization items
4. **Customize**: Access the character menu to personalize your runner
5. **Progress**: See how far you can travel as the game gets faster and more challenging

---

*Built with modern web technologies for smooth gameplay and responsive character customization. Challenge yourself to beat your high score while creating the perfect pixel art character!*

## 🎯 Support Development

If you enjoy StrideFall and want to support continued development of new features like pet companions and mobile compatibility, consider [sponsoring the project](https://github.com/sponsors/Victor-Evogor).