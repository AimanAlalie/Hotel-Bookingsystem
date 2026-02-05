# Language Switcher - Shaping Notes

## Problem

The hotel booking system currently only supports German. Need to add bilingual support for English and Arabic, with proper RTL layout for Arabic.

## Solution Shape

### Translation System
- Simple JSON files for translations (no heavy i18n library)
- Context-based provider matching existing AuthProvider pattern
- t() function for accessing translations by key path

### RTL Support
- Tailwind CSS with rtl: and ltr: variants
- Dynamic dir attribute on html element
- Layout mirroring for Arabic

### Language Persistence
- localStorage for user preference
- Default to English
- Instant switching without page reload

## Key Decisions

1. **No next-intl or similar** - Keeps bundle small, simpler implementation for just 2 languages
2. **Client-side only** - No URL-based language (simpler, no SSR complexity)
3. **Tailwind for RTL** - Native support via rtl: prefix, consistent with styling approach
4. **Replace CSS Modules** - Convert touched files to Tailwind for consistency

## Appetite

Medium - Covers all existing pages, establishes pattern for future additions

## Rabbit Holes to Avoid

- Don't add language detection from browser
- Don't implement URL-based routing
- Don't add more than 2 languages initially
- Don't translate API error messages (keep in English)
