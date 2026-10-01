# NomadTax & Visa 🌍✈️

> **Privacy-first Schengen 90/180 compliance engine & 183-day tax residency day-counter for digital nomads, expats, and remote workers.**

[![React 19](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8.svg)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.x-22c55e.svg)](https://recharts.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

---

## 📖 Overview

Planning international stays while avoiding visa overstays and unintentional tax residency is notoriously complex.

**NomadTax & Visa** implements the official **European Commission rolling 180-day window algorithm** alongside worldwide **183-day physical presence tax monitoring**. 

Unlike other tools:
* 🔒 **Zero Server Storage & Zero Tracking**: Runs 100% in your browser using `localStorage`. Your travel data never touches a remote server or database.
* ⚡ **Offline-Ready**: Continues working seamlessly without an active internet connection.
* 🌐 **Multi-Language (i18n)**: Instant switching across **6 languages** (English, Français, Español, Deutsch, Italiano, Português).
* 📊 **Visual Analytics**: Interactive stay duration charts, 60-day status heatmaps, and forward stay simulation.
* 📁 **Audit Export**: One-click CSV export ready for visa interview dossiers or tax filings.

---

## ✨ Key Features

### 1. 🇪🇺 Schengen 90/180 Rolling Window Engine
* Calculates your exact legal status on any reference date using a sliding 180-day retrospective window (`[reference_date - 179 days, reference_date]`).
* Displays **Days Used**, **Days Remaining**, and status flags (**Compliant**, **Caution**, or **Overstay Alert**).
* Auto-detects all 29 official Schengen Area member states (including Croatia, Bulgaria, and Romania).

### 2. 🔮 Forward Stay Simulator
* Plan future trips ahead of time: enter a target arrival date and duration (1 to 90 days).
* Verifies whether your intended stay violates the 90/180 rule and predicts your required departure date or first day of violation.

### 3. 🏛️ 183-Day Tax Residency Monitor
* Tracks days accumulated per country across two selectable modes:
  * **Calendar Year (e.g., 2026)**
  * **Rolling 365 Days**
* Classifies tax residency risk levels (`Safe`, `Moderate`, `Nearing Limit`, `Tax Resident!`) with statutory warnings once approaching the 183-day limit.

### 4. 📊 Stay Duration Distribution Chart (`Recharts`)
* An interactive bar chart visualizing total days per country.
* Categorized with distinct colors for **Schengen Area** vs. **Non-Schengen** destinations.
* Hover tooltips display visit counts, percentage share of travel, and remaining tax allowance buffers.
* Fully interactive with live country search filtering.

### 5. 🗓️ 60-Day Visual Window Heatmap
* Day-by-day strip showing the past 20 days and next 40 days around your reference date.
* Instant visual cues for in-Schengen stays, outside-Schengen stays, and overstay violations.

### 6. 🌍 Multi-Language Support (i18n)
* Supports 6 languages:
  * 🇬🇧 **English** (`en`)
  * 🇫🇷 **Français** (`fr`)
  * 🇪🇸 **Español** (`es`)
  * 🇩🇪 **Deutsch** (`de`)
  * 🇮🇹 **Italiano** (`it`)
  * 🇵🇹 **Português** (`pt`)
* Auto-detects browser locale and persists user selection.
* Fully localized calendar month and day-of-week headers.

### 7. 🔗 Shareable URL Links (Zero-Database Sharing)
* Generate an instant, self-contained share link (`#plan=...`) to send your complete itinerary and calculations to travel partners, clients, or immigration advisors.
* Fully decodes and loads client-side without any cloud database or user accounts.
* Recipient can view the compliance state and click **"Save to My Device"** to import the plan locally.

### 8. 📥 CSV Audit Log Export
* Generates an audit-ready `.csv` file containing Country, ISO code, Arrival, Departure, Counted Days, Schengen status, and Trip purpose.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Bundler & Tooling** | [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Persistence** | Browser `localStorage` (No database required) |
| **Internationalization** | Built-in lightweight type-safe React Context (`i18n`) |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nomadtax-and-visa.git
   cd nomadtax-and-visa
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 📋 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server on port 3000 |
| `npm run build` | Compiles and builds production-ready static assets in `dist/` |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Removes build artifacts (`dist`) |

---

## 📂 Project Structure

```
├── src/
│   ├── components/
│   │   ├── daycounter/
│   │   │   ├── DayCounterApp.tsx             # Main dashboard controller
│   │   │   ├── CountryStayDistributionChart.tsx # Recharts duration distribution
│   │   │   └── DateRangePicker.tsx           # Localized dual-date range selector
│   │   ├── Navigation.tsx                    # Top navigation header & metrics
│   │   └── LanguageSelector.tsx              # Language picker dropdown
│   ├── i18n/
│   │   ├── LanguageContext.tsx               # React Context & language state
│   │   └── translations.ts                   # EN, FR, ES, DE, IT, PT dictionaries
│   ├── utils/
│   │   ├── schengenCalculator.ts             # 90/180 rolling-window algorithm & simulator
│   │   └── taxResidencyCalculator.ts         # 183-day worldwide tax residency engine
│   ├── types.ts                              # Core data models (Trip, SchengenDayStatus, etc.)
│   ├── App.tsx                               # Root application component
│   └── main.tsx                              # Application entry point
├── package.json
└── README.md
```

---

## 🔒 Privacy & Data Storage FAQ

### **Q: Do I need a database or backend server to run this?**
**No.** All calculations, date mathematics, and itinerary records execute strictly inside your client browser. No personal data, dates, or travel logs are ever transmitted to an external server.

### **Q: Where is my travel data saved?**
Data is saved in your browser's private `localStorage` under the keys `utilitylab_user_trips` and `nomadtax_user_lang`. Clearing your browser storage will reset your data, so we recommend using the **"Export Audit"** button regularly to keep a CSV backup.

---

## 📜 Legal Disclaimer

*NomadTax & Visa is an informational tool designed to assist with travel planning and compliance estimates. It does not constitute formal legal, immigration, or tax advice. Always consult official immigration authorities (e.g., European Commission border guidance) and a certified tax advisor for individual determinations.*

---

## 🤝 Contributing

Contributions, feedback, and translations for additional languages are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **Apache-2.0 License**. See [LICENSE](LICENSE) for more information.
