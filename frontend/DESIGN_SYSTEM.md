# 🎨 Tripook Design System

## Theme: "Di sản và Lịch sử Việt Nam"
**Phong cách**: Chuyên nghiệp, Thanh lịch, Hiện đại

---

## 📁 File Structure

```
frontend/src/
├── styles/
│   ├── designSystem.css      # Design tokens & CSS variables
│   └── patterns.ts            # SVG heritage patterns
├── index.css                  # Global styles & reset
└── components/
    └── DesignSystemShowcase.tsx  # Demo page
```

---

## 🎨 1. COLOR PALETTE

### Primary Colors
- **Trắng Ngà / Kem nhạt** (`--color-bg-main`): `#FAF8F1`  
  _Background chính - Không dùng white tinh #FFFFFF_

- **Xanh Chàm đậm** (`--color-primary`): `#2C3E50`  
  _Navbar, Footer, Headings - Màu chủ đạo_

- **Đỏ Son** (`--color-cta`): `#D9411E`  
  _Call-to-Action buttons, Primary actions_

- **Vàng Đồng** (`--color-accent`): `#B8860B`  
  _Accent elements, Special borders_

- **Xám Đen** (`--color-text`): `#333333`  
  _Text chính - Không dùng black thuần #000000_

### Usage Guidelines
- ✅ **DO**: Dùng `--color-bg-main` cho background chính
- ✅ **DO**: Dùng `--color-cta` cho tất cả CTA buttons
- ✅ **DO**: Dùng `--color-accent` cho borders và icons đặc biệt
- ❌ **DON'T**: Không dùng `#FFFFFF` trắng tinh
- ❌ **DON'T**: Không dùng `#000000` đen thuần

---

## 📝 2. TYPOGRAPHY

### Font Families
```css
--font-heading: 'Playfair Display', Georgia, serif;
--font-body: 'Be Vietnam Pro', -apple-system, sans-serif;
```

### Font Sizes (Desktop First)
| Element | Variable | Size | Usage |
|---------|----------|------|-------|
| H1 | `--font-size-h1` | 56px | Hero titles |
| H2 | `--font-size-h2` | 40px | Section titles |
| H3 | `--font-size-h3` | 28px | Sub-sections |
| H4 | `--font-size-h4` | 24px | Card titles |
| Body | `--font-size-body` | 16px | Body text |
| Small | `--font-size-small` | 14px | Small text |

### Usage Guidelines
- ✅ **DO**: Dùng **Playfair Display** cho tất cả headings (H1-H6)
- ✅ **DO**: Dùng **Be Vietnam Pro** cho body text, buttons, labels
- ✅ **DO**: Dùng `font-weight: 700` cho headings
- ❌ **DON'T**: Không mix serif fonts cho body text

### Code Example
```tsx
<h1 style={{ fontFamily: 'var(--font-heading)' }}>Tiêu đề Chính</h1>
<p style={{ fontFamily: 'var(--font-body)' }}>Nội dung body text</p>
```

---

## 📏 3. SPACING SYSTEM

Based on 8px grid:

```css
--spacing-2: 0.5rem    /* 8px */
--spacing-4: 1rem      /* 16px */
--spacing-6: 1.5rem    /* 24px */
--spacing-8: 2rem      /* 32px */
--spacing-12: 3rem     /* 48px */
--spacing-16: 4rem     /* 64px */
```

### Section Spacing
```css
--section-padding-y: 5rem      /* 80px vertical */
--section-padding-x: 2rem      /* 32px horizontal */
--container-max-width: 1200px  /* Max content width */
```

---

## 🔘 4. BUTTONS (CTA ELEMENTS)

### Primary CTA Button (Đỏ Son)
```tsx
<button style={{
  padding: '1rem 2rem',
  backgroundColor: 'var(--color-cta)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--font-size-body)',
  fontWeight: 'var(--font-weight-semibold)',
  cursor: 'pointer',
  boxShadow: 'var(--shadow-cta)'
}}>
  Đặt ngay
</button>
```

### Secondary Button (Xanh Chàm)
```tsx
<button style={{
  backgroundColor: 'var(--color-primary)',
  color: 'white',
  // ... same as primary
}}>
  Xem thêm
</button>
```

