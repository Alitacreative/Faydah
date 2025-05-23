export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
    dahiraId?: string; // ID du Dahira auquel l'utilisateur appartient (si applicable)
    createdAt: Date;
    updatedAt: Date;
}