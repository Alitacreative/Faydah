export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'Zikrs' | 'Livres' | 'Conférences' | 'Tafsirs';
  dateAdded: string;
  author: string;
  fileType?: 'image' | 'pdf' | 'video' | 'audio';
  fileUrl?: string;
  
}