import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import fiverrIcon from '../../icons/social/fiverr.svg?raw';
import githubIcon from '../../icons/social/github.svg?raw';
import linkedinIcon from '../../icons/social/linkedin.svg?raw';
import upworkIcon from '../../icons/social/upwork.svg?raw';
import folderIcon from '../../icons/ui/folder.svg?raw';
import homeIcon from '../../icons/ui/home.svg?raw';
import newspaperIcon from '../../icons/ui/newspaper.svg?raw';
import searchIcon from '../../icons/ui/search.svg?raw';

interface CommandPaletteProps {
  lang: string;
  ariaLabel?: string;
  placeholder?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    fiverr?: string;
    upwork?: string;
  };
}

export function CommandPalette({
  lang,
  ariaLabel = 'Close command palette',
  placeholder = 'Type a command or search...',
  socialLinks = {
    github: 'https://github.com/qazuor',
    linkedin: 'https://linkedin.com/in/qazuor',
    fiverr: 'https://www.fiverr.com/sellers/leandroasrilevi/',
    upwork: 'https://www.upwork.com/freelancers/~01881c38344e9431d7',
  },
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  // Toggle with Ctrl+K or Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigate = (path: string) => {
    window.location.href = `/${lang}${path}`;
    setOpen(false);
  };

  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-label={ariaLabel}
      />

      {/* Command Palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl">
        <Command className="glass rounded-lg border overflow-hidden">
          <div className="flex items-center border-b border-foreground/10 px-4">
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
            <span dangerouslySetInnerHTML={{ __html: searchIcon }} />
            <Command.Input
              placeholder={placeholder}
              className="flex-1 px-4 py-4 bg-transparent border-0 outline-none text-foreground placeholder:text-foreground-muted"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-foreground-muted bg-foreground/5 rounded">
              <span className="text-xs">ESC</span>
            </kbd>
          </div>

          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-foreground-muted">
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Navigation"
              className="px-2 pt-2 pb-1 text-xs font-semibold text-foreground-muted"
            >
              <Command.Item
                onSelect={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-foreground/5 cursor-pointer aria-selected:bg-foreground/5"
              >
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
                <span dangerouslySetInnerHTML={{ __html: homeIcon }} />
                <span>Home</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate('/projects')}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-foreground/5 cursor-pointer aria-selected:bg-foreground/5"
              >
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
                <span dangerouslySetInnerHTML={{ __html: folderIcon }} />
                <span>Projects</span>
              </Command.Item>

              <Command.Item
                onSelect={() => navigate('/blog')}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-foreground/5 cursor-pointer aria-selected:bg-foreground/5"
              >
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
                <span dangerouslySetInnerHTML={{ __html: newspaperIcon }} />
                <span>Blog</span>
              </Command.Item>
            </Command.Group>

            <Command.Separator className="my-2 h-px bg-foreground/10" />

            <Command.Group
              heading="Social"
              className="px-2 pt-2 pb-1 text-xs font-semibold text-foreground-muted"
            >
              <Command.Item
                onSelect={() => openExternal(socialLinks.github || 'https://github.com/qazuor')}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-foreground/5 cursor-pointer aria-selected:bg-foreground/5"
              >
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
                <span dangerouslySetInnerHTML={{ __html: githubIcon }} />
                <span>GitHub</span>
              </Command.Item>

              <Command.Item
                onSelect={() =>
                  openExternal(socialLinks.linkedin || 'https://linkedin.com/in/qazuor')
                }
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-foreground/5 cursor-pointer aria-selected:bg-foreground/5"
              >
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
                <span dangerouslySetInnerHTML={{ __html: linkedinIcon }} />
                <span>LinkedIn</span>
              </Command.Item>

              <Command.Item
                onSelect={() =>
                  openExternal(
                    socialLinks.fiverr || 'https://www.fiverr.com/sellers/leandroasrilevi/',
                  )
                }
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-foreground/5 cursor-pointer aria-selected:bg-foreground/5"
              >
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
                <span dangerouslySetInnerHTML={{ __html: fiverrIcon }} />
                <span>Fiverr</span>
              </Command.Item>

              <Command.Item
                onSelect={() =>
                  openExternal(
                    socialLinks.upwork || 'https://www.upwork.com/freelancers/~01881c38344e9431d7',
                  )
                }
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-foreground/5 cursor-pointer aria-selected:bg-foreground/5"
              >
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG from trusted local file */}
                <span dangerouslySetInnerHTML={{ __html: upworkIcon }} />
                <span>Upwork</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
