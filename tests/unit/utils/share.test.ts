import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { canShare, copyToClipboard, sharePost } from '@/utils/share';

describe('Share Utilities', () => {
    describe('canShare', () => {
        const originalNavigator = global.navigator;

        afterEach(() => {
            Object.defineProperty(global, 'navigator', {
                value: originalNavigator,
                writable: true
            });
        });

        it('should return true when Web Share API is available', () => {
            Object.defineProperty(global, 'navigator', {
                value: { share: vi.fn() },
                writable: true
            });
            expect(canShare()).toBe(true);
        });

        it('should return false when navigator is undefined', () => {
            Object.defineProperty(global, 'navigator', {
                value: undefined,
                writable: true
            });
            expect(canShare()).toBe(false);
        });

        it('should return false when share is not available', () => {
            Object.defineProperty(global, 'navigator', {
                value: {},
                writable: true
            });
            expect(canShare()).toBe(false);
        });
    });

    describe('sharePost', () => {
        const originalNavigator = global.navigator;

        afterEach(() => {
            Object.defineProperty(global, 'navigator', {
                value: originalNavigator,
                writable: true
            });
        });

        it('should return false when Web Share API is not available', async () => {
            Object.defineProperty(global, 'navigator', {
                value: {},
                writable: true
            });

            const result = await sharePost({
                title: 'Test',
                text: 'Test text',
                url: 'https://example.com'
            });

            expect(result).toBe(false);
        });

        it('should return true when share is successful', async () => {
            const shareMock = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(global, 'navigator', {
                value: { share: shareMock },
                writable: true
            });

            const data = {
                title: 'Test Title',
                text: 'Test text',
                url: 'https://example.com'
            };

            const result = await sharePost(data);

            expect(result).toBe(true);
            expect(shareMock).toHaveBeenCalledWith(data);
        });

        it('should return false when user cancels (AbortError)', async () => {
            const abortError = new Error('User cancelled');
            abortError.name = 'AbortError';

            const shareMock = vi.fn().mockRejectedValue(abortError);
            Object.defineProperty(global, 'navigator', {
                value: { share: shareMock },
                writable: true
            });

            const result = await sharePost({
                title: 'Test',
                text: 'Test text',
                url: 'https://example.com'
            });

            expect(result).toBe(false);
        });

        it('should return false and log error on other failures', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const error = new Error('Network error');

            const shareMock = vi.fn().mockRejectedValue(error);
            Object.defineProperty(global, 'navigator', {
                value: { share: shareMock },
                writable: true
            });

            const result = await sharePost({
                title: 'Test',
                text: 'Test text',
                url: 'https://example.com'
            });

            expect(result).toBe(false);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Share failed:', error);

            consoleErrorSpy.mockRestore();
        });
    });

    describe('copyToClipboard', () => {
        const originalNavigator = global.navigator;
        const originalDocument = global.document;

        beforeEach(() => {
            // Reset document mock
            Object.defineProperty(global, 'document', {
                value: {
                    createElement: vi.fn(),
                    body: {
                        appendChild: vi.fn(),
                        removeChild: vi.fn()
                    },
                    execCommand: vi.fn()
                },
                writable: true
            });
        });

        afterEach(() => {
            Object.defineProperty(global, 'navigator', {
                value: originalNavigator,
                writable: true
            });
            Object.defineProperty(global, 'document', {
                value: originalDocument,
                writable: true
            });
        });

        it('should return true when clipboard API succeeds', async () => {
            const writeTextMock = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(global, 'navigator', {
                value: { clipboard: { writeText: writeTextMock } },
                writable: true
            });

            const result = await copyToClipboard('test text');

            expect(result).toBe(true);
            expect(writeTextMock).toHaveBeenCalledWith('test text');
        });

        it('should use fallback when clipboard API fails', async () => {
            const writeTextMock = vi.fn().mockRejectedValue(new Error('Not allowed'));
            Object.defineProperty(global, 'navigator', {
                value: { clipboard: { writeText: writeTextMock } },
                writable: true
            });

            const textareaMock = {
                value: '',
                style: {},
                select: vi.fn()
            };

            Object.defineProperty(global, 'document', {
                value: {
                    createElement: vi.fn().mockReturnValue(textareaMock),
                    body: {
                        appendChild: vi.fn(),
                        removeChild: vi.fn()
                    },
                    execCommand: vi.fn().mockReturnValue(true)
                },
                writable: true
            });

            const result = await copyToClipboard('fallback text');

            expect(result).toBe(true);
            expect(textareaMock.value).toBe('fallback text');
            expect(textareaMock.select).toHaveBeenCalled();
            expect(global.document.execCommand).toHaveBeenCalledWith('copy');
        });

        it('should return false when both methods fail', async () => {
            const writeTextMock = vi.fn().mockRejectedValue(new Error('Not allowed'));
            Object.defineProperty(global, 'navigator', {
                value: { clipboard: { writeText: writeTextMock } },
                writable: true
            });

            Object.defineProperty(global, 'document', {
                value: {
                    createElement: vi.fn().mockImplementation(() => {
                        throw new Error('Cannot create element');
                    }),
                    body: {
                        appendChild: vi.fn(),
                        removeChild: vi.fn()
                    }
                },
                writable: true
            });

            const result = await copyToClipboard('test');

            expect(result).toBe(false);
        });

        it('should copy empty string', async () => {
            const writeTextMock = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(global, 'navigator', {
                value: { clipboard: { writeText: writeTextMock } },
                writable: true
            });

            const result = await copyToClipboard('');

            expect(result).toBe(true);
            expect(writeTextMock).toHaveBeenCalledWith('');
        });

        it('should copy text with special characters', async () => {
            const writeTextMock = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(global, 'navigator', {
                value: { clipboard: { writeText: writeTextMock } },
                writable: true
            });

            const specialText = '🎉 <script>alert("xss")</script> & "quotes"';
            const result = await copyToClipboard(specialText);

            expect(result).toBe(true);
            expect(writeTextMock).toHaveBeenCalledWith(specialText);
        });
    });
});
