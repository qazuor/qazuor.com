/**
 * NavIconId Resolver — SPEC-001 Phase 2.
 *
 * Maps the UI-library-agnostic `NavIconId` string identifiers declared in
 * `src/data/navigation.ts` to the actual React icon components the
 * `FloatingNav` (and any future nav surface) renders.
 *
 * Why this lives in its own module:
 *
 * - `src/data/navigation.ts` stays free of UI-library coupling (no React or
 *   `lucide-react` import). This keeps the data layer serializable, easy to
 *   reason about, and trivially testable.
 * - Adding a new icon means: append the identifier to the `NavIconId` union
 *   in `src/data/navigation.ts`, add the mapping here, and ship.
 * - The `resolveNavIcon` helper is the only public API consumers should use.
 *   Direct access to `NavIconComponentMap` is allowed but should be treated
 *   as read-only.
 *
 * Contract:
 *
 * - `resolveNavIcon(id)` MUST return a valid `LucideIcon` (a `React.ComponentType`)
 *   for every `NavIconId` value.
 * - The function never throws. If a new identifier is added to the union but
 *   is not mapped here, a `console.warn` is emitted in development builds and
 *   a `CircleHelp` icon is returned as a visible fallback. This is intentional
 *   — we want missing mappings to be obvious in the UI rather than crash the
 *   nav.
 */

import {
    BadgeCheck,
    BriefcaseBusiness,
    CircleHelp,
    FileText,
    FolderGit2,
    Gift,
    Home,
    type LucideIcon,
    Mail,
    MessageSquareQuote,
    UserRound
} from 'lucide-react';
import type { NavIconId } from './navigation';

/**
 * Map of stable icon identifiers to their `lucide-react` component.
 *
 * Treated as a private lookup. Consumers should use `resolveNavIcon` so
 * fallback behavior stays consistent.
 */
export const NavIconComponentMap: Readonly<Record<NavIconId, LucideIcon>> = {
    home: Home,
    user: UserRound,
    'badge-check': BadgeCheck,
    'folder-git': FolderGit2,
    briefcase: BriefcaseBusiness,
    'file-text': FileText,
    'message-quote': MessageSquareQuote,
    'help-circle': CircleHelp,
    mail: Mail,
    gift: Gift
} as const;

/**
 * Resolve a `NavIconId` to its `lucide-react` icon component.
 *
 * @param id - The stable icon identifier declared on a `NavItem.icon` field.
 * @returns A `lucide-react` icon component. Returns `CircleHelp` as a
 *   visible fallback if the id is not mapped (e.g. a new identifier was
 *   added to the union but not yet wired here). Logs a dev-only `console.warn`
 *   when this happens.
 */
export function resolveNavIcon(id: NavIconId | undefined): LucideIcon {
    if (!id) {
        return CircleHelp;
    }
    const Icon = NavIconComponentMap[id];
    if (!Icon) {
        if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.warn(`[navIcons] No icon mapping for NavIconId "${id}". Falling back to CircleHelp.`);
        }
        return CircleHelp;
    }
    return Icon;
}
