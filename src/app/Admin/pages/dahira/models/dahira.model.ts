import { User } from "./user.model";

export interface Dahira {
    id: string;
    name: string;
    memberCount: number;
    location?: string;
    responsible?: User;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export enum MemberRole {
    DISCIPLE = 'DISCIPLE',
    MOUKHADAM = 'MOUKHADAM',
    RESPONSIBLE = 'RESPONSIBLE'
  }
  
  export interface DahiraMember {
    userId: string;
    dahiraId: string;
    user: User;
    role: MemberRole;
    joinedAt: Date;
  }