import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/** Control types for the playground */
type ControlType = 'color' | 'range' | 'number' | 'select' | 'text';

/** Base control definition */
interface BaseControl {
    /** Unique identifier matching the template placeholder */
    id: string;
    /** Display label for the control */
    label: string;
    /** Control type */
    type: ControlType;
}

/** Color picker control */
interface ColorControl extends BaseControl {
    type: 'color';
    default: string;
}

/** Range slider control */
interface RangeControl extends BaseControl {
    type: 'range';
    min: number;
    max: number;
    step?: number;
    default: number;
    unit?: string;
}

/** Number input control */
interface NumberControl extends BaseControl {
    type: 'number';
    min?: number;
    max?: number;
    step?: number;
    default: number;
    unit?: string;
}

/** Select dropdown control */
interface SelectControl extends BaseControl {
    type: 'select';
    options: string[];
    default: string;
}

/** Text input control */
interface TextControl extends BaseControl {
    type: 'text';
    default: string;
    placeholder?: string;
}

type Control = ColorControl | RangeControl | NumberControl | SelectControl | TextControl;

interface CSSPlaygroundProps {
    /** Array of control definitions (optional - if not provided, no controls section is shown) */
    controls?: Control[];
    /** CSS template with {{placeholders}} */
    cssTemplate: string;
    /** HTML structure for the preview */
    previewHTML: string;
    /** Title for the demo */
    title?: string;
    /** Badge text */
    badge?: string;
    /** Minimum height for preview area */
    previewMinHeight?: string;
    /** Make preview container resizable (useful for container-size-dependent demos) */
    resizable?: boolean;
}

/**
 * Tokenize CSS for syntax highlighting
 */
function highlightCSS(code: string): string {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return (
        escaped
            // Comments
            .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="token comment">$1</span>')
            // Strings
            .replace(/("[^"]*"|'[^']*')/g, '<span class="token string">$1</span>')
            // Properties (before colon)
            .replace(/\b([a-z-]+)(\s*:)/gi, '<span class="token property">$1</span>$2')
            // Numbers with units
            .replace(
                /\b(\d+\.?\d*)(px|em|rem|%|vh|vw|deg|s|ms)?\b/g,
                '<span class="token number">$1</span><span class="token unit">$2</span>'
            )
            // Hex colors
            .replace(/(#[0-9a-fA-F]{3,8})\b/g, '<span class="token color">$1</span>')
            // CSS functions
            .replace(
                /\b(linear-gradient|radial-gradient|conic-gradient|rgb|rgba|hsl|hsla|url|calc|var|clamp|min|max|rotate|scale|translate|translateX|translateY|attr)(\()/g,
                '<span class="token function">$1</span>$2'
            )
            // Selectors (lines starting with . # or tag)
            .replace(
                /^(\s*)([.#]?[a-zA-Z_][\w-]*(?:\s*,\s*[.#]?[a-zA-Z_][\w-]*)*)(\s*\{)/gm,
                '$1<span class="token selector">$2</span>$3'
            )
            // Pseudo-classes and pseudo-elements
            .replace(/(::?[a-z-]+)/g, '<span class="token pseudo">$1</span>')
            // Braces
            .replace(/([{}])/g, '<span class="token punctuation">$1</span>')
    );
}

/**
 * Interactive CSS playground with form controls
 */
export function CSSPlayground({
    controls = [],
    cssTemplate,
    previewHTML,
    title = 'Live Demo',
    badge = 'INTERACTIVE',
    previewMinHeight = '120px',
    resizable = false
}: CSSPlaygroundProps) {
    const hasControls = controls.length > 0;

    // Initialize values from control defaults
    const initialValues = useMemo(() => {
        const values: Record<string, string | number> = {};
        for (const control of controls) {
            values[control.id] = control.default;
        }
        return values;
    }, [controls]);

    const [values, setValues] = useState(initialValues);
    const shadowHostRef = useRef<HTMLDivElement>(null);
    const shadowRootRef = useRef<ShadowRoot | null>(null);

    // Generate CSS from template and current values
    const generatedCSS = useMemo(() => {
        let css = cssTemplate;
        for (const control of controls) {
            const value = values[control.id];
            const unit =
                (control.type === 'range' || control.type === 'number') && 'unit' in control ? control.unit || '' : '';
            css = css.replace(new RegExp(`\\{\\{${control.id}\\}\\}`, 'g'), `${value}${unit}`);
        }
        return css;
    }, [cssTemplate, controls, values]);

    // Initialize Shadow DOM and update content
    useEffect(() => {
        if (!shadowHostRef.current) return;

        if (!shadowRootRef.current) {
            shadowRootRef.current = shadowHostRef.current.attachShadow({
                mode: 'open'
            });
        }

        shadowRootRef.current.innerHTML = `
			<style>
				:host {
					display: block;
					width: 100%;
				}
				.preview-container {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 100%;
					min-height: ${previewMinHeight};
				}
				${generatedCSS}
			</style>
			<div class="preview-container">
				${previewHTML}
			</div>
		`;
    }, [generatedCSS, previewHTML, previewMinHeight]);

    const handleChange = useCallback((id: string, value: string | number) => {
        setValues((prev) => ({ ...prev, [id]: value }));
    }, []);

    const handleReset = useCallback(() => {
        setValues(initialValues);
    }, [initialValues]);

    const isModified = useMemo(() => {
        return controls.some((control) => values[control.id] !== control.default);
    }, [controls, values]);

    const renderControl = (control: Control) => {
        const value = values[control.id];

        switch (control.type) {
            case 'color':
                return (
                    <div key={control.id} className="css-playground-control">
                        <label htmlFor={`control-${control.id}`}>{control.label}</label>
                        <div className="css-playground-color-wrapper">
                            <input
                                type="color"
                                id={`control-${control.id}`}
                                value={value as string}
                                onChange={(e) => handleChange(control.id, e.target.value)}
                            />
                            <span className="css-playground-color-value">{value}</span>
                        </div>
                    </div>
                );

            case 'range':
                return (
                    <div key={control.id} className="css-playground-control">
                        <label htmlFor={`control-${control.id}`}>{control.label}</label>
                        <div className="css-playground-range-wrapper">
                            <input
                                type="range"
                                id={`control-${control.id}`}
                                min={control.min}
                                max={control.max}
                                step={control.step || 1}
                                value={value as number}
                                onChange={(e) => handleChange(control.id, Number(e.target.value))}
                            />
                            <span className="css-playground-range-value">
                                {value}
                                {control.unit || ''}
                            </span>
                        </div>
                    </div>
                );

            case 'number':
                return (
                    <div key={control.id} className="css-playground-control">
                        <label htmlFor={`control-${control.id}`}>{control.label}</label>
                        <div className="css-playground-number-wrapper">
                            <input
                                type="number"
                                id={`control-${control.id}`}
                                min={control.min}
                                max={control.max}
                                step={control.step || 1}
                                value={value as number}
                                onChange={(e) => handleChange(control.id, Number(e.target.value))}
                            />
                            {control.unit && <span className="css-playground-unit">{control.unit}</span>}
                        </div>
                    </div>
                );

            case 'select':
                return (
                    <div key={control.id} className="css-playground-control">
                        <label htmlFor={`control-${control.id}`}>{control.label}</label>
                        <select
                            id={`control-${control.id}`}
                            value={value as string}
                            onChange={(e) => handleChange(control.id, e.target.value)}
                        >
                            {control.options.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case 'text':
                return (
                    <div key={control.id} className="css-playground-control">
                        <label htmlFor={`control-${control.id}`}>{control.label}</label>
                        <input
                            type="text"
                            id={`control-${control.id}`}
                            value={value as string}
                            placeholder={control.placeholder}
                            onChange={(e) => handleChange(control.id, e.target.value)}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="css-playground">
            {/* Header */}
            <div className="css-playground-header">
                <div className="css-playground-dots">
                    <span className="css-playground-dot red" />
                    <span className="css-playground-dot yellow" />
                    <span className="css-playground-dot green" />
                </div>
                <span className="css-playground-title">{title}</span>
                <div className="css-playground-actions">
                    {hasControls && isModified && (
                        <button
                            type="button"
                            className="css-playground-reset"
                            onClick={handleReset}
                            title="Reset to original"
                        >
                            Reset
                        </button>
                    )}
                    <span className="css-playground-badge">{badge}</span>
                </div>
            </div>

            {/* Preview */}
            <div
                className={`css-playground-preview ${resizable ? 'css-playground-preview--resizable' : ''}`}
                style={{ minHeight: previewMinHeight }}
            >
                <div ref={shadowHostRef} style={{ width: '100%' }} />
                {resizable && <div className="css-playground-resize-hint">↔ Drag edge to resize</div>}
            </div>

            {/* Controls - only render if controls are provided */}
            {hasControls && <div className="css-playground-controls">{controls.map(renderControl)}</div>}

            {/* Generated Code */}
            <div className="css-playground-code">
                <div className="css-playground-code-header">
                    <span>CSS Code</span>
                </div>
                <pre
                    className="css-playground-highlight"
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Controlled HTML for syntax highlighting
                    dangerouslySetInnerHTML={{
                        __html: highlightCSS(generatedCSS)
                    }}
                />
            </div>
        </div>
    );
}
