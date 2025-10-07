import { Exhibit } from '@/types/exhibit';

export const exhibits: Exhibit[] = [
  {
    id: "exhibit-1",
    title: "AFMP 2024-25 Exhibition",
    date: "July 5 – August 17, 2025",
    location: "103-555 Prometheus Pl, Bowen Island, BC, Canada",
    description: "Inaugural group exhibition",
    featuredImage: "/images/exhibits/Fotofilmic-FullResolution.jpg",
    startDate: "2025-07-05",
    endDate: "2025-08-17",
    isActive: false,
    link: "https://fotofilmic.com/afmp-exhibition-2024-2025/",
    isUpcoming: false
  },
  {
    id: "exhibit-2",
    title: "CRITICAL EYE - PORTRAITS FROM THE STREET AWARDS 2025",
    date: "Sept. 6 – Sept 21, 2025",
    location: "KLPA2025, Hin Bus Depotthis color , Kuala Lumpur, Malaysia",
    description: "Finalists of the Critical Eye Photography Awards 2025 with the portrait 'Lady in onesie Pyjama, Embalenhle'. The exhibition showcase the finalists' portraits from the street.",
    featuredImage: "/images/exhibits/exhibit_2.jpeg",
    startDate: "2025-09-06",
    endDate: "2025-09-21",
    link: "https://www.klphotoawards.com/home-2023",
    isActive: false,
    isUpcoming: false
  },
  {
    id: "exhibit-3",
    title: "AFMP PARIS",
    date: "Nov. 11 – Nov. 15, 2025",
    location: "43 Rue Charlot, Paris",
    description: "FOTOFILMIC is proud to present the final 11 photographic projects developed during its 2024-25 Annual FotoFilmic Mentoring Program (AFMP) that was led by core mentors Elisa Medde (IT/NL), Stacy Kranitz (USA), and Christian Patterson (USA).",
    featuredImage: "/images/exhibits/sasol.jpg",
    startDate: "2025-11-11",
    endDate: "2025-11-15",
    link: "https://fotofilmic.com/afmp-exhibition-2024-2025/",
    isActive: false,
    isUpcoming: true
  }
];