# Projekt-Kontext für Bachelorarbeit

## WICHTIG - Bitte beachten

Dies ist mein **Bachelorarbeit-Projekt**. Der Code und alle Texte müssen:
- Menschlich und studentisch wirken (kein KI-Style)
- Keine Plagiate enthalten
- Individuell und authentisch sein
- Bei Quellen: Umformulieren, nicht 1:1 kopieren

---

## Projektübersicht

**Name:** YemenStay - Webbasiertes Hotelbuchungssystem
**Technologie:** Next.js 14 (App Router), React 18, Supabase, Tailwind CSS
**Zweck:** Prototyp für Bachelorarbeit über Usability in Hotelbuchungssystemen

### Anwendungsszenario
Hotels in drei jemenitischen Städten: **Sanaa, Taiz, Aden**
(Repräsentieren Nord, Mitte, Süd des Landes)

---

## Systemarchitektur

### Frontend (Next.js App Router)
```
src/
├── app/
│   ├── page.js              # Startseite (Hotels, Destinationen)
│   ├── search/              # Suchseite mit Filteroptionen
│   ├── hotel/[id]/          # Hoteldetails + Zimmerliste
│   ├── booking/             # Buchungsformular
│   │   ├── confirmation/    # Buchungsbestätigung
│   │   └── checkout-choice/ # Checkout-Auswahl
│   ├── my-bookings/         # Eigene Buchungen (eingeloggt)
│   ├── login/               # Login-Seite
│   ├── register/            # Registrierung
│   └── admin/               # Admin-Bereich
│       ├── hotels/          # Hotels verwalten
│       ├── rooms/           # Zimmer verwalten
│       └── bookings/        # Buchungen verwalten
├── components/
│   ├── Navigation.js        # Hauptnavigation
│   ├── Footer.js            # Footer
│   ├── LanguageSwitcher.js  # EN/AR Umschalter
│   └── providers/
│       ├── AuthProvider.js      # Authentifizierung
│       └── LanguageProvider.js  # Mehrsprachigkeit (i18n)
└── lib/
    └── supabase/            # Supabase Client (Server/Browser)
```

### Backend (API Routes)
```
src/app/api/
├── hotels/          # GET, POST Hotels
├── hotels/[id]/     # GET, PUT, DELETE einzelnes Hotel
├── rooms/           # GET, POST Zimmer
├── rooms/[id]/      # GET, PUT, DELETE einzelnes Zimmer
├── bookings/        # GET, POST Buchungen
├── bookings/[id]/   # GET, PUT, DELETE einzelne Buchung
├── search/          # Suche mit Filtern
└── upload/          # Bildupload
```

### Datenbank (Supabase/PostgreSQL)
```
hotels
├── id, name, city, address, description, image_url
├── name_en, name_ar (mehrsprachig)
└── description_en, description_ar

rooms
├── id, hotel_id, name, price, capacity
├── name_en, name_ar
└── image_url

bookings
├── id, room_id, user_id (optional)
├── firstname, lastname, email
├── check_in, check_out
└── created_at, status
```

---

## Kernfunktionen

### Gast-Bereich
1. **Startseite:** Beliebte Destinationen, Featured Hotels
2. **Suche:** Nach Stadt, Datum, Preis filtern
3. **Hoteldetails:** Beschreibung, Zimmerauswahl
4. **Buchung:** Formular mit Validierung, Bestätigungsseite
5. **Meine Buchungen:** (nur eingeloggt) eigene Buchungen einsehen

### Admin-Bereich
1. **Dashboard:** Statistiken (Hotels, Zimmer, Buchungen)
2. **Hotels verwalten:** CRUD-Operationen
3. **Zimmer verwalten:** CRUD-Operationen
4. **Buchungen verwalten:** Status ändern, löschen

### Zusatzfeatures
- **Mehrsprachigkeit:** Englisch und Arabisch
- **Responsive Design:** Mobile-first mit Tailwind CSS
- **Authentifizierung:** Supabase Auth (optional für Gäste)

---

## Thema der Bachelorarbeit

**Titel:** Konzeption und prototypische Umsetzung eines webbasierten Hotelbuchungssystems mit Fokus auf Gebrauchstauglichkeit

### Fokus
- Benutzerorientierte Gestaltung (Usability)
- Digitalisierung manueller Prozesse (Excel → Web)
- Usability-Evaluation mit echten Testpersonen

### Was NICHT Teil der Arbeit ist
- Zahlungsintegration
- Skalierung für viele Nutzer
- Umfassendes Sicherheitskonzept

---

## Kapitelstruktur der Arbeit

1. **Einleitung** - Motivation, Zielsetzung, Aufbau
2. **Theoretische Grundlagen** - Usability, UX, Nielsen-Heuristiken
3. **Anforderungsanalyse** - Nutzergruppen, funktionale/nicht-funktionale Anforderungen
4. **Konzeption** - UI-Design, Navigationskonzept, Buchungsprozess
5. **Prototypische Umsetzung** - Architektur, Implementierung
6. **Evaluation** - Usability-Tests, Fragebogen, Ergebnisse
7. **Fazit** - Zusammenfassung, Ausblick

