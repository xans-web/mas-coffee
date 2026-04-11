# Quick Reference Guide - Main Website Admin

## 🚀 Quick Start

### Access Admin Sections
```
/admin/hero           → Hero Manager
/admin/products       → Product Manager (Coffee & Cake)
/admin/lookbook       → Lookbook (Gallery)
/admin/events         → Event Manager
/admin/map-settings   → Contact/Map Settings
/admin/inquiries      → Customer Inquiries
```

## 🎨 Color Codes (Copy-Paste Ready)

```css
/* Background */
#0B2421    /* Dark Forest Green */

/* Text */
#F5EFE0    /* Rich Cream */

/* Accent */
#C5A367    /* Luxury Gold */

/* Borders */
#C5A367/20  /* Light Gold Border */
#C5A367/30  /* Medium Gold Border */
#C5A367/60  /* Strong Gold Border */
```

## 📝 Common Tailwind Classes

### Buttons (Primary)
```tsx
className="px-6 py-3 bg-[#C5A367] text-[#0B2421] rounded-lg font-black uppercase tracking-wider text-sm hover:scale-105 transition-all"
```

### Buttons (Secondary)
```tsx
className="px-6 py-3 bg-[#0B2421] border border-[#C5A367]/30 text-[#C5A367] rounded-lg font-black uppercase tracking-wider text-sm hover:border-[#C5A367]/60 transition-all"
```

### Input Fields
```tsx
className="w-full px-4 py-3 bg-[#0B2421] border border-[#C5A367]/30 rounded-lg text-[#F5EFE0] placeholder:text-[#F5EFE0]/30 focus:outline-none focus:border-[#C5A367] transition-all"
```

### Cards
```tsx
className="bg-[#0B2421] border border-[#C5A367]/20 rounded-xl p-6 hover:border-[#C5A367]/40 transition-all"
```

### Page Titles
```tsx
className="text-3xl md:text-4xl font-serif font-black text-[#C5A367] mb-2"
```

### Subtitles
```tsx
className="text-[#F5EFE0]/60 font-medium"
```

## 🗄️ Database Collections

```
main_site_products     → Coffee & Cake products
heroes                 → Homepage hero banners
lookbook_items         → Gallery images
lookbook_categories    → Gallery categories
events                 → Events and announcements
site_settings          → Map coordinates, contact info
inquiries              → Customer messages
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
< 1024px

/* Desktop */
≥ 1024px
```

## 🎯 Icon Imports

```tsx
import { 
  Layout,        // Hero Manager
  ShoppingBag,   // Product Manager
  Image,         // Lookbook
  Calendar,      // Event Manager
  MapPin,        // Map Settings
  Mail,          // Inquiries
  Plus,          // Add buttons
  Edit,          // Edit buttons
  Trash2,        // Delete buttons
  Save,          // Save buttons
  X,             // Close buttons
  Menu,          // Menu toggle
  LogOut         // Logout
} from "lucide-react";
```

## 🔧 Common Patterns

### Empty State
```tsx
<div className="bg-[#0B2421] border border-[#C5A367]/20 rounded-xl p-12 text-center">
  <IconComponent className="w-16 h-16 text-[#C5A367]/30 mx-auto mb-4" />
  <p className="text-[#F5EFE0]/40 font-medium">
    No items yet. Click "Add New" to get started.
  </p>
</div>
```

### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

### Action Buttons Row
```tsx
<div className="flex gap-2">
  <button className="flex-1 px-3 py-2 bg-[#C5A367]/10 border border-[#C5A367]/30 rounded-lg text-[#C5A367] text-sm font-bold hover:bg-[#C5A367]/20 transition-all">
    Edit
  </button>
  <button className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-bold hover:bg-red-500/20 transition-all">
    Delete
  </button>
</div>
```

## 📋 Checklist for New Pages

- [ ] Import necessary icons from lucide-react
- [ ] Add page title (Playfair Display, Gold)
- [ ] Add subtitle (Inter, Cream/60)
- [ ] Include "Add New" button (Gold background)
- [ ] Create empty state with icon
- [ ] Add grid/list layout for items
- [ ] Include edit/delete buttons
- [ ] Add Phase 2 placeholder notice
- [ ] Test responsive design
- [ ] Verify color consistency

## 🚨 Important Rules

### DO
✅ Use solid `#0B2421` background (no gradients)
✅ Use Inter for all UI elements
✅ Use Playfair Display ONLY for page titles
✅ Use Gold (`#C5A367`) for accents and borders
✅ Keep sidebar to 6 sections only
✅ Maintain isolation from cafe menu admin

### DON'T
❌ Add gradients to backgrounds
❌ Use decorative fonts
❌ Reference cafe menu collections
❌ Modify cafe menu admin files
❌ Add extra sidebar sections
❌ Use white backgrounds in dark theme

## 🔗 File Locations

```
Layout:           app/admin/(main-website)/layout.tsx
Hero:             app/admin/(main-website)/hero/page.tsx
Products:         app/admin/(main-website)/products/page.tsx
Lookbook:         app/admin/(main-website)/lookbook/page.tsx
Events:           app/admin/(main-website)/events/page.tsx
Map Settings:     app/admin/(main-website)/map-settings/page.tsx
Inquiries:        app/admin/(main-website)/inquiries/page.tsx
```

## 📞 Quick Help

### Need to add a new section?
1. Create new folder in `app/admin/(main-website)/`
2. Add `page.tsx` with themed components
3. Update sidebar navigation in `layout.tsx`
4. Follow color and typography guidelines

### Need to modify styling?
- Check `ADMIN_VISUAL_GUIDE.md` for design specs
- Use existing components as templates
- Maintain color consistency

### Need database info?
- Check `ADMIN_RESTRUCTURE_PHASE2.md`
- See database collections section
- Review schema planning notes

## 🎉 Phase 2 Complete!

All admin sections are ready for Phase 3 CRUD implementation.
