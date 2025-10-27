# Debug Instructions for Planet Content Panel Issue

## Test Each Planet

Open your browser console (F12) and click each planet one by one. You should see debug logs like:

```
🎯 Planet picked: about
📍 World position: Vector3 {x: ..., y: ..., z: ...}
📊 State changed - Mode: warping-to Current: about
🚀 Started warping to target
🎯 Initial target set: Vector3 {...}
✅ Camera arrived! Distance: 0.045, Elapsed: 0.82s
🎬 Switching to PANEL mode
📊 State changed - Mode: panel Current: about
🎨 Showcase rendering for: about
📦 SECTION_CONTENT exists: true
🎨 TEXTURE_CONFIG exists: true
📄 Content: {title: "...", description: "...", details: Array(4)}
🎨 Texture: {albedo: "...", color: "#10b981", ...}
✅ Rendering panel with color: #10b981 and 4 details
```

## What to Look For

### For planets that DON'T work:

1. **Does the mode switch to "panel"?**

   - Look for: `📊 State changed - Mode: panel Current: [planet-id]`
   - If you don't see this, the camera might not be arriving
   - Check: `✅ Camera arrived!` message with distance and elapsed time

2. **Does Showcase get rendered?**

   - Look for: `🎨 Showcase rendering for: [planet-id]`
   - If you don't see this, React isn't rendering the component

3. **Is the content missing?**

   - Look for: `❌ SECTION_CONTENT missing for id: [planet-id]`
   - This means the data is missing from galaxy-constants.ts

4. **Check the debug overlay** (top-left of screen)
   - Mode should change: hub → warping-to → panel
   - Current should show the planet ID
   - "Panel should render" should show ✅ YES when in panel mode

## Common Issues

### Issue 1: Camera never arrives (stays in "warping-to")

**Solution:** The time-based fallback should kick in after 1.2 seconds
**Check:** Look for timeout message after 1.2s

### Issue 2: Mode switches to "panel" but no Showcase

**Cause:** React conditional rendering issue
**Check:** Console for `🎨 Showcase rendering for:` message

### Issue 3: Showcase renders but crashes

**Cause:** Missing or malformed content data
**Check:** Console for errors about undefined properties

## Report Back

For each planet that doesn't work, report:

1. Planet name (about, rules, prizes, sponsor, contact, register, faq)
2. What mode does it reach? (check debug overlay)
3. Last console message you see for that planet
4. Any error messages in console

## Quick Test Command

In browser console, type:

```javascript
// Check if all data exists
["about", "rules", "prizes", "sponsor", "contact", "register", "faq"].forEach(
  (id) => {
    console.log(
      id,
      ":",
      "content=" + (window.SECTION_CONTENT?.[id] ? "✓" : "✗"),
      "texture=" + (window.TEXTURE_CONFIG?.[id] ? "✓" : "✗")
    );
  }
);
```

Note: This won't work if constants aren't exported to window, but console logs should tell us everything.