### Outline Button (Vàng Đồng)
```tsx
<button style={{
  backgroundColor: 'transparent',
  color: 'var(--color-accent)',
  border: '2px solid var(--color-accent)',
  // ... same structure
}}>
  Tìm hiểu
</button>
```

---

## 🎭 5. HERITAGE PATTERNS (Họa Tiết Di Sản)

### Import Patterns
```tsx
import { inlinePatterns } from '../styles/patterns';
```

### Available Patterns

#### 1. Brocade Floral (Gấm Vóc)
**Usage**: Footer background  
**Opacity**: 15% để không lạm dụng

```tsx
<div style={{
  ...inlinePatterns.footer,
  backgroundColor: 'var(--color-primary)'
}}>
  Footer content
</div>
```

#### 2. Ceramic Wave (Sóng Gốm Sứ)
**Usage**: Section dividers  
**Opacity**: 20%

```tsx
<div style={inlinePatterns.sectionDivider} />
```

#### 3. Border Accent
**Usage**: Top/bottom borders of sections  
**Opacity**: 30%

```tsx
<div style={inlinePatterns.accentBorder} />
```

### ⚠️ Pattern Usage Rules

✅ **ALLOWED**:
- Footer background với opacity thấp (15%)
- Section dividers mảnh
- Border accents tinh tế

❌ **NOT ALLOWED**:
- Hero section background (gây rối)
- Full-page backgrounds
- Multiple patterns stacked
- Patterns trên main content areas

---

## 📦 6. COMPONENT PATTERNS

### Card Component
```tsx
<div style={{
  backgroundColor: 'var(--color-bg-white)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  padding: '2rem'
}}>
  <h4 style={{ 
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-primary)' 
  }}>
    Card Title
  </h4>
  <p style={{ color: 'var(--color-text-secondary)' }}>
    Description
  </p>
</div>
```

### Container Layout
```tsx
<div className="container section">
  {/* Container: max-width 1200px, centered */}
  {/* Section: padding-y 80px */}
  Content here
</div>
```

---

## 📱 7. RESPONSIVE BREAKPOINTS

**Approach**: Desktop First

```css
/* Desktop: Default (1200px+) */
/* Tablet: max-width 992px */
/* Mobile: max-width 768px */
/* Extra Small: max-width 576px */
```

### Typography Scales Down Automatically
- H1: 56px → 44px → 32px → 28px
- Section padding: 80px → 64px → 48px → 40px

---

## ✅ 8. DO's & DON'Ts

### ✅ DO

- **Minimalism**: Nhiều whitespace, clean layout
- **Hierarchy**: Rõ ràng giữa headings và body text
- **Consistent spacing**: Sử dụng spacing scale 8px
- **Subtle patterns**: Opacity thấp, không át chủ bài
- **Professional**: Elegant, sophisticated, modern

### ❌ DON'T

- **Không "sến"**: Không lạm dụng họa tiết, không rối rắm
- **Không "trẻ con"**: Không màu quá sáng, quá nhiều animation
- **Không pure white/black**: Dùng off-white và off-black
- **Không icons everywhere**: Chỉ dùng khi cần thiết
- **Không full-page patterns**: Patterns chỉ dùng cho accents

---

## 🚀 9. HOW TO USE

### Step 1: Import Design System
Already imported in `index.css`:
```css
@import './styles/designSystem.css';
```

### Step 2: Use CSS Variables
```tsx
<div style={{
  backgroundColor: 'var(--color-bg-main)',
  color: 'var(--color-text)',
  fontFamily: 'var(--font-body)'
}}>
```

### Step 3: Use Utility Classes
```tsx
<div className="container section">
  <h2 className="text-primary">Heading</h2>
  <p className="text-secondary">Body text</p>
</div>
```

---

## 📚 10. EXAMPLES

See live demo at: **`/design-system`** route (if configured)

Or view component: `src/components/DesignSystemShowcase.tsx`

---

## 🎯 Next Steps

1. ✅ **Foundation**: Design System created
2. ⏳ **Components**: Redesign Header, Footer, Hero
3. ⏳ **Pages**: Redesign Home, Services, Dashboard
4. ⏳ **Polish**: Animations, interactions, responsive

---

**Created**: November 12, 2025  
**Version**: 1.0.0  
**Author**: Tripook Design Team
