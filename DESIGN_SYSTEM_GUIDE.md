# Premium Design System - Quick Reference

## 🎨 Using the Design System

This guide shows you how to use the premium design system components in your code.

---

## Components

### 1. Button Component

```tsx
import Button from '@/components/ui/button'

// Primary button (gradient)
<Button variant="primary" size="lg">
  Click Me
</Button>

// With icon
<Button variant="success" size="md" icon={<span>✓</span>}>
  Save
</Button>

// Loading state
<Button variant="primary" loading={isLoading}>
  Submit
</Button>

// All variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>
<Button variant="warning">Warning</Button>
<Button variant="ghost">Ghost</Button>

// All sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

---

### 2. Stats Card Component

```tsx
import StatsCard from '@/components/ui/stats-card'

// Basic stats card
<StatsCard
  label="Total Users"
  value={1234}
  icon="👥"
  variant="default"
/>

// With suffix
<StatsCard
  label="Success Rate"
  value={95}
  suffix="%"
  icon="🎯"
  variant="success"
/>

// Without animation
<StatsCard
  label="Static Value"
  value={100}
  animate={false}
/>

// All variants
<StatsCard variant="default" />  // Indigo gradient
<StatsCard variant="success" />  // Green gradient
<StatsCard variant="warning" />  // Orange gradient
<StatsCard variant="error" />    // Red gradient
<StatsCard variant="info" />     // Blue gradient
```

---

### 3. Gradient Background

```tsx
import GradientBackground from '@/components/ui/gradient-background'

// Add to any page
export default function MyPage() {
  return (
    <>
      <GradientBackground />
      <div className="relative">
        {/* Your content here */}
      </div>
    </>
  )
}
```

---

### 4. Loading Spinner

```tsx
import LoadingSpinner from '@/components/ui/loading-spinner'

// Default (medium, primary)
<LoadingSpinner />

// Custom size and variant
<LoadingSpinner size="lg" variant="white" />

// All sizes
<LoadingSpinner size="sm" />
<LoadingSpinner size="md" />
<LoadingSpinner size="lg" />
```

---

### 5. Theme Toggle

```tsx
import ThemeToggle from '@/components/ui/theme-toggle'

// Add to navigation
<ThemeToggle />
```

---

## CSS Utilities

### Glassmorphism

```tsx
// Basic glass effect
<div className="glass">
  Content
</div>

// Premium glass effect (with shadows)
<div className="glass-premium">
  Content
</div>

// Custom glass
<div className="backdrop-blur-xl bg-white/70 dark:bg-slate-800/70 border border-white/20">
  Content
</div>
```

---

### Gradient Text

```tsx
// Animated gradient text
<h1 className="gradient-text">
  Premium Title
</h1>

// Custom gradient text
<h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
  Custom Gradient
</h1>
```

---

### Animations

```tsx
// Slide up
<div className="animate-[slide-up_0.5s_ease-out]">
  Content
</div>

// Scale in
<div className="animate-[scale-in_0.3s_ease-out]">
  Content
</div>

// Float (continuous)
<div className="animate-[float_6s_ease-in-out_infinite]">
  Content
</div>

// With delay
<div
  className="opacity-0"
  style={{ animation: 'slide-up 0.5s ease-out 0.2s forwards' }}
>
  Content
</div>
```

---

### Premium Buttons (Pure CSS)

```tsx
// Button with ripple effect
<button className="btn-premium bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-all">
  Click Me
</button>
```

---

## Color System

### Using Gradients

```tsx
// Background gradients
<div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
  Content
</div>

// Border gradients (requires multiple elements)
<div className="relative rounded-2xl overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 blur-xl" />
  <div className="relative bg-white dark:bg-slate-900">
    Content
  </div>
</div>

// Gradient backgrounds for cards
<div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20">
  Content
</div>
```

---

### Semantic Colors

```tsx
// Success
<div className="bg-gradient-to-r from-emerald-500 to-green-600">Success</div>

// Warning
<div className="bg-gradient-to-r from-amber-400 to-orange-500">Warning</div>

// Error
<div className="bg-gradient-to-r from-rose-500 to-red-600">Error</div>

// Info
<div className="bg-gradient-to-r from-blue-500 to-cyan-600">Info</div>
```

---

## Dark Mode

### Using Dark Mode Classes

```tsx
// Background
<div className="bg-white dark:bg-slate-900">
  Content
</div>

// Text
<p className="text-slate-900 dark:text-slate-100">
  Primary text
</p>

<p className="text-slate-600 dark:text-slate-400">
  Secondary text
</p>

// Borders
<div className="border border-slate-200 dark:border-slate-700">
  Content
</div>

// Glass in dark mode
<div className="glass">
  {/* Automatically adjusts for dark mode */}
</div>
```

---

## Layout Patterns

### Page Container

```tsx
export default function MyPage() {
  return (
    <>
      <GradientBackground />
      <div className="relative min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Content */}
        </div>
      </div>
    </>
  )
}
```

---

### Header with Actions

```tsx
<div className="flex items-center justify-between flex-wrap gap-4">
  <div className="animate-[slide-up_0.4s_ease-out]">
    <h1 className="text-4xl font-bold gradient-text mb-2">
      Page Title
    </h1>
    <p className="text-lg text-slate-600 dark:text-slate-400">
      Description
    </p>
  </div>

  <Button variant="primary" size="lg">
    Action
  </Button>
</div>
```

---

### Stats Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatsCard label="Metric 1" value={100} icon="📊" variant="default" />
  <StatsCard label="Metric 2" value={200} icon="📈" variant="success" />
  <StatsCard label="Metric 3" value={300} icon="⚠️" variant="warning" />
  <StatsCard label="Metric 4" value={400} icon="🎯" variant="info" />
</div>
```

---

### Premium Card

```tsx
<div className="glass-premium rounded-2xl p-8">
  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
    Card Title
  </h2>
  <p className="text-slate-600 dark:text-slate-400">
    Card content
  </p>
</div>
```

---

### Form with Premium Inputs

```tsx
<div className="glass-premium rounded-2xl p-8">
  <form className="space-y-6">
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Label
      </label>
      <input
        type="text"
        className="block w-full px-4 py-3 glass rounded-xl border-2 border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition-all duration-200 text-slate-900 dark:text-slate-100"
        placeholder="Enter text..."
      />
    </div>

    <Button type="submit" variant="primary" size="lg" className="w-full">
      Submit
    </Button>
  </form>
</div>
```

---

## Animation Sequences

### Staggered Entrance

```tsx
<div className="space-y-6">
  <div
    className="opacity-0"
    style={{ animation: 'slide-up 0.5s ease-out 0.1s forwards' }}
  >
    First item
  </div>

  <div
    className="opacity-0"
    style={{ animation: 'slide-up 0.5s ease-out 0.2s forwards' }}
  >
    Second item
  </div>

  <div
    className="opacity-0"
    style={{ animation: 'slide-up 0.5s ease-out 0.3s forwards' }}
  >
    Third item
  </div>
</div>
```

---

## Tips & Best Practices

### 1. Glassmorphism
- Use `glass` for subtle effects
- Use `glass-premium` for hero sections
- Ensure sufficient contrast for text
- Works best over gradient backgrounds

### 2. Gradients
- Use 2-3 colors max for gradients
- Keep gradients subtle for backgrounds
- Use bold gradients for CTAs
- Adjust gradient opacity in dark mode

### 3. Animations
- Use `slide-up` for entrance
- Use `scale-in` for modals/dialogs
- Stagger animations by 0.1s increments
- Always set `opacity-0` with delayed animations
- Respect `prefers-reduced-motion`

### 4. Dark Mode
- Always provide dark mode variants
- Use semantic color names (slate, not gray)
- Adjust opacity, not just colors
- Test contrast ratios

### 5. Spacing
- Use consistent spacing scale (4, 6, 8, 12)
- Group related content with `space-y-*`
- Use flexbox/grid for layouts
- Maintain breathing room

### 6. Typography
- Use gradient text for headlines
- Maintain hierarchy (4xl → 3xl → 2xl → xl)
- Use proper line heights (relaxed, loose)
- Keep body text readable (base size minimum)

---

## Customization

### Changing Primary Color

Edit `/app/globals.css`:

```css
:root {
  /* Change these values */
  --primary-gradient-start: #4f46e5; /* Indigo */
  --primary-gradient-mid: #9333ea;   /* Purple */
  --primary-gradient-end: #db2777;   /* Pink */
}
```

### Adding New Variants

Edit `/components/ui/button.tsx`:

```tsx
const variantClasses = {
  // ... existing variants
  custom: 'bg-gradient-to-r from-your-color to-your-color ...',
}
```

### Custom Animations

Add to `/app/globals.css`:

```css
@keyframes my-animation {
  from { /* start state */ }
  to { /* end state */ }
}
```

Use in components:

```tsx
<div className="animate-[my-animation_1s_ease-in-out]">
  Content
</div>
```

---

## Common Patterns

### Loading State
```tsx
{loading ? (
  <LoadingSpinner size="lg" />
) : (
  <Content />
)}
```

### Empty State
```tsx
<div className="glass-premium rounded-3xl p-16 text-center">
  <div className="text-6xl mb-6">🎯</div>
  <h2 className="text-2xl font-bold gradient-text mb-4">
    No Items Found
  </h2>
  <p className="text-slate-600 dark:text-slate-400 mb-8">
    Get started by creating your first item
  </p>
  <Button variant="primary" size="xl">
    Create Item
  </Button>
</div>
```

### Success Message
```tsx
<div className="glass-premium rounded-2xl p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/10">
  <div className="flex items-center gap-3">
    <span className="text-3xl">✓</span>
    <div>
      <h3 className="font-bold text-slate-900 dark:text-slate-100">
        Success!
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Operation completed successfully
      </p>
    </div>
  </div>
</div>
```

---

## 🎉 You're Ready!

You now have a complete premium design system at your fingertips. Use these components and patterns to maintain the high-quality visual design throughout your application.

**Remember:**
- Keep it consistent
- Test in both light and dark mode
- Maintain accessibility
- Use animations purposefully
- Have fun! 🚀
