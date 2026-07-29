import React, { useState } from 'react';
import { AlertOctagon, Shield, Activity, Bug, Rss, Database } from 'lucide-react';

// The package entry point, imported exactly the way a host app imports it.
// Anything exported here that fails to resolve breaks the build of this view —
// which is the point: the rest of the playground deep-imports source files and
// never exercises the barrel.
import * as DesignSystem from '../../index.js';
import * as Loaders from '../../loaders/index.js';
import * as OceanTheme from '../../theam/ocean.jsx';

import { StatChip } from '../../components/ui/stat-chip';
import { DirectionProvider } from '../../components/ui/direction';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';

function Section({ title, note, children }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
      </div>
      <div className="rounded-xl border border-border bg-card p-6">{children}</div>
    </section>
  );
}

const describe = (value) => {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  const t = typeof value;
  if (t === 'function') return value.prototype?.isReactComponent || /^[A-Z]/.test(value.name || '') ? 'component' : 'function';
  if (t === 'object') return Array.isArray(value) ? `array(${value.length})` : `object(${Object.keys(value).length})`;
  return t;
};

/* Every named export of the barrel, with what it actually resolved to. An
   export that drifted (renamed file, deleted component) shows as `undefined`
   here instead of failing silently in a host app. */
function BarrelTable({ title, module: mod, note }) {
  const entries = Object.entries(mod).sort(([a], [b]) => a.localeCompare(b));
  const broken = entries.filter(([, v]) => v === undefined);

  return (
    <Section
      title={title}
      note={note}
    >
      <div className="mb-4 flex items-center gap-2">
        <Badge variant={broken.length ? 'destructive' : 'secondary'}>
          {entries.length} exports
        </Badge>
        {broken.length > 0 && (
          <Badge variant="destructive">{broken.length} unresolved</Badge>
        )}
      </div>
      <div className="max-h-80 overflow-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/60 backdrop-blur">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Export</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Resolves to</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([name, value]) => (
              <tr key={name} className="border-t border-border">
                <td className="px-3 py-1.5 font-mono text-xs text-foreground">{name}</td>
                <td
                  className={`px-3 py-1.5 font-mono text-xs ${
                    value === undefined ? 'text-destructive' : 'text-muted-foreground'
                  }`}
                >
                  {describe(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

const CHIP_TONES = [
  'teal', 'periwinkle', 'sage', 'amber', 'coral', 'violet',
  'critical', 'high', 'medium', 'low', 'muted',
];
const CHIP_ICONS = [AlertOctagon, Shield, Activity, Bug, Rss, Database];

function StatChipDemo() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {CHIP_TONES.map((tone, i) => {
          const Icon = CHIP_ICONS[i % CHIP_ICONS.length];
          return (
            <div key={tone} className="flex flex-col items-center gap-1.5">
              <StatChip tone={tone}>
                <Icon />
              </StatChip>
              <span className="font-mono text-[11px] text-muted-foreground">{tone}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-end gap-3">
        {['sm', 'md', 'lg'].map((size) => (
          <div key={size} className="flex flex-col items-center gap-1.5">
            <StatChip tone="teal" size={size}>
              <Shield />
            </StatChip>
            <span className="font-mono text-[11px] text-muted-foreground">{size}</span>
          </div>
        ))}
      </div>
      {/* In context: the chip is meant to sit inside a stat tile */}
      <Card className="max-w-xs">
        <CardContent className="flex items-center gap-3 p-4">
          <StatChip tone="critical" size="lg">
            <AlertOctagon />
          </StatChip>
          <div>
            <div className="text-2xl font-semibold tabular-nums">128</div>
            <div className="text-sm text-muted-foreground">Critical findings</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* Radix primitives read direction from context — this is the only place the
   RTL path gets exercised. Flip it and check that Select/Checkbox/Input chrome
   mirrors instead of staying stuck LTR. */
function DirectionDemo() {
  const [dir, setDir] = useState('ltr');
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['ltr', 'rtl'].map((d) => (
          <Button key={d} size="sm" variant={dir === d ? 'default' : 'outline'} onClick={() => setDir(d)}>
            {d.toUpperCase()}
          </Button>
        ))}
      </div>
      <DirectionProvider dir={dir}>
        <div dir={dir} className="space-y-4 rounded-lg border border-border p-4">
          <div className="space-y-2">
            <Label htmlFor="rtl-input">Search</Label>
            <Input id="rtl-input" placeholder={dir === 'rtl' ? 'بحث عن مؤشر' : 'Search indicators'} />
          </div>
          <Select>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Checkbox id="rtl-check" defaultChecked />
            <Label htmlFor="rtl-check">Only confirmed</Label>
          </div>
        </div>
      </DirectionProvider>
    </div>
  );
}

/* The mobile sidebar is a Sheet, and as of 1.1.0 <SidebarTrigger /> renders
   only at mobile widths — neither is reachable in a desktop viewport. Same-origin
   iframe at a phone width so the sheet + trigger are previewable side by side. */
function MobileFrame() {
  const [width, setWidth] = useState(390);
  const src = typeof window !== 'undefined'
    ? `${window.location.pathname}${window.location.search}#library`
    : '';
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: 'iPhone SE — 375', value: 375 },
          { label: 'iPhone 15 — 390', value: 390 },
          { label: 'Tablet — 768', value: 768 },
        ].map((preset) => (
          <Button
            key={preset.value}
            size="sm"
            variant={width === preset.value ? 'default' : 'outline'}
            onClick={() => setWidth(preset.value)}
          >
            {preset.label}
          </Button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          Below 768px the sidebar becomes a sheet and the header trigger appears.
        </span>
      </div>
      <div className="overflow-x-auto">
        <iframe
          key={width}
          title={`Playground at ${width}px`}
          src={src}
          style={{ width, height: 620 }}
          className="rounded-xl border border-border bg-background"
        />
      </div>
    </div>
  );
}

const isColor = (v) => typeof v === 'string' && /^(#|rgb|hsl|oklch)/.test(v.trim());

/* theam/ocean.jsx is a raw token module with no component of its own — swatch
   whatever string values look like colors so a bad token is visible. */
function OceanTokens() {
  const groups = Object.entries(OceanTheme)
    .filter(([, v]) => v && typeof v === 'object' && !Array.isArray(v))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {groups.map(([groupName, group]) => {
        const swatches = Object.entries(group).filter(([, v]) => isColor(v));
        if (!swatches.length) return null;
        return (
          <div key={groupName} className="space-y-2">
            <h3 className="font-mono text-xs text-muted-foreground">{groupName}</h3>
            <div className="flex flex-wrap gap-3">
              {swatches.map(([key, value]) => (
                <div key={key} className="flex flex-col items-center gap-1.5">
                  <div
                    className="size-10 rounded-lg border border-border"
                    style={{ background: value }}
                  />
                  <span className="font-mono text-[11px] text-muted-foreground">{key}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ApiSurfaceDemo() {
  const Loader = Loaders.EagleEyeLoader;
  return (
    <div className="space-y-10">
      <BarrelTable
        title="Package entry — index.js"
        module={DesignSystem}
        note="Imported as a host app would (import { … } from 'design-wrapper-component'). Every other view deep-imports source files, so this is the only coverage the public surface gets."
      />

      <BarrelTable
        title="loaders/index.js"
        module={Loaders}
        note="Secondary entry point for the shared loading state."
      />

      <Section title="EagleEyeLoader — via the loaders entry point">
        <div className="grid place-items-center rounded-lg border border-border p-8">
          {Loader ? <Loader /> : <span className="text-destructive">export missing</span>}
        </div>
      </Section>

      <Section
        title="StatChip"
        note="Exported from index.js but previewed nowhere else. Tint is the accent at low alpha; the glyph is the accent at full strength."
      >
        <StatChipDemo />
      </Section>

      <Section title="DirectionProvider — RTL" note="components/ui/direction.tsx.">
        <DirectionDemo />
      </Section>

      <Section title="Mobile viewport" note="Sheet sidebar and the mobile-only SidebarTrigger.">
        <MobileFrame />
      </Section>

      <Section title="theam/ocean.jsx tokens" note="Raw palette module — no component of its own.">
        <OceanTokens />
      </Section>
    </div>
  );
}
