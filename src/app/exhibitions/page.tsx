import { Metadata } from 'next';
import ExhibitCard from '@/components/exhibits/ExhibitCard';
import { exhibits } from '@/data/exhibits';

// Use edge runtime for Cloudflare Pages compatibility
export const runtime = 'edge';
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Exhibitions | Anton Bossenbroek Photography',
  description: 'Photography exhibitions and shows by Anton Bossenbroek.',
};

export default async function ExhibitionsPage() {
  if (!exhibits || exhibits.length === 0) {
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
            {exhibits.map(exhibit => (
              <ExhibitCard key={exhibit.id} exhibit={exhibit} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
