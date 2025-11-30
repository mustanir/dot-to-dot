
export interface BookDetails {
    title: string;
    description: string;
    coverImage: string; // base64 string
}

export interface GeneratedImage {
    id: string;
    url: string; // base64 string
    name: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
