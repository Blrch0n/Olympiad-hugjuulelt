# Galaxy Hero Component

An optimized 3D solar system visualization built with React Three Fiber, featuring interactive planets, smooth camera transitions, and stunning visual effects.

## Features

✨ **Interactive 3D Planets**: Click on planets to view detailed information
🎨 **Realistic Visual Effects**: Atmospheric glow, rim lighting, and particle effects
🚀 **Smooth Camera Transitions**: Warp-speed camera movements between views
📱 **Responsive Design**: Works on desktop and mobile devices
⌨️ **Keyboard Navigation**: Use arrow keys and Escape to navigate
🎯 **Scroll Navigation**: Scroll through planets with mouse wheel
♿ **Accessibility**: Supports reduced motion preferences and keyboard navigation
⚡ **Optimized Performance**: Low memory usage and efficient rendering

## Components

- **GalaxyHero**: Main component orchestrating the entire experience
- **Sun**: Central star with layered corona effect
- **Planet**: Textured planets with hover effects and labels
- **StarTunnel**: Dynamic star field with warp effect
- **OrbitRings**: Orbital paths for each planet
- **CameraRig**: Smooth camera transitions
- **Showcase**: Information panel for each planet
- **LoadingScreen**: Progress indicator during asset loading

## Performance Optimizations

1. **Reduced Particle Count**: Star count optimized to 2000 (from 2500)
2. **Geometry LOD**: Lower polygon counts for background elements
3. **Texture Management**: Proper mipmapping and error handling
4. **Efficient Updates**: Only update what's necessary in animation loop
5. **Conditional Rendering**: Effects disabled for reduced motion preference
6. **Memory Management**: Proper cleanup and disposal of resources

## Textures Required

Place these textures in `/public/textures/`:

- `bg-space.webp` - Background nebula/space image
- `planet_purple_albedo.webp` - Purple planet texture
- `planet_blue_albedo.webp` - Blue planet texture
- `planet_teal_albedo.webp` - Teal planet texture
- `planet_orange_albedo.webp` - Orange planet texture
- `planet_green_albedo.webp` - Green planet texture
- `planet_normal.webp` - Generic normal map
- `planet_rough.webp` - Generic roughness map
- `planet_streaks.png` - Emissive lightning streaks (optional)

## Configuration

Edit `/lib/galaxy-constants.ts` to customize:

- Section content and details
- Planet positions and sizes
- Orbit speeds and radii
- Performance parameters
- Texture mappings

## Usage

```tsx
import GalaxyHero from "@/components/GalaxyHero";

export default function Page() {
  return <GalaxyHero />;
}
```

## Browser Support

Requires WebGL support. Automatically displays fallback message for unsupported browsers.

## Controls

- **Mouse Click**: Click planets to view information
- **Mouse Wheel**: Scroll through planets
- **Arrow Keys**: Navigate up/down through planets
- **Escape**: Return to hub view
- **Top Nav Buttons**: Quick access to any section

## Sections

1. **About** (Олимпиадын тухай) - Green planet
2. **Rules** (Шалгалт) - Orange planet
3. **Prizes** (Шагналын сан) - Purple planet with lightning
4. **Sponsors** (Ивээн тэтгэч) - Blue planet
5. **Contact** (Холбоо барих) - Purple planet
6. **Register** (Бүртгүүлэх) - Teal planet
7. **FAQ** (Асуулт) - Cyan planet

## Technical Stack

- React 18+
- Three.js
- @react-three/fiber
- @react-three/drei
- @react-three/postprocessing
- TypeScript
- Tailwind CSS

## License

MIT
