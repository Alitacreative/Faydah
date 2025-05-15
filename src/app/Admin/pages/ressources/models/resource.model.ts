export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'Zikrs' | 'Livres' | 'Conférences' | 'Tafsirs';
  dateAdded: string;
}