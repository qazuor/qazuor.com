// Export all UI components

// Note: Astro components cannot be exported from TypeScript files
// Import AnimatedGradientBackground directly: import AnimatedGradientBackground from './AnimatedGradientBackground.astro';
// Import ProfileCodeBlock directly: import ProfileCodeBlock from './ProfileCodeBlock.astro';
export { Button, type ButtonProps } from './Button';
export {
    Card,
    CardContent,
    type CardContentProps,
    CardFooter,
    type CardFooterProps,
    CardHeader,
    type CardHeaderProps,
    type CardProps,
    CardTitle,
    type CardTitleProps
} from './Card';
export { TimelineIcon } from './TimelineIcon';
export { TranslatedText, useTranslations } from './TranslatedText';
export { TypeItText } from './TypeItText';
