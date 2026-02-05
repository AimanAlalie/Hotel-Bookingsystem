# Language Switcher (i18n) Implementation Plan

## Overview

Implement bilingual English/Arabic support with full RTL layout transformation for the hotel booking system.

## Scope

- Language switcher component in navigation
- Translation system for all UI text
- RTL/LTR layout switching based on language
- Language preference persistence (localStorage)
- All existing pages updated with translations

## Architecture Decisions

1. **No i18n library** - Simple JSON-based translations (lightweight, no dependencies)
2. **Context-based** - LanguageProvider pattern matching existing AuthProvider
3. **Tailwind RTL** - Use `rtl:` and `ltr:` variants for directional styling
4. **Client-side switching** - No URL-based routing (simpler implementation)

## Tasks

### Task 1: Save Spec Documentation
Create `agent-os/specs/2026-02-03-language-switcher/` with plan.md, shape.md, standards.md

### Task 2: Install and Configure Tailwind CSS
- Install tailwindcss, postcss, autoprefixer
- Create tailwind.config.js and postcss.config.js
- Update globals.css with Tailwind directives

### Task 3: Create Translation Files
- src/locales/en.json - English translations
- src/locales/ar.json - Arabic translations

### Task 4: Create LanguageProvider
- Context with language, setLanguage, t() function
- Load/save preference to localStorage
- useLanguage() hook export

### Task 5: Create LanguageSwitcher Component
- Toggle button (EN | عربي)
- Tailwind classes only
- Accessible (aria labels)

### Task 6: Update Root Layout for RTL
- Add LanguageProvider wrapper
- Dynamic dir attribute on html (rtl/ltr)
- Dynamic lang attribute (en/ar)

### Task 7: Update Navigation Component
- Use t() for translations
- Add LanguageSwitcher
- Convert CSS Modules to Tailwind
- RTL-aware spacing

### Task 8-12: Update All Pages
- Homepage, auth pages, booking flow, hotel pages, admin pages
- Replace German text with translation keys
- Convert to Tailwind classes
- RTL-aware layouts

## Verification

1. Language switching works and persists on refresh
2. RTL layout correct in Arabic mode
3. All pages translated
4. No console errors