---

## Wie das Projekt funktioniert (Abläufe)

### Buchungsablauf (User Flow)

```
[Startseite]
    │
    ├──► Klick auf "Suchen" oder Destination
    ▼
[Suchseite] ──► Filter: Stadt, Datum, Preis
    │
    ▼
[Hoteldetails] ──► Zimmerliste anzeigen
    │
    ├──► Zimmer auswählen ──► sessionStorage speichert:
    │                         - selectedHotel (JSON)
    │                         - selectedRoom (JSON)
    ▼
[Buchungsformular]
    │
    ├──► Formular ausfüllen (Name, Email, Datum)
    ├──► Validierung im Frontend
    ├──► POST /api/bookings
    │       │
    │       ├──► Verfügbarkeit prüfen (Konflikt-Check)
    │       ├──► Buchung in DB speichern
    │       └──► Bestätigungs-Email senden (Resend)
    ▼
[Bestätigungsseite] ──► Buchungsdaten aus sessionStorage anzeigen
```

### Datenfluss: Frontend ↔ Backend ↔ Datenbank

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (React Components)                                │
│                                                             │
│  page.js / BookingPage.js                                   │
│      │                                                      │
│      │ fetch('/api/...')                                    │
│      ▼                                                      │
├─────────────────────────────────────────────────────────────┤
│  API ROUTES (Next.js Server)                                │
│                                                             │
│  /api/bookings/route.js                                     │
│      │                                                      │
│      │ createClient() ──► Supabase Client erstellen         │
│      │                                                      │
│      │ supabase.from('bookings').select/insert/update       │
│      ▼                                                      │
├─────────────────────────────────────────────────────────────┤
│  DATENBANK (Supabase/PostgreSQL)                            │
│                                                             │
│  hotels ◄───┐                                               │
│     │       │ hotel_id (FK)                                 │
│     │       │                                               │
│  rooms ─────┘                                               │
│     │                                                       │
│     │ room_id (FK)                                          │
│     ▼                                                       │
│  bookings                                                   │
│     │                                                       │
│     │ user_id (FK, optional)                                │
│     ▼                                                       │
│  auth.users (Supabase Auth)                                 │
└─────────────────────────────────────────────────────────────┘
```

### Datenbank-Relationen

```
hotels (1) ────► (n) rooms (1) ────► (n) bookings
                                          │
                                          │ optional
                                          ▼
                                    auth.users
```

**Beispiel-Query mit Relations:**
```javascript
// Buchung mit Room und Hotel laden
supabase.from('bookings').select(`
  *,
  rooms (
    id, name, price,
    hotels (id, name, city)
  )
`)
```

### Mehrsprachigkeit (i18n)

```
LanguageProvider (Context)
    │
    ├──► Sprache in localStorage speichern
    ├──► document.dir = 'rtl' für Arabisch
    │
    ▼
useLanguage() Hook
    │
    ├──► t('booking.title') ──► "Book Your Room" (EN)
    │                      ──► "احجز غرفتك" (AR)
    │
    └──► Übersetzungen aus:
         - src/locales/en.json
         - src/locales/ar.json
```

### Authentifizierung

```
AuthProvider (Context)
    │
    ├──► Supabase Auth Session prüfen
    ├──► user-Objekt bereitstellen
    │
    ▼
useAuth() Hook
    │
    ├──► user (null wenn nicht eingeloggt)
    ├──► signIn(email, password)
    ├──► signUp(email, password)
    └──► signOut()

Buchung OHNE Login möglich:
    - user_id wird auf NULL gesetzt
    - Email wird trotzdem gespeichert

Admin-Prüfung:
    - isAdmin(user) prüft user.email gegen ADMIN_EMAILS
    - Nur Admins sehen /admin Bereich
```

### Verfügbarkeitsprüfung (Konflikt-Check)

```javascript
// Prüft ob Zimmer im Zeitraum bereits gebucht ist
const { data: conflicts } = await supabase
  .from('bookings')
  .select('id')
  .eq('room_id', room_id)
  .lt('check_in', check_out)   // Buchung beginnt vor neuem Check-out
  .gt('check_out', check_in)   // Buchung endet nach neuem Check-in

// Wenn conflicts.length > 0 → Zimmer nicht verfügbar (HTTP 409)
```

---

## Wichtige Hinweise für Texthilfe

- **Quellen:** Immer umformulieren, nie 1:1 zitieren
- **Stil:** Akademisch aber nicht übertrieben perfekt
- **Formulierungen:** "sowohl...als auch" nicht zu oft, natürlich variieren
- **Persönlicher Bezug:** Jemen-Kontext macht die Arbeit individuell
- **ISO 9241-11:** Standardquelle für Usability-Definition
- **Nielsen:** "10 Usability Heuristics" als Gestaltungsgrundlage
