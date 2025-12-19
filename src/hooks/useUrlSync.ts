import { useCallback, useEffect, useState } from 'react';

/**
 * Options for useUrlSync hook
 */
interface UseUrlSyncOptions<T> {
    /**
     * URL parameter key
     */
    key: string;

    /**
     * Default value when param is not present
     */
    defaultValue: T;

    /**
     * Serialize value to URL string
     * @default String(value)
     */
    serialize?: (value: T) => string;

    /**
     * Deserialize URL string to value
     * @default (s) => s as T
     */
    deserialize?: (value: string) => T;

    /**
     * Optional validation function
     * Return true if value is valid
     */
    validate?: (value: T) => boolean;
}

/**
 * Custom hook for syncing state with URL query parameters
 *
 * Provides a useState-like interface that automatically reads from
 * and writes to URL query params.
 *
 * @example
 * ```tsx
 * // Simple string value
 * const [category, setCategory] = useUrlSync({
 *   key: 'category',
 *   defaultValue: 'all'
 * });
 *
 * // Array value with custom serialization
 * const [tags, setTags] = useUrlSync({
 *   key: 'tags',
 *   defaultValue: [],
 *   serialize: (arr) => arr.join(','),
 *   deserialize: (s) => s.split(',').filter(Boolean)
 * });
 * ```
 */
export function useUrlSync<T>({
    key,
    defaultValue,
    serialize = (v) => String(v),
    deserialize = (s) => s as unknown as T,
    validate
}: UseUrlSyncOptions<T>): [T, (value: T | ((prev: T) => T)) => void] {
    // Initialize state from URL or default
    const [value, setValue] = useState<T>(() => {
        // Check if we're in browser environment
        if (typeof window === 'undefined') return defaultValue;

        const params = new URLSearchParams(window.location.search);
        const urlValue = params.get(key);

        if (urlValue !== null) {
            const deserialized = deserialize(urlValue);
            // Validate if validator provided
            if (validate && !validate(deserialized)) {
                return defaultValue;
            }
            return deserialized;
        }

        return defaultValue;
    });

    // Sync value to URL when it changes
    useEffect(() => {
        // Skip during SSR
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const serialized = serialize(value);

        // Check if value equals default (handles both primitives and arrays)
        const isDefault =
            serialized === serialize(defaultValue) || (Array.isArray(value) && (value as unknown[]).length === 0);

        if (isDefault) {
            params.delete(key);
        } else {
            params.set(key, serialized);
        }

        const queryString = params.toString();
        const hash = window.location.hash;
        const newUrl = queryString
            ? `${window.location.pathname}?${queryString}${hash}`
            : `${window.location.pathname}${hash}`;
        window.history.replaceState({}, '', newUrl);
    }, [value, key, serialize, defaultValue]);

    // Wrapped setter that supports functional updates
    const setValueWrapped = useCallback((newValue: T | ((prev: T) => T)) => {
        setValue((prev) => {
            const resolved = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;
            return resolved;
        });
    }, []);

    return [value, setValueWrapped];
}

/**
 * Helper: Serializer for string arrays (comma-separated)
 */
export const arraySerializer = {
    serialize: (arr: string[]) => arr.join(','),
    deserialize: (s: string) => s.split(',').filter(Boolean)
};

/**
 * Helper: Create a validator from a Set of valid values
 */
export function createSetValidator<T>(validValues: Set<T>) {
    return (value: T) => validValues.has(value);
}

/**
 * Helper: Create a validator for arrays where all elements must be in valid set
 */
export function createArrayValidator(validValues: Set<string>) {
    return (arr: string[]) => arr.every((item) => validValues.has(item));
}
