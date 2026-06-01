export interface Review {
  id: string;
  author: string;
  date: string;
  comment: string;
  rating: number;
  punctuality: number;
  treatment: number;
  technical: number;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Certification {
  title: string;
  institution: string;
  year: number;
}

export interface Nurse {
  id: string;
  name: string;
  photo?: string;
  title: string;
  especialidad?: string;
  nivel?: string;

  about?: string;

  isTopRated: boolean;

  serviceType: {
  name: string;
  price: number;
}[];

  rating: number;
  reviews: number;

  punctuality: number;
  treatment: number;
  technical: number;

  district: string;

  districts?: string[];

  experience: number;
  completedServices: number;

  education?: Education[];

  certifications?: Certification[];

  languages?: string[];

  reviewList?: Review[];
}