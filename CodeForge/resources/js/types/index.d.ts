export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};

export interface Space {
    name: string;
    logo: string;
    plan: string;
    id: string;
}

export interface RawAncestor {
    $oid: string; // The raw ancestor format
}

export interface RawPage {
    id: string;
    title: string;
    parentId: string | null;
    ancestors: RawAncestor[]; // Raw ancestors format
    subPages?: RawPage[];
}

export interface Page {
    id: string;
    title: string;
    parentId: string | null;
    notebookId: string;
    ancestors: string[]; // Normalized ancestors format
    subPages?: Page[];
}

export interface Notebook {
    id: string;
    name: string;
    description: string;
    spaceId: string;
    created_at: string;
    updated_at: string;
    pages: RawPage[]; // Raw pages before normalization
}

export interface NotebookWithHierarchy extends Omit<Notebook, "pages"> {
    pages: Page[]; // Normalized pages with hierarchy
}

// testing

export interface Notebook {
    id: string;
    name: string;
    description: string;
}

export interface Page {
    id: string;
    title: string;
    parentId: string | null;
    ancestors: string[];
    notebookId: string;
}
