---
title: Advanced React Hooks Patterns and Best Practices
excerpt:
  Deep dive into React 19 hooks patterns, custom hooks design, and performance
  optimization techniques for modern React applications.
publishDate: 2025-01-18
tags: [React, Hooks, JavaScript, Performance]
readTime: 15 min read
draft: false
---

## Custom Hooks Fundamentals

Custom hooks let you extract component logic into reusable functions.

```javascript
import { useState, useEffect } from 'react';

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => controller.abort();
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
}
```

## useReducer for Complex State

```javascript
import { useReducer } from 'react';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case 'LOGOUT':
      return initialState;

    default:
      return state;
  }
}

function useAuth() {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const user = await response.json();
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
    }
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  return { ...state, login, logout };
}
```

## useCallback and useMemo Optimization

```javascript
import { useState, useCallback, useMemo } from 'react';

function ExpensiveList({ items, onItemClick }) {
  // Memoize expensive calculations
  const sortedItems = useMemo(() => {
    console.log('Sorting items...');
    return [...items].sort((a, b) => b.priority - a.priority);
  }, [items]);

  // Memoize callbacks to prevent child re-renders
  const handleItemClick = useCallback(
    (id) => {
      onItemClick?.(id);
    },
    [onItemClick]
  );

  return (
    <div>
      {sortedItems.map((item) => (
        <Item key={item.id} item={item} onClick={handleItemClick} />
      ))}
    </div>
  );
}
```

## useContext with TypeScript

```typescript
import { createContext, useContext, useState, ReactNode } from 'react';

interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>({
    mode: 'light',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
  });

  const toggleTheme = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

## useRef for DOM and Values

```javascript
import { useRef, useEffect } from 'react';

function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const previousSrcRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    // Only update if src actually changed
    if (previousSrcRef.current !== src) {
      video.src = src;
      video.load();
      previousSrcRef.current = src;
    }
  }, [src]);

  const handlePlay = () => {
    videoRef.current?.play();
  };

  const handlePause = () => {
    videoRef.current?.pause();
  };

  return (
    <div>
      <video ref={videoRef} />
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
    </div>
  );
}
```

## Custom Hook: useLocalStorage

```javascript
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Get from local storage then parse stored json or return initialValue
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
```

## Custom Hook: useDebounce

```javascript
import { useState, useEffect } from 'react';

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage in search component
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Make API call with debounced value
      fetch(`/api/search?q=${debouncedSearchTerm}`)
        .then((res) => res.json())
        .then((data) => console.log(data));
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

## Conclusion

Mastering React hooks patterns enables you to write cleaner, more maintainable,
and performant React applications!
