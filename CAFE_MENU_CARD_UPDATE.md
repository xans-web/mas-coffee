# Cafe Menu Card Design Update

## Critical Change: Card Background Color

### BEFORE (Incorrect - Light Background)
```
Background: #F5EFE0 (Cream/White)
Text: #0B2421 (Dark Green) - Low contrast
Border: #C5A367/20 (Very faint gold)
Problem: White cards on dark background looked disconnected
```

### AFTER (Correct - Dark Background)
```
Background: #0B2421/95 (Dark Green with transparency)
Text: #F5EFE0/70 (Cream) - High contrast, readable
Titles/Prices: #C5A367 (Luxury Gold) - Premium look
Border: #C5A367/30 (Gold) → #C5A367/60 on hover
Solution: Dark cards blend seamlessly with dark theme
```

## Visual Structure

```
┌─────────────────────────────────────────────────────┐
│  [Circular Image]                                   │
│  Border: Gold (#C5A367/60)                          │
│  Background: Dark Green (#0B2421)                   │
│                                                      │
│         ┌───────────────────────────────┐          │
│         │  DARK CARD (#0B2421/95)       │          │
│         │  Border: Gold (#C5A367/30)    │          │
│         │                                │          │
│         │  ITEM NAME (Gold #C5A367)     │          │
│         │  250 ETB (Gold #C5A367)       │          │
│         │                                │          │
│         │  Description text in cream    │          │
│         │  (#F5EFE0/70) for readability │          │
│         │                                │          │
│         │  ─────────────────────────    │          │
│         │  Gold divider (#C5A367/30)    │          │
│         │                                │          │
│         │  [+ ADD] Gold Button          │          │
│         │  (#C5A367 bg, #0B2421 text)   │          │
│         └───────────────────────────────┘          │
└─────────────────────────────────────────────────────┘
```

## Color Breakdown

### Card Container
- **Background**: `bg-[#0B2421]/95` with `backdrop-blur-md`
  - 95% opacity allows subtle depth
  - Backdrop blur creates premium glass effect
- **Border**: `border-[#C5A367]/30`
  - Thin gold border defines card shape
  - Increases to `/60` on hover for feedback

### Text Elements
1. **Item Name (Title)**
   - Color: `text-[#C5A367]`
   - Font: Bold, uppercase, wide tracking
   - Purpose: Maximum visibility and premium feel

2. **Price**
   - Color: `text-[#C5A367]`
   - Font: Extra bold, large size
   - Purpose: Clear pricing information

3. **Description**
   - Color: `text-[#F5EFE0]/70`
   - Font: Inter, italic, medium weight
   - Purpose: Readable body text with 70% opacity for hierarchy

4. **Divider**
   - Color: `bg-[#C5A367]/30`
   - Height: 1px
   - Purpose: Subtle separation before action button

### Interactive Elements
- **ADD Button**
  - Background: `bg-[#C5A367]`
  - Text: `text-[#0B2421]`
  - Hover: Scale up (1.05)
  - Shadow: Gold glow effect

## Typography
- **All text**: Inter font family
- **Titles**: Bold weight, uppercase
- **Descriptions**: Medium weight, italic
- **Prices**: Black weight (900)

## Hover States
```
Default:
- Border: #C5A367/30
- Shadow: Standard depth
- Scale: 1.0

Hover:
- Border: #C5A367/60 (brighter)
- Shadow: Deeper, more dramatic
- Scale: 1.01 (subtle lift)
```

## Accessibility
- **Contrast Ratio (Title)**: Gold (#C5A367) on Dark Green (#0B2421)
  - Ratio: ~4.5:1 (WCAG AA compliant)
- **Contrast Ratio (Description)**: Cream (#F5EFE0) on Dark Green (#0B2421)
  - Ratio: ~12:1 (WCAG AAA compliant)
- **Border Visibility**: Gold border ensures card boundaries are clear

## Responsive Behavior
- **Mobile**: Smaller padding, adjusted font sizes
- **Tablet**: Medium sizing
- **Desktop**: Full sizing with hover effects
- All breakpoints maintain dark background

## Why This Works
1. **Unified Theme**: Dark cards match the dark website background
2. **Premium Feel**: Gold accents create luxury aesthetic
3. **Readability**: High contrast cream text on dark background
4. **Definition**: Gold borders clearly define card boundaries
5. **Consistency**: Same color palette as rest of the application
6. **Modern**: Glass-morphism effect with backdrop blur
7. **Accessible**: Meets WCAG contrast requirements

## Implementation Notes
- Used `backdrop-blur-md` for depth without solid opacity
- Border opacity increases on hover for interactive feedback
- All colors use the unified palette (no white/cream backgrounds)
- Inter font ensures maximum readability on all devices
- Responsive padding and font sizes for all screen sizes
