-- Seed data for ab-photos D1 database
-- Apply with: wrangler d1 execute ab-photos --remote --file=src/db/seed.sql

-- Projects
INSERT OR REPLACE INTO projects (id, title, subtitle, description, isPublished) VALUES ('pyrenees', 'Pyrénées', NULL, NULL, 1);
INSERT OR REPLACE INTO projects (id, title, subtitle, description, isPublished) VALUES ('7-rad', '7 Rad', NULL, NULL, 1);
INSERT OR REPLACE INTO projects (id, title, subtitle, description, isPublished) VALUES ('sunsetting-64-megatons', 'Sunsetting 64 Megatons', NULL, NULL, 0);

-- Photos
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('ced7920e-0ae8-444b-a754-c6144deca6ab', 'https://assets.bossenbroek.photo/pyrenees/fullscreen/2021-07-29%2B15.13.27Anton%2BBossoenbroek-30.jpg', '', '', 2, '', 'pyrenees');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('9aba0366-a078-4a19-b33c-a83f68de62bd', 'https://assets.bossenbroek.photo/pyrenees/fullscreen/2021-07-29%2B15.13.29Anton%2BBossoenbroek-34.jpg', '', '', 3, '', 'pyrenees');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('6b16ee5d-ff14-4bfc-b4d4-3d5a13cda00e', 'https://assets.bossenbroek.photo/pyrenees/fullscreen/2021-07-30%2B13.47.16Anton%2BBossoenbroek-114.jpg', '', '', 1, 'Pyrénées', 'pyrenees');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('f807dbce-4448-4b52-b6dd-08c108ef13e2', 'https://assets.bossenbroek.photo/pyrenees/fullscreen/2021-07-30%2B13.44.20Anton%2BBossoenbroek-65.jpg', '', '', 7, '', 'pyrenees');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('ee70cdb2-84f8-466d-bfeb-889fd02d7c94', 'https://assets.bossenbroek.photo/pyrenees/fullscreen/2021-07-30%2B13.42.09Anton%2BBossoenbroek-29.jpg', '', '', 4, '', 'pyrenees');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('ca07b828-be67-49af-9585-1793edb97b3d', 'https://assets.bossenbroek.photo/pyrenees/fullscreen/2021-07-30%2B13.46.39Anton%2BBossoenbroek-104.jpg', '', '', 10, '', 'pyrenees');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('13f95796-0e65-464c-af8a-b515371f0231', 'https://assets.bossenbroek.photo/pyrenees/fullscreen/2021-07-30%2B13.43.47Anton%2BBossoenbroek-56.jpg', '', '', 6, '', 'pyrenees');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('47d6149f-c7f8-4a93-8cad-4f9b41eea9bb', 'https://assets.bossenbroek.photo/pyrenees/fullscreen/2021-07-30%2B13.47.44Anton%2BBossoenbroek-122.jpg', '', '', 11, '', 'pyrenees');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('fd820da8-5403-458b-8635-2139dd739112', 'https://assets.bossenbroek.photo/pyrenees/fullscreen/2021-07-30%2B13.42.24Anton%2BBossoenbroek-33.jpg', '', '', 5, '', 'pyrenees');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('dbf54868-23d3-474d-b119-1390bc6c7ef7', 'https://assets.bossenbroek.photo/pyrenees/fullscreen/2021-07-30%2B13.45.34Anton%2BBossoenbroek-86.jpg', '', '', 9, '', 'pyrenees');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('481c4c04-1982-43b8-b764-24dca00e78e0', 'https://assets.bossenbroek.photo/pyrenees/fullscreen/2021-07-30%2B13.44.37Anton%2BBossoenbroek-70.jpg', '', '', 8, '', 'pyrenees');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('3fa93f32-24ed-4d2c-a3bf-3996ae86a9eb', 'https://assets.bossenbroek.photo/7rad/fullscreen/2024-03-05%2B05.35.58CF005408.jpg', '', '', 1, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('0391b3d9-c23d-423f-96ae-ac141afc4c43', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-11-22%2B13.37.44CF003287.jpg', '', '', 8, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('8fda914d-3225-446f-8687-07af4b0f1e25', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-11-21%2B08.27.15CF003253.jpg', '', '', 7, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('36354a82-f3a5-4297-81df-c4e9a9042a67', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-11-17%2B18.13.17CF003143.jpg', '', '', 5, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('e4023cdb-279a-479b-8f49-6007ddad5aa2', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-11-04%2B21.18.51CF002270.jpg', '', '', 3, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('9f80324b-281e-4a8b-8a1f-75216447ff0f', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-12-05%2B06.47.03CF004005.jpg', '', '', 11, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('78822acf-915e-4daa-ab18-cfb528cbe244', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-12-16%2B10.58.41CF004631.jpg', '', '', 19, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('85652c05-86e0-4494-b81f-395ec48db7f9', 'https://assets.bossenbroek.photo/7rad/fullscreen/2024-03-06%2B05.58.32CF005433%2B1.jpg', '', '', 22, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('f1983a4e-65d2-44ec-9a5f-946a3f474db5', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-12-09%2B15.10.35CF004313.jpg', '', '', 15, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('fefd3f6e-cb6a-46bd-bac4-e601d45b5dc0', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-12-01%2B05.24.17CF003585.jpg', '', '', 9, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('f1c9a9f0-7f80-4cfa-9ace-8b59da9116b8', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-12-15%2B20.13.02CF004540.jpg', '', '', 17, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('2e2b3c1f-7e52-498b-a803-f96e58a2c78f', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-11-18%2B09.31.43CF003209.jpg', '', '', 6, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('f48d491a-3356-411e-9bc4-1a684877e755', 'https://assets.bossenbroek.photo/7rad/fullscreen/2024-03-08%2B21.37.28CF005679.jpg', '', '', 23, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('2b500013-a9aa-4ed2-9ef5-87429a45f539', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-12-17%2B05.51.49CF004768.jpg', '', '', 20, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('aaa3dce7-6d45-4923-aeee-ee579fb8add0', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-12-15%2B20.57.15CF004553.jpg', '', '', 18, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('3efc44ca-1fdd-4f41-957e-dcf66e070dfe', 'https://assets.bossenbroek.photo/7rad/fullscreen/2024-03-05%2B06.35.01CF005417.jpg', '', '', 21, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('87eeba57-e334-4159-9858-53ba8f234719', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-06-18%2B18.14.152023-06-18%2B18.14.15DSCF5730.jpg', '', '', 2, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('f7ae544b-1257-4c57-98a9-30e0c2a1e896', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-12-03%2B13.26.37CF003931.jpg', '', '', 10, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('faf8ab26-1053-43b1-80ae-65605c56689f', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-12-09%2B05.27.10CF004119.jpg', '', '', 14, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('a91edc9b-9c32-42b6-a1d0-0c20e256de3d', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-12-08%2B14.37.02CF004092.jpg', '', '', 13, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('dc15bb12-1d52-441d-8da8-79123d1973a7', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-12-10%2B12.49.09CF004329.jpg', '', '', 16, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('5c7a2666-1224-4a13-9e65-17fc13f1cc3b', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-12-08%2B06.01.39CF004077.jpg', '', '', 12, '7 Rad', '7-rad');
INSERT OR REPLACE INTO photos (id, desktop_blob, mobile_blob, gallery_blob, sequence, caption, project_id) VALUES ('353fcc3d-10ad-49b7-8ce2-f2650df7aca3', 'https://assets.bossenbroek.photo/7rad/fullscreen/2023-11-16%2B05.52.54CF002940.jpg', '', '', 4, '7 Rad', '7-rad');

-- Exhibits
INSERT OR REPLACE INTO exhibits (id, title, date, location, description, featuredImage, startDate, endDate, isActive, link, isUpcoming)
VALUES
  ('exhibit-1', 'AFMP 2024-25 Exhibition', 'July 5 – August 17, 2025', '103-555 Prometheus Pl, Bowen Island, BC, Canada', 'Inaugural group exhibition', '/images/exhibits/Fotofilmic-FullResolution.jpg', '2025-07-05', '2025-08-17', 0, 'https://fotofilmic.com/afmp-exhibition-2024-2025/', 0),
  ('exhibit-2', 'CRITICAL EYE - PORTRAITS FROM THE STREET AWARDS 2025', 'Sept. 6 – Sept 21, 2025', 'Hin Bus Depot, Kuala Lumpur, Malaysia', 'Finalists of the Critical Eye Photography Awards 2025 with the portrait ''Lady in onesie Pyjama, Embalenhle''. The exhibition showcase the finalists'' portraits from the street.', '/images/exhibits/exhibit_2.jpeg', '2025-09-06', '2025-09-21', 0, 'https://www.klphotoawards.com/home-2023', 0),
  ('exhibit-3', 'AFMP PARIS', 'Nov. 11 – Nov. 15, 2025', '43 Rue Charlot, Paris, France', 'FOTOFILMIC is proud to present the final 11 photographic projects developed during its 2024-25 Annual FotoFilmic Mentoring Program (AFMP) that was led by core mentors Elisa Medde (IT/NL), Stacy Kranitz (USA), and Christian Patterson (USA).', '/images/exhibits/sasol.jpg', '2025-11-11', '2025-11-15', 0, 'https://fotofilmic.com/afmp-exhibition-2024-2025/', 1),
  ('exhibit-4', 'Northwest Current', 'Jan. 8 – Feb. 20, 2026', '300 South Washington Street, Unit Z, Seattle, WA 98104, USA', 'A survey of recent work from artists based in or connected to the Pacific Northwest. Group exhibition at Solas Gallery.', '/images/exhibits/northwest-current.jpg', '2026-01-08', '2026-02-20', 0, 'https://www.solas.gallery/exhibitions/northwest-current', 0);

-- News
INSERT OR REPLACE INTO news (id, title, date, author, excerpt, featuredImage, tags, published, layout, content)
VALUES (
  'sunsetting-64-megatons-artist-feature-der-greif',
  'Sunsetting 64 Megatons - Artist Feature on Der Greif',
  '2026-02-20',
  'Anton Bossenbroek',
  'Artist Feature on Der Greif, the award-winning organisation for contemporary photography. Featuring the Sunsetting 64 Megatons project, with a foreword by Artistic Director Caroline von Courten from the Face-to-Face educational feedback program.',
  NULL,
  '[]',
  1,
  'single',
  '<article class="text-white">

  <div class="space-y-6 text-base font-light italic leading-normal mb-12">
    <p>"On many levels, the sessions with Anton have been dense, focused, and highly inspiring. He approaches ''Sunsetting 64 Megatons'' from multiple angles, drawing on a profound understanding of industry gained from his bold career shift from engineering to documentary photography. This background allows him to move effortlessly between (visual) languages, differing logics, and fields of inquiry, fueled by a restless drive to investigate the urgent issue of the world''s largest single-site carbon footprint &ndash; the Secunda plant in South Africa.</p>

    <p>His work goes beyond surface-level observation; he uses the Secunda plant as a lens to examine a complex web of economic, (post)colonial, and ecological consequences, hence demanding a multi-layered thinking and the ability to translate this artistically. Following his ambition to create a profound, well-researched artistic monument that challenges existing policies for the sake of a better life on this planet, this Artist Feature is just the beginning&hellip;</p>

    <p>During our conversations, we focused on conceptual complexities and positioning the project within the artistic field &ndash; navigating references, platforms, grants, and collaborations. While these elements are standard in photography curricula, Anton as career-shifter relies solely on his own research. With my insights of the photographic ecosystem (network &amp; methodologies), this is where I can provide the most meaningful contribution to his journey."</p>

    <p class="not-italic text-gray-400">&mdash; Caroline von Courten, Artistic Director, Der Greif</p>
  </div>

  <div class="my-8 h-px bg-gray-700 w-full"></div>

  <div class="space-y-6 text-base leading-normal">
    <p>The Secunda plant sits on the Mpumalanga Highveld in South Africa. From a distance, its smokestacks do not stand out from the other coal infrastructure that litters the region. The plant is unique, however: it was born of the apartheid regime''s isolation. When the global community imposed oil embargoes in the nineteen-seventies, energy independence became a state priority. The drive for autarky was framed as Afrikaner nationalism, a survivalist ethos deeply rooted in Dutch Protestant colonial history.</p>

    <p>South Africa has a geological problem: it has no oil, but significant coal deposits. The reality linked the apartheid regime directly to the industrial ambitions of nineteen-twenties Germany. Facing a similar resource deficit, Franz Fischer and Hans Tropsch, German chemists working at the Kaiser Wilhelm Institute for Coal Research in the 1920s, developed a process, in 1924, to convert coal into synthetic fuel. When Hitler rose to power, in 1934, he recognized the process as the lifeblood of the German war machine and invested heavily in its optimization.</p>

    <p>The technology was a spoil of war. While the Nazis refined the process for tanks, post-war America exported the industrial know-how. The U.S. engineering firm Fluor won the contract to build Sasol II and III, constructing the world''s largest coal-to-liquid complex. Today, it remains the single largest point-source of carbon dioxide on Earth emitting up to sixty-four megatons annually.</p>

    <p>In the nineteen-nineties, the transition to democracy revealed a paradox. The African National Congress, which had plotted to sabotage Sasol II in the early eighties, found itself governing a state addicted to it. Today, the dependency is absolute. Sasol generates roughly five per cent of the G.D.P., anchors government pension funds, and injects hundreds of base chemicals from fertilizer to fuel into the national supply chain. It is a petrocultural knot that resists simple excision.</p>

    <p>Does the plant work for us, or do we work for the plant? I served the plant. In 2018, I worked as a contractor, deploying A.I. to predict and reduce mechanical failures. The proximity revealed the scale of the entanglement. The facility is not a discrete object but a viscous force, leaking its history into the soil and its chemistry into the air. It creates a petrochemical debt, a burden that is not merely abstract finance but a physical accumulation of decay that the land and its people are forced to carry.</p>

    <p>To offset a single year of Secunda''s emissions, one would need to plant a forest the size of Finland. The carbon dioxide accumulates, trapping heat in the atmosphere. The plant is reaching its end of life, yet it remains profitable only when Brent crude exceeds fifty-five dollars. As prices hover near the threshold, the capital required to heal the landscape evaporates. The question is historical: Will South Africa mimic Germany, the inventor of the process, where billions have been spent on an exit that still requires pumps to run in perpetuity to keep the land from drowning? Or can the nation find the collective resolve to prioritize the biosphere it inhabits?</p>
  </div>

  <div class="my-8 h-px bg-gray-700 w-full"></div>

  <div class="mt-8 text-base leading-normal">
    <p class="text-gray-400">Anton Bossenbroek took part in Der Greif''s <a href="https://dergreif.org/face-to-face" class="underline hover:text-white" target="_blank" rel="noopener noreferrer">Face-to-Face</a> educational feedback program with Artistic Director Caroline von Courten.</p>
    <p class="mt-4"><a href="https://dergreif.org/artist-feature/anton-bossenbroek" class="underline hover:text-white" target="_blank" rel="noopener noreferrer">View the full Artist Feature on Der Greif &rarr;</a></p>
  </div>

</article>'
);
INSERT OR REPLACE INTO news (id, title, date, author, excerpt, featuredImage, tags, published, layout, content)
VALUES (
  'notes-from-the-field-johannesburg-and-east-mpumalanga-south-africa',
  'Notes from the field - Johannesburg and East Mpumalanga, South Africa',
  '2025-09-03',
  'Guest Post - Manon Jacquin',
  'A glimpse into the first few days of a two months scouting and photograping trip in South Africa for Anton''s last project - Sunsetting 64 Megatons',
  NULL,
  '[]',
  1,
  'two-column',
  '<article class="text-white">
  <!-- <h1 class="text-4xl font-normal uppercase mb-2">Notes from the field - Johannesburg and East Mpumalanga, South Africa</h1> -->
  <!-- <div class="font-light italic text-gray-400 mb-8">September 3, 2025</div> -->
  
  <!-- <div class="my-8 h-px bg-gray-300 w-full"></div> -->
  
  <!-- Introduction - full width -->
  <div class="space-y-6 text-base font-light italic leading-normal mb-12">
    <p>"Sunsetting 64 Megatons" examines Secunda, South Africa through photography. The project connects Anton''s return to the SASOL Coal-to-Liquid facility where he worked in 2018 with broader questions about industrial transition.

      Built during apartheid in 1975, Secunda''s existence centers on SASOL—now the world''s largest single-point greenhouse gas emitter yet simultaneously South Africa''s largest taxpayer. This creates an intricate dependency where environmental measures rely on the very industry causing harm.
      
      By juxtaposing industrial landscapes with intimate portraits and environmental details, the project visualizes the relationship between industrial scale and community vulnerability. Young locals from diverse backgrounds—Zulu, Xhosa, Coloured, and Afrikaans communities—contribute to this multilayered narrative. The work integrates archival materials and historical maps with contemporary imagery, weaving together past and present.</p>
  </div>
  
  <!-- Two column comparison -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
    <div class="space-y-6 text-base leading-normal">
      <h3 class="text-xl font-normal mb-3">Johannesburg, Gauteng Province</h3>
      <p>We stayed for three days in Johannesburg. We mostly recharged. Ate incredible food, slept early, worked out a bit, and had an incredible evening where we ended up having a bottle each of delicious red wine. This never happens to us, but that night, the atmosphere was too good!! Being out of Italy was so energising. We realised how much diversity - in food, people, cities - innovation and mixed culture are so important for us. It’s been a while since we had such a change in scenery. It broadened our perspectives already.

      </p>
      <p>One morning, we found ourselves at Uncle Merv’s coffee, in Maboneng. Maboneng used to be a hype area in Jo’burg, where artists, shops, bookstore and galleries thrived. At least, this was the case in 2018. Not anymore. The taxi dropped us off on Kruger and Fox streets, in the heart of Maboneng. We were the only whites. We clearly were uncomfortable. And for good reasons: people were staring at us, wondering what on earth were we doing here. It was only 10 am in the morning, perhaps too early for tourists? Nevertheless, we headed to the coffee place. It was open, but not one in there. When I say coffee place, please don’t expect a Starbuck type of thing. Obviously. Rather, think small open wooden bar with two high wooden chairs. Lots of plants, nice vibe overall.

      </p>
      <p>Someone came to us, saying the owner left to grab something, he’ll be back shortly. We had a look around, an art gallery was right next to it. Eventually we walked a bit further down the street, to explore and witness what changed since 2018. We recognised a small gallery where used to be a bookstore. I remember buying a book on South Africa’s resilience and peace building. That bookstore is none existent anymore.

      </p>
      <p>When heading out, we heard someone calling us. Uncle Merv’s coffee owner! At first we were a bit mistrustful. Turned out we exchanged our whatsapp number and had the most elevating conversation we didn’t have for a while with him. For close to one hour, we discussed photography (he was perhaps as geeky as Anton about cameras, oh boy!), the importance of being in the moment, how covid negatively impacted Maboneng, looting in Jo’burg, the Mpumalanga province, and African art collections.

      </p>
      <p>We hugged and said goodbye, until next time, perhaps in September when we come back.

      </p>
    </div>
    
    <div class="space-y-6 text-base leading-normal">
      <h3 class="text-xl font-normal mb-3">eManzana, East Mpumalanga Province
      </h3>
      <p>Our next stop was the Paradise Resort, eManzana. The contrast between the name and the place was rather astounding. More on that later.

      </p>
      <p>eManzana is a small town three hours east of Johannesburg. Driving through towns like Bethal, Hendrina, and Carolina, always reminding us of the Dutch and English colonial past. Driving through Carolina was unsettling. All eyes on us, we didn’t see a single white. It’s always a challenge to know when we are safe or not. We rather assume we are not the most welcomed.

      </p>
      <p>Arriving at the Paradise Resort was such a relief. Gugu (pronounced “Kuku“) welcomed us so warmly, along with her dog Flesh. Oh boy. It was love at first sight with that one!! He spent the whole week with us. The Paradise Resort has about ten little self catering houses, a swimming pool (empty when we arrived, it’s winter here), at the foot of the Prayer Mountain. The sunset that evening was incredible, and when Gugu said we were more than safe here and that we could go for walks around the house, I felt so good.

      </p>
      <p>There was always an issue at our house. First, no shower. Then, we were locked inside, impossible to open the door. Then, brown water when taking baths. Oh, and there was no electricity in the bathroom. And of course, spiders and lezard were very common to encounter in the house. I know this may sound like a bad experience to have? It was nothing but. We didn’t sleep that well in a while, woke up between 4:30 and 5:30 am in the morning to go shoot photos and explore the surroundings, and met incredible people. After all, this house felt more as an upgrade compared to the two months trip living in a van in the cold and humid Netherlands last November!

      </p>
      <p>How on earth did we find ourselves at the Paradise Resort, by the way?

      </p>
      <p>While still in Italy, Anton contacted a Rock Art specialist after reading his PHD thesis, asking if we could meet because we were interested to better understand South African First Nations cultures and traditions. To Anton’s both surprise and joy, Mduduzi replied, and suggested we meet at the Paradise Resort since he would be there with five students to make research at a rock art site nearby. Oh my god! A dream of mine coming true!! To follow experts on the field and learn more about first nations!

      </p>
    </div>
  </div>
  
  <!-- Full width conclusion -->
  <div class="mt-12 space-y-6 text-base leading-normal">
    <h2 class="text-2xl font-normal mt-8 mb-4">
    </h2>

    <strong class="font-semibold">That site was specifically known for rock art made by the San People, depicting animals, people and dance scenes. I learned we all have at least 1% DNA coming from the San People. They are the origin of humanity. We were at one of the first site on earth where human descendants drew their first paintings. It was unbelievable and felt very special, as you can imagine.

    </strong>
    <p>These paintings are believed to be the results of healers trance dances. The paintings were the results of visions, things they saw in the spirit world. Mduduzi is conducting research there because it is still not possible to date the paintings. To do so, he came with students in archeology to do excavations around the sites. There were four sites, La Rochelle one, two, three and four.

    </p>
    <p>The site was stunning. A 45 minute drive from the Paradise, half of it being on a dirt road. Somehow I love driving off roads. The call of the wild, I suppose! The first morning was cold. And we had proper down jackets. The students only had a thin cotton jacket. I felt for them!

    </p>
    <p>The rest of the week turned out to be so rich in connection, discoveries, and photography. Being disconnected from the external world (no internet, hence no social media, no supermarket, no drinking water) unsurprisingly reconnected us to our own nature, to Nature, and Humanity as a whole.

    </p>
    
  </div>
</article>'
);
