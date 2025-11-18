export type SearchableItem = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    category: 'projects' | 'blog' | 'tools' | 'command' | 'services';
    url: string;
    type: 'content' | 'command';
    publishDate?: Date;
    featured?: boolean;
};

export type SearchIndex = SearchableItem[];

export type SearchResultGroup = {
    heading: string;
    items: SearchableItem[];
};
