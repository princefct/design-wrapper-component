import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Dot, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import {
  Sidebar as SidebarRoot,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
} from "./components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./components/ui/collapsible";

/**
 * Sidebar — collapsible navigation rail, now built on the shadcn/ui Sidebar
 * bedrock (SidebarProvider → Sidebar → SidebarMenu …). Must be rendered inside
 * a <SidebarProvider> with the page content in a sibling <SidebarInset> (the
 * standard shadcn layout). Public API preserved:
 *   { menuItems, bottomMenuItems, logo, onOpenChange, showLogout, onLogout }
 * Each menu item: { icon, title, path?, children?, onClick?, variant?, active? }.
 */

const isExternalLink = (path = "") => /^https?:\/\//i.test(path);

// Wrap leaf content in the correct navigation target (Link / <a> / <button>).
function NavTarget({ item, children, asSub = false }) {
  const Btn = asSub ? SidebarMenuSubButton : SidebarMenuButton;
  const isAction = typeof item.onClick === "function" && !item.path;

  if (isAction) {
    return (
      <Btn
        onClick={item.onClick}
        tooltip={asSub ? undefined : item.title}
        isActive={item.__active}
        className={
          item.variant === "danger"
            ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
            : undefined
        }
      >
        {children}
      </Btn>
    );
  }

  const path = item.path || "#";
  const link = isExternalLink(path) ? (
    <a href={path} target="_blank" rel="noreferrer">{children}</a>
  ) : (
    <Link to={path}>{children}</Link>
  );

  return (
    <Btn asChild tooltip={asSub ? undefined : item.title} isActive={item.__active}>
      {link}
    </Btn>
  );
}

function MenuEntry({ item }) {
  const location = useLocation();
  const { open: sidebarOpen, setOpen, isMobile } = useSidebar();
  const hasChildren = Boolean(item.children?.length);
  const isAction = typeof item.onClick === "function" && !item.path;

  const childActive = hasChildren && item.children.some((c) => c.path === location.pathname);
  const active =
    item.active ??
    (!isAction && (location.pathname === item.path || childActive));

  const [expanded, setExpanded] = React.useState(childActive);

  // Collapsed to icons there is nowhere for the submenu to render, so the
  // trigger used to be a dead click. Expand the rail first, then open it.
  // preventDefault stops Radix's own toggle (composeEventHandlers respects it)
  // so the two do not fight over the same click.
  const handleSubmenuToggle = (event) => {
    if (!sidebarOpen && !isMobile) {
      event.preventDefault();
      setOpen(true);
      setExpanded(true);
    }
  };

  if (hasChildren) {
    return (
      <Collapsible
        asChild
        open={expanded}
        onOpenChange={setExpanded}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={active}
              onClick={handleSubmenuToggle}
            >
              {item.icon}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((child, i) => (
                <SidebarMenuSubItem key={child.path || child.title || i}>
                  <NavTarget item={{ ...child, __active: location.pathname === child.path }} asSub>
                    {child.icon && <span className="flex size-4 items-center justify-center">{child.icon}</span>}
                    <span>{child.title}</span>
                  </NavTarget>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <NavTarget item={{ ...item, __active: active }}>
        <span className="flex size-4 items-center justify-center">
          {item.icon || <Dot className="size-4" />}
        </span>
        <span>{item.title}</span>
      </NavTarget>
    </SidebarMenuItem>
  );
}

const Sidebar = ({
  menuItems = [],
  bottomMenuItems = [],
  logo,
  title,
  subtitle,
  logoHref,
  onLogoClick,
  onOpenChange,
  showLogout = false,
  onLogout,
}) => {
  const { open, toggleSidebar } = useSidebar();

  // Logo doubles as the collapse control: on hover it cross-fades into a panel
  // icon and clicking it toggles the rail. In icon mode it is the only
  // affordance left, so it is also how the sidebar gets re-opened.
  const toggleLabel = open ? "Collapse sidebar" : "Expand sidebar";
  const logoToggle = logo ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={toggleLabel}
          aria-expanded={open}
          className="group/logo relative grid size-9 shrink-0 place-items-center rounded-md ring-sidebar-ring transition-[width,height,background-color] duration-200 outline-hidden hover:bg-sidebar-accent focus-visible:ring-2 motion-reduce:transition-none group-data-[collapsible=icon]:size-8"
        >
          <img
            src={logo}
            alt={title || "logo"}
            className="size-full object-contain transition-opacity duration-200 group-hover/logo:opacity-0 group-focus-visible/logo:opacity-0 motion-reduce:transition-none"
          />
          <span className="absolute inset-0 grid place-items-center text-sidebar-foreground opacity-0 transition-opacity duration-200 group-hover/logo:opacity-100 group-focus-visible/logo:opacity-100 motion-reduce:transition-none">
            {open ? (
              <PanelLeftClose className="size-5" />
            ) : (
              <PanelLeftOpen className="size-5" />
            )}
          </span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        {toggleLabel}
      </TooltipContent>
    </Tooltip>
  ) : null;

  // Brand text — title + subtitle, sized/styled to match the ti-dev
  // AppSidebar (orbitron title). Hidden by shadcn in icon mode.
  const headerText = (title || subtitle) && (
    <div className="grid min-w-0 flex-1 text-left leading-tight">
      {title && (
        <span className="truncate font-orbitron text-sm font-semibold text-sidebar-foreground">
          {title}
        </span>
      )}
      {subtitle && (
        <span className="truncate text-xs text-sidebar-foreground/70">
          {subtitle}
        </span>
      )}
    </div>
  );

  // Preserve the legacy onOpenChange contract (host offsets / reacts to state).
  React.useEffect(() => {
    if (typeof onOpenChange === "function") onOpenChange(open);
  }, [open, onOpenChange]);

  const canLogout = showLogout && typeof onLogout === "function";
  const resolvedBottom = [
    ...bottomMenuItems,
    ...(canLogout
      ? [{ title: "Logout", icon: <LogOut className="size-4" />, variant: "danger", onClick: onLogout }]
      : []),
  ];

  return (
    <SidebarRoot collapsible="icon">
      {/* h-14 + a bottom border so the brand row lines up with the standard
          shadcn page header (h-14) in the sibling SidebarInset. */}
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border p-0">
        <div className="flex h-14 items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          {logoToggle}
          {headerText &&
            (logoHref ? (
              <Link
                to={logoHref}
                className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden"
              >
                {headerText}
              </Link>
            ) : (
              <div
                onClick={typeof onLogoClick === "function" ? onLogoClick : undefined}
                className={`min-w-0 flex-1 group-data-[collapsible=icon]:hidden ${
                  typeof onLogoClick === "function" ? "cursor-pointer" : ""
                }`}
              >
                {headerText}
              </div>
            ))}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, i) => (
                <MenuEntry key={item.path || item.title || i} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {resolvedBottom.length > 0 && (
        <SidebarFooter>
          <SidebarMenu>
            {resolvedBottom.map((item, i) => (
              <MenuEntry key={`bottom-${item.title || i}`} item={item} />
            ))}
          </SidebarMenu>
        </SidebarFooter>
      )}

      <SidebarRail />
    </SidebarRoot>
  );
};

export default Sidebar;
