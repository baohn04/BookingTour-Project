---
trigger: always_on
---

# 📜 PROJECT ARCHITECTURE & DESIGN SYSTEM

This document serves as the source of truth for all development tasks. AI must adhere to these constraints for every response.

---

## 🛠 1. TECH STACK
- **Frontend:** ReactJS, TailwindCSS, Ant-Design (Antd).
- **Backend:** ExpressJS, TypeScript.
- **Styling:** Global CSS Variables + Tailwind Utility Classes.

---

## 🎨 2. BRAND COLOR PALETTE (CSS VARIABLES)
Colors are defined globally in CSS and mapped to Tailwind. Do not hardcode hex codes in components; use Tailwind classes or CSS variables.

| Token | CSS Variable | HEX Equivalent | Description |
| :--- | :--- | :--- | :--- |
| **Primary** | `var(--color-primary)` | `#F97316` | Orange-500 (Main Action) |
| **Primary Hover** | `var(--color-primary-hover)` | `#EA580C` | Orange-600 (Hover State) |
| **Background** | `var(--color-background)` | `#FFFFFF` | Main Page Background |
| **Text 1** | `var(--color-text1)` | `#05073C` | Main Heading/Body (Dark Blue) |
| **Text 2** | `var(--color-text2)` | `#FFFFFF` | Contrast Text (White) |
| **Text 3** | `var(--color-text3)` | `#EB662B` | Accent/Highlight (Bright Orange) |

---

## 📋 3. DEVELOPMENT GUIDELINES

### Frontend (React + Antd + Tailwind)
- **Ant Design First:** Always prioritize using built-in Ant Design components (Button, Input, Table, etc.) instead of custom ones.
- **Ant Design Grid:** - Use `<Row>` and `<Col>` for layout.
    - Implement responsiveness using Antd Grid breakpoints (`xs`, `sm`, `md`, `lg`, etc.).
- **Styling Method:** - Use Tailwind classes (e.g., `text-primary`, `bg-primary`, `text-text1`).
    - For Ant Design components, override styles using the global CSS variables or Tailwind's `@apply` in CSS files to ensure they match the brand colors.
- **Architecture:** Functional Components with Hooks.

### Backend (Express + TypeScript)
- **Strict Typing:** Define `Interface` or `Type` for every Request and Response.
- **Structure:** Controller-Service-Route pattern.

---

## ⚠️ 4. AI INSTRUCTIONS FOR NEW CHATS
- **Styling Advice:** When suggesting code, use Tailwind classes mapped to the variables (e.g., `className="text-primary"`).
- **Antd Customization:** If an Antd component needs a color change, suggest using a custom `className` or `style={{ color: 'var(--color-primary)' }}`.
- **Layout:** Always use `<Row>` and `<Col>` with responsive props when building structures.