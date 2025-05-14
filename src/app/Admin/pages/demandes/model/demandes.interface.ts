export interface Demande {
    id: number;
    demandeur: string;
    role: string;
    type: string;
    sujet: string;
    date: string;
    statut: 'En attente' | 'Approuvée' | 'Rejetée';
    motifRejet?: string;
}