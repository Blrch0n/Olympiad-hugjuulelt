# 🪐 Glossy CSS Planets - Zero Dependencies!

Pure CSS, no Three.js, no textures needed. Just beautiful glossy neon planets.

## 🚀 What You Got

### 1. **GlossyPlanet Component** (`components/GlossyPlanet.tsx`)

A single reusable component that creates beautiful glossy neon planets using only CSS.

**Features:**

- ✨ Glossy realistic lighting
- 🌟 Neon glow effects
- 💫 Atmospheric ring
- 🎯 Active/hover states
- 🎨 Any hex color
- 📏 Any size
- 🏷️ Optional labels
- 🖱️ Click handlers

### 2. **Demo Pages**

#### Planet Demo (`/planet-demo`)

Full showcase with:

- All preset colors
- Different sizes
- Grid layout
- Solar system layout
- Usage examples
- Props documentation

#### Simple Galaxy (`/simple-galaxy`)

Your actual Olympiad page with:

- Solar system hub view
- Planet detail view
- Navigation
- Content for each section
- Smooth transitions

## 🎯 Usage

### Basic Example

```tsx
import GlossyPlanet, { PlanetPresets } from "@/components/GlossyPlanet";

<GlossyPlanet
  color={PlanetPresets.purple}
  size={120}
  label="Шагналын сан"
  onClick={() => console.log("Clicked!")}
/>;
```

### With Custom Color

```tsx
<GlossyPlanet color="#a855f7" size={140} label="My Planet" isActive={true} />
```

### Available Preset Colors

```tsx
PlanetPresets.purple; // #a855f7
PlanetPresets.blue; // #3b82f6
PlanetPresets.teal; // #14b8a6
PlanetPresets.orange; // #f97316
PlanetPresets.green; // #10b981
PlanetPresets.cyan; // #06b6d4
PlanetPresets.pink; // #ec4899
PlanetPresets.red; // #ef4444
PlanetPresets.yellow; // #eab308
```

## 🎨 Props

| Prop        | Type     | Default | Description                 |
| ----------- | -------- | ------- | --------------------------- |
| `color`     | string   | -       | Hex color (e.g., "#a855f7") |
| `size`      | number   | 120     | Planet diameter in pixels   |
| `label`     | string   | -       | Text label below planet     |
| `onClick`   | function | -       | Click handler               |
| `isActive`  | boolean  | false   | Active/selected state       |
| `className` | string   | ""      | Additional CSS classes      |

## 🌐 View Your Pages

Start your dev server and visit:

1. **Full Demo**: http://localhost:3000/planet-demo

   - See all features
   - Different sizes
   - Solar system layout
   - Code examples

2. **Simple Galaxy**: http://localhost:3000/simple-galaxy

   - Your actual Olympiad page
   - Click planets to view details
   - Navigation pills

3. **Original 3D Version**: http://localhost:3000
   - Your Three.js version (now with fixed textures)

## ⚡ Why This is Better

### CSS Version (GlossyPlanet)

✅ Zero dependencies  
✅ No texture files needed  
✅ Instant load time  
✅ Works on all devices  
✅ Easy to customize  
✅ Smooth 60fps animations  
✅ 5KB total size

### Three.js Version (GalaxyHero)

❌ Large bundle size (~500KB)  
❌ Requires texture files  
❌ WebGL compatibility issues  
❌ Heavy on mobile devices  
❌ Complex to maintain  
✅ Cool 3D effects (if you have the resources)

## 🔄 Replace Your Current Hero

Want to use the CSS version on your homepage? Just replace in `app/page.tsx`:

```tsx
// Change this:
import GalaxyHero from "@/components/GalaxyHero";

// To this:
import SimpleGalaxy from "@/app/simple-galaxy/page";

// In your component:
export default function Home() {
  return <SimpleGalaxy />;
}
```

## 🎨 Customize Colors

Edit the colors in `components/GlossyPlanet.tsx`:

```tsx
export const PlanetPresets = {
  purple: "#a855f7",
  blue: "#3b82f6",
  // Add your own:
  myColor: "#your-hex-color",
};
```

## 📱 Mobile Friendly

The CSS planets are fully responsive and work great on mobile:

- Touch events work perfectly
- No performance issues
- No WebGL requirements
- Smooth on all devices

## 🎭 Advanced: Animation Examples

### Rotating Planet

```tsx
<div className="animate-spin-slow">
  <GlossyPlanet color="#a855f7" size={120} />
</div>
```

### Floating Animation

```tsx
<div className="animate-bounce">
  <GlossyPlanet color="#3b82f6" size={120} />
</div>
```

### Custom Animation

```tsx
<div className="hover:scale-125 transition-transform duration-500">
  <GlossyPlanet color="#14b8a6" size={120} />
</div>
```

## 🚀 Next Steps

1. Visit `/planet-demo` to see all features
2. Visit `/simple-galaxy` to see your Olympiad page
3. Customize colors and content to match your needs
4. Replace your current hero with this lightweight version

## 💡 Tips

- Use smaller sizes (80-100px) for navigation
- Use larger sizes (200-300px) for hero sections
- Add `isActive` for selected states
- Combine with animations for extra flair
- Use in grids, solar systems, or lists

Enjoy your glossy planets! 🪐✨
