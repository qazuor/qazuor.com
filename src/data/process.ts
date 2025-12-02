/**
 * Process steps data for the "How I Work" section
 * Used in the Services page to show the development workflow
 */

export interface ProcessStep {
    id: string;
    iconId: string;
    number: number;
}

export const processSteps: ProcessStep[] = [
    {
        id: 'discovery',
        iconId: 'magnifying-glass-circle',
        number: 1
    },
    {
        id: 'planning',
        iconId: 'clipboard-document-list',
        number: 2
    },
    {
        id: 'design',
        iconId: 'paint-brush',
        number: 3
    },
    {
        id: 'development',
        iconId: 'code-bracket',
        number: 4
    },
    {
        id: 'testing',
        iconId: 'beaker',
        number: 5
    },
    {
        id: 'launch',
        iconId: 'rocket-launch',
        number: 6
    }
];
