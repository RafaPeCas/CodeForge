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

export interface Page {
    id: string;
    title: string;
    parentId: string | null;
    ancestors: string[];
    notebookId: string;
}

export interface Notebook {
    id: string;
    name: string;
    description: string;
    spaceId: string;
    pages: Page[];
}

export interface Space {
    name: string;
    logo: string;
    plan: string;
    id: string;
}