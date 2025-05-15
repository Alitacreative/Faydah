export interface Project {
    id: string;
    title: string;
    description: string;
    status: 'en_cours' | 'en_attente' | 'termine';
    progress: number;
    dueDate: Date;
    contributors?: Contributor[];
}

export interface Contributor {
    id: string;
    name: string;
    amount: number;
    date: Date;
}