# EaglEye Design System

A React design system for the EaglEye threat-intelligence platform, built on
**shadcn/ui + Tailwind v4** with a single blue brand and full light/dark support.
Consumed as source via the `@design-pattern` (and `design-wrapper-component`)
aliases, or via the prebuilt `dist/design-system.css`.

```js
import { Button, StatsCard, Tabs } from '@design-pattern';
import '@design-pattern/styles/design-system.css'; // tokens + Geist font + utilities
```

## Setup

```bash
pnpm install
```

Dark mode is the `.dark` class on `<html>` — toggle it however you manage theme:

```js
document.documentElement.classList.toggle('dark', isDark);
```

Wrap the app in `SidebarProvider` and put page content in a sibling
`SidebarInset`, which handles the offset and collapse animation:

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
`onOpenChange` fires with the open state. The logo toggles the rail (⌘/Ctrl+B and
the rail edge also work); `<SidebarTrigger />` renders on mobile and touch
devices, `<SidebarTrigger force />` always.

## Theming

- One blue brand theme, light + dark, WCAG-AA.
- Colors come from CSS variables (`--background`, `--primary`, `--sidebar`, severity
  `--critical/--high/--medium/--low`, …) exposed as Tailwind utilities
  (`bg-card`, `text-foreground`, `border-border`, `bg-primary`, …).
- Typeface: **Geist** (sans + mono), self-hosted.
- Scroll containers: `no-scrollbar` hides the bar, `thin-scrollbar` keeps a
  themed one.

## What's inside

**Library components** (`@design-pattern`)
`Button`, `Sidebar`, `RightSidebar`, `Tabs`, `AppInput`, `UnifiedSelect`,
`StatsCard`, `StatChip`, `ColumnVisibilityMenu`, `BaseAccordion`, `PageLoader`,
`LiveClock`, `NoGraphData`, `ThemeSelection`, `ToastProvider`/`useToast`,
`ErrorBoundary`, `Error404Page`, `CardStructureLoader`.

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

## Develop

```bash
pnpm dev        # playground — every component, light + dark (?mode=light, #charts, #api, …)
pnpm build      # builds dist/design-system.css + copies Geist fonts to dist/files/
pnpm typecheck
```
