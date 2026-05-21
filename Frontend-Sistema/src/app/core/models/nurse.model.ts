export interface Nurse {
  id: string;
  name: string;
  title: string;
  isTopRated: boolean;
  serviceType: 'Especializado' | 'Técnico' | 'Acompañamiento' | 'Asistencial';
  rating: number;
  reviews: number;
  punctuality: number;
  treatment: number;
  technical: number;
  district: string;
  experience: number;
  completedServices: number;
  pricePerHour: number;
}