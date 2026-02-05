# Applied Standards - Language Switcher

## Tailwind CSS (css/styling-approach)

- All new components use Tailwind utility classes only
- Convert existing CSS Modules to Tailwind where touched
- RTL utilities: `rtl:`, `ltr:`, `rtl:space-x-reverse`
- No inline styles for layout - use Tailwind

## Tech Stack (global/tech-stack)

- Next.js 14 App Router patterns
- React Context for state management
- No external i18n libraries (next-intl, react-i18next, etc.)
- Client components marked with 'use client'

## Component Patterns

- Provider pattern matching AuthProvider structure
- Custom hooks (useLanguage) for accessing context
- Separation: LanguageProvider (logic) vs LanguageSwitcher (UI)

## File Organization

- Translations in src/locales/*.json
- Provider in src/components/providers/
- UI component in src/components/

## Accessibility

- Language switcher has aria-label
- dir attribute on html for screen readers
- lang attribute for proper text-to-speech
