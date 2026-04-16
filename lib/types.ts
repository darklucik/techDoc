export interface ServiceRequest {
  id: string;
  name: string;
  device: string;
  phone: string;
  description: string;
  status: 'new' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  services: Service[];
  whyUs: WhyUsItem[];
  reviews: Review[];
  contacts: Contacts;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface WhyUsItem {
  id: string;
  title: string;
  description: string;
}

export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
}

export interface Contacts {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

export interface DayStat {
  date: string;
  requests: number;
  completed: number;
  visits: number;
}
