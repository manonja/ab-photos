export interface Exhibit {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  featuredImage: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  link?: string;
  isUpcoming?: boolean;
}