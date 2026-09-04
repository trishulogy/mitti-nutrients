# Nutrient Intelligence Dashboard

A high-performance, mobile-first nutrient intelligence dashboard built for farmers, featuring low-literacy accessibility, multi-lingual support, and offline-first functionality.

---

## Project Overview

The **Nutrient Intelligence Dashboard** is designed to provide actionable soil telemetry insights without overwhelming the user with raw data. It prioritizes a "Farmer-First" approach by utilizing visual traffic-light indicators, localized multi-lingual text-to-speech support, and persistent raw-value displays.

### Key Architectural Components
- **AccessibilityBar**: Sticky header providing instant language selection and text-to-speech audio triggers.
- **HealthHeroBanner**: High-level, color-coded soil health summary banner with dynamic timestamps.
- **NutrientGrid & VisualStatusGauge**: Full-width "hamburger" style cards rendering individual parameter statuses (Nitrogen, Phosphorus, Potassium, Soil pH, EC) alongside prominent raw telemetry values.
- **Zustand Stores**: Centralized state management handling locales, connectivity tracking, and sensor telemetry.

---

## Tech Stack

* **Framework**: React 18 with TypeScript
* **Styling**: Tailwind CSS utilizing the clean Geist typography typeface
* **State Management**: Zustand
* **Animation**: Framer Motion

---

## Setup & Installation Guide

To run this project locally on your machine, follow these steps:

### Prerequisites
Make sure you have **Node.js** (version 16 or higher) installed on your system.

### 1. Clone or Open the Project
Open your terminal and navigate to the root directory of your project folder.

### 2. Install Dependencies
Run the following command to install all required packages and dependencies:
```bash
npm install

npm run dev
```
### 3. Open in Your Browser
Copy the local development URL provided in your terminal (typically http://localhost:5173) and open it in your browser to view the live application.
