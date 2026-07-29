# EaglEye Design System

A React design system for the EaglEye threat-intelligence platform, built on
**shadcn/ui + Tailwind v4** with a single blue brand and full light/dark support.
Consumed as source via the `@design-pattern` (and `design-wrapper-component`)
aliases, or via the prebuilt `dist/design-system.css`.

```js
import { Button, StatsCard, Tabs } from '@design-pattern';
import '@design-pattern/styles/design-system.css'; // tokens + Geist font + utilities
```

## Theming

- One blue brand theme, light + dark, WCAG-AA.
- **Dark mode is the `.dark` class on `<html>`** — toggle it however you manage theme:
  ```js
  document.documentElement.classList.toggle('dark', isDark);
  ```
- Colors come from CSS variables (`--background`, `--primary`, `--sidebar`, severity
  `--critical/--high/--medium/--low`, …) exposed as Tailwind utilities
  (`bg-card`, `text-foreground`, `border-border`, `bg-primary`, …).
- Typeface: **Geist** (sans + mono), self-hosted.

## What's inside

**Library components** (`@design-pattern`)
`Button`, `Sidebar`, `RightSidebar`, `Tabs`, `AppInput`, `UnifiedSelect`,
`StatsCard`, `ColumnVisibilityMenu`, `BaseAccordion`, `PageLoader`, `LiveClock`,
`NoGraphData`, `ThemeSelection`, `ToastProvider`/`useToast`, `ErrorBoundary`,
`Error404Page`, `CardStructureLoader`.

**shadcn/ui primitives** (`@design-pattern/components/ui/*`)
The full standard catalog — accordion, alert(-dialog), avatar, badge, breadcrumb,
button(-group), calendar, card, carousel, chart (recharts), checkbox, collapsible,
combobox, command, context-menu, dialog, drawer, dropdown-menu, empty, field,
hover-card, input(-group/-otp), item, kbd, label, menubar, native-select,
navigation-menu, pagination, popover, progress, radio-group, resizable,
scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner,
switch, table, tabs, textarea, toggle(-group), tooltip.

**Chart / card wrappers** (`@design-pattern/chartsComponents/chartWrappers/*`)
echarts-based: area, line, vertical/horizontal bar, donut, nightingale, heatmap,
geo-location map. shadcn-Card-based: metric cards, risk score, list card, top
cards, table, MTTD/MTTR, threat list, exploit attempts, malware/actors. All
light/dark aware; `EagleEyeLoader` is the shared loading state.

**Tokens** — `colors.js` (`sidebarColors`, `chartColors`, `fontStyles`),
`spacing.js`, `commonStyles.js`, `sidePanelTheme.js`.

## Preview / develop

```bash
pnpm install
pnpm dev        # playground — every component, light + dark (?mode=light, #charts, …)
pnpm build      # builds dist/design-system.css + copies Geist fonts to dist/files/
```

## Host setup

Components keep their old export names and props. Three host-side steps:

1. `pnpm install` — picks up the new deps.
2. Dark mode reads a `.dark` class on `<html>`:
   `document.documentElement.classList.toggle('dark', isDark)`.
3. The `Sidebar` is shadcn-bedrock — wrap the app in `SidebarProvider` and put
   page content in a sibling `SidebarInset` (it handles the offset; no manual
   `marginLeft`):

```jsx
<SidebarProvider defaultOpen>
  <Sidebar menuItems={MENU} logo={logo} title="EaglEye" showLogout onLogout={logout} />
  <SidebarInset>
    <header className="flex h-14 items-center gap-2 border-b border-border px-4">
      {/* your topbar */}
    </header>
    {children}
  </SidebarInset>
</SidebarProvider>
```

`menuItems`: `{ icon, title, path?, children?, onClick?, variant?, active? }`.
`onOpenChange` still fires with the open state.

## 1.1.0 — logo is the collapse control

No host changes; pull the version and it applies. The sidebar logo toggles the
rail on click and swaps to a panel icon on hover (⌘/Ctrl+B and the rail edge
still work). Collapsed to icon mode, the logo is also how it re-opens.

`<SidebarTrigger />` now renders `null` on desktop — a second toggle in the page
header is redundant. Existing markup stays valid, it just disappears. It still
renders on **mobile**, where the sidebar is a sheet and the logo is unreachable
while closed. `<SidebarTrigger force />` always renders it.

Dependencies: `echarts` → `^6.1.0` (fixes GHSA-fgmj-fm8m-jvvx XSS; chart wrapper
APIs unchanged), `postcss` pinned `>=8.5.18` via `pnpm-workspace.yaml` overrides
(GHSA-r28c-9q8g-f849, build-time only). Still open: GHSA-qwww-vcr4-c8h2
(`react-router` RSC CSRF) has no fix below `react-router@8.3.0` and
`react-router-dom` has no v8 line — not reachable from this library (client
`Link`/`useLocation` only, no RSC actions), and it is a peer dep, so the version
is the host's call.
