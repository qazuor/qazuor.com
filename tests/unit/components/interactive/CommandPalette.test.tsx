import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CommandPalette } from '@/components/interactive/CommandPalette';

// Mock the lazy-loaded components
vi.mock('@/components/interactive/CommandPaletteInner', () => ({
    CommandPaletteInner: ({
        isOpen,
        onOpenChange,
        onShowHelp
    }: {
        isOpen: boolean;
        onOpenChange: (open: boolean) => void;
        onShowHelp: () => void;
    }) =>
        isOpen ? (
            <div data-testid="command-palette-inner">
                <button type="button" onClick={() => onOpenChange(false)} data-testid="close-button">
                    Close
                </button>
                <button type="button" onClick={onShowHelp} data-testid="help-button">
                    Help
                </button>
            </div>
        ) : null
}));

vi.mock('@/components/interactive/HelpDialog', () => ({
    HelpDialog: ({
        isOpen,
        onClose,
        onBackToCommandPalette
    }: {
        isOpen: boolean;
        onClose: () => void;
        onBackToCommandPalette: () => void;
    }) =>
        isOpen ? (
            <div data-testid="help-dialog">
                <button type="button" onClick={onClose} data-testid="close-help">
                    Close Help
                </button>
                <button type="button" onClick={onBackToCommandPalette} data-testid="back-to-command">
                    Back
                </button>
            </div>
        ) : null
}));

describe('CommandPalette', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('initial state', () => {
        it('should not show command palette initially', () => {
            render(<CommandPalette lang="en" />);

            expect(screen.queryByTestId('command-palette-inner')).not.toBeInTheDocument();
        });

        it('should show ready marker when closed', () => {
            render(<CommandPalette lang="en" />);

            expect(screen.getByTestId('command-palette-ready')).toBeInTheDocument();
        });
    });

    describe('keyboard shortcuts', () => {
        it('should open on Ctrl+K', async () => {
            const user = userEvent.setup();
            render(<CommandPalette lang="en" />);

            await user.keyboard('{Control>}k{/Control}');

            await waitFor(() => {
                expect(screen.getByTestId('command-palette-inner')).toBeInTheDocument();
            });
        });

        it('should open on Cmd+K (Mac)', async () => {
            const user = userEvent.setup();
            render(<CommandPalette lang="en" />);

            await user.keyboard('{Meta>}k{/Meta}');

            await waitFor(() => {
                expect(screen.getByTestId('command-palette-inner')).toBeInTheDocument();
            });
        });

        it('should close on Ctrl+K when open', async () => {
            const user = userEvent.setup();
            render(<CommandPalette lang="en" />);

            // Open
            await user.keyboard('{Control>}k{/Control}');
            await waitFor(() => {
                expect(screen.getByTestId('command-palette-inner')).toBeInTheDocument();
            });

            // Close
            await user.keyboard('{Control>}k{/Control}');
            await waitFor(() => {
                expect(screen.queryByTestId('command-palette-inner')).not.toBeInTheDocument();
            });
        });
    });

    describe('custom event handling', () => {
        it('should open on openCommandPalette custom event', async () => {
            render(<CommandPalette lang="en" />);

            act(() => {
                window.dispatchEvent(new CustomEvent('openCommandPalette'));
            });

            await waitFor(() => {
                expect(screen.getByTestId('command-palette-inner')).toBeInTheDocument();
            });
        });
    });

    describe('controlled mode', () => {
        it('should respect external isOpen prop', () => {
            const { rerender } = render(<CommandPalette lang="en" isOpen={false} />);

            expect(screen.queryByTestId('command-palette-inner')).not.toBeInTheDocument();

            rerender(<CommandPalette lang="en" isOpen={true} />);

            expect(screen.getByTestId('command-palette-inner')).toBeInTheDocument();
        });

        it('should call onOpenChange when closing', async () => {
            const onOpenChange = vi.fn();
            const user = userEvent.setup();

            render(<CommandPalette lang="en" isOpen={true} onOpenChange={onOpenChange} />);

            const closeButton = screen.getByTestId('close-button');
            await user.click(closeButton);

            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });

    describe('help dialog integration', () => {
        it('should show help dialog when help is requested', async () => {
            const user = userEvent.setup();
            render(<CommandPalette lang="en" />);

            // Open command palette
            await user.keyboard('{Control>}k{/Control}');
            await waitFor(() => {
                expect(screen.getByTestId('command-palette-inner')).toBeInTheDocument();
            });

            // Click help button
            const helpButton = screen.getByTestId('help-button');
            await user.click(helpButton);

            // Help dialog should be visible, command palette should be closed
            await waitFor(() => {
                expect(screen.getByTestId('help-dialog')).toBeInTheDocument();
                expect(screen.queryByTestId('command-palette-inner')).not.toBeInTheDocument();
            });
        });

        it('should go back to command palette from help', async () => {
            const user = userEvent.setup();
            render(<CommandPalette lang="en" />);

            // Open command palette
            await user.keyboard('{Control>}k{/Control}');
            await waitFor(() => {
                expect(screen.getByTestId('command-palette-inner')).toBeInTheDocument();
            });

            // Click help
            await user.click(screen.getByTestId('help-button'));
            await waitFor(() => {
                expect(screen.getByTestId('help-dialog')).toBeInTheDocument();
            });

            // Click back to command palette
            await user.click(screen.getByTestId('back-to-command'));

            await waitFor(() => {
                expect(screen.queryByTestId('help-dialog')).not.toBeInTheDocument();
                expect(screen.getByTestId('command-palette-inner')).toBeInTheDocument();
            });
        });

        it('should close help without opening command palette', async () => {
            const user = userEvent.setup();
            render(<CommandPalette lang="en" />);

            // Open command palette and then help
            await user.keyboard('{Control>}k{/Control}');
            await waitFor(() => {
                expect(screen.getByTestId('command-palette-inner')).toBeInTheDocument();
            });

            await user.click(screen.getByTestId('help-button'));
            await waitFor(() => {
                expect(screen.getByTestId('help-dialog')).toBeInTheDocument();
            });

            // Close help directly
            await user.click(screen.getByTestId('close-help'));

            await waitFor(() => {
                expect(screen.queryByTestId('help-dialog')).not.toBeInTheDocument();
                expect(screen.queryByTestId('command-palette-inner')).not.toBeInTheDocument();
            });
        });
    });

    describe('cleanup', () => {
        it('should remove event listeners on unmount', () => {
            const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
            const removeDocumentListenerSpy = vi.spyOn(document, 'removeEventListener');

            const { unmount } = render(<CommandPalette lang="en" />);
            unmount();

            // Should have removed openCommandPalette listener
            expect(removeEventListenerSpy).toHaveBeenCalledWith('openCommandPalette', expect.any(Function));

            // Should have removed keydown listener
            expect(removeDocumentListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

            removeEventListenerSpy.mockRestore();
            removeDocumentListenerSpy.mockRestore();
        });
    });
});
