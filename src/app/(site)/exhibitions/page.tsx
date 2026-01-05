import { Metadata } from 'next';
import { getPayload } from 'payload';
import config from '@payload-config';
import ExhibitCard from '@/components/exhibits/ExhibitCard';
import { exhibits as legacyExhibits } from '@/data/exhibits';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Exhibitions | Anton Bossenbroek Photography',
  description: 'Photography exhibitions and shows by Anton Bossenbroek.',
};

interface PayloadExhibit {
  id: string;
  title: string;
  slug: string;
  description?: object;
  location?: {
    venue: string;
    city: string;
    country?: string;
    address?: string;
  };
  startDate: string;
  endDate?: string;
  featuredImage?: { url?: string } | null;
  externalLink?: string;
  isUpcoming?: boolean;
}

export default async function ExhibitionsPage() {
  let payloadExhibits: PayloadExhibit[] = [];

  // Try to fetch from Payload CMS
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'exhibits',
      sort: '-startDate',
      limit: 50,
    });
    payloadExhibits = result.docs as unknown as PayloadExhibit[];
  } catch {
    // Payload not available
  }

  // Transform Payload exhibits to match the expected format
  const transformedPayloadExhibits = payloadExhibits.map(exhibit => ({
    id: exhibit.id,
    title: exhibit.title,
    slug: exhibit.slug,
    venue: exhibit.location?.venue || '',
    city: exhibit.location?.city || '',
    country: exhibit.location?.country || '',
    startDate: exhibit.startDate,
    endDate: exhibit.endDate || null,
    description: '',
    link: exhibit.externalLink || null,
    image: exhibit.featuredImage?.url || null,
    isUpcoming: exhibit.isUpcoming || false,
    source: 'payload' as const,
  }));

  // Combine with legacy exhibits
  const allExhibits = [
    ...transformedPayloadExhibits,
    ...legacyExhibits.map(e => ({ ...e, source: 'legacy' as const })),
  ];

  // Sort by date (upcoming first, then by start date descending)
  allExhibits.sort((a, b) => {
    if (a.isUpcoming && !b.isUpcoming) return -1;
    if (!a.isUpcoming && b.isUpcoming) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  if (allExhibits.length === 0) {
    return (
      <main className="flex min-h-screen flex-col lg:w-[90%] lg:p-6 p-2">
        <div className="w-full max-w-[50%] lg:mx-0 mx-auto py-8">
          <p>No exhibitions found. Check back soon for new content!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col lg:w-[90%] lg:p-6 p-2">
      <div className="w-full py-8">
        <div className="w-full max-w-4xl">
          <h1 className="uppercase text-2xl font-light mb-8">Exhibitions</h1>
          <div className="my-8 h-px bg-white w-full"/>
          <div className="space-y-16">
            {allExhibits.map(exhibit => (
              <ExhibitCard key={exhibit.id} exhibit={exhibit} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
