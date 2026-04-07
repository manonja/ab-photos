-- Seed data for exhibits table
-- Apply with: wrangler d1 execute ab-photos --remote --file=src/db/seed.sql

INSERT OR REPLACE INTO exhibits (id, title, date, location, description, featuredImage, startDate, endDate, isActive, link, isUpcoming)
VALUES
  ('exhibit-1', 'AFMP 2024-25 Exhibition', 'July 5 – August 17, 2025', '103-555 Prometheus Pl, Bowen Island, BC, Canada', 'Inaugural group exhibition', '/images/exhibits/Fotofilmic-FullResolution.jpg', '2025-07-05', '2025-08-17', 0, 'https://fotofilmic.com/afmp-exhibition-2024-2025/', 0),
  ('exhibit-2', 'CRITICAL EYE - PORTRAITS FROM THE STREET AWARDS 2025', 'Sept. 6 – Sept 21, 2025', 'Hin Bus Depotthis color , Kuala Lumpur, Malaysia', 'Finalists of the Critical Eye Photography Awards 2025 with the portrait ''Lady in onesie Pyjama, Embalenhle''. The exhibition showcase the finalists'' portraits from the street.', '/images/exhibits/exhibit_2.jpeg', '2025-09-06', '2025-09-21', 0, 'https://www.klphotoawards.com/home-2023', 0),
  ('exhibit-3', 'AFMP PARIS', 'Nov. 11 – Nov. 15, 2025', '43 Rue Charlot, Paris', 'FOTOFILMIC is proud to present the final 11 photographic projects developed during its 2024-25 Annual FotoFilmic Mentoring Program (AFMP) that was led by core mentors Elisa Medde (IT/NL), Stacy Kranitz (USA), and Christian Patterson (USA).', '/images/exhibits/sasol.jpg', '2025-11-11', '2025-11-15', 0, 'https://fotofilmic.com/afmp-exhibition-2024-2025/', 1);
