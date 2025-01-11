import { FeaturedPhotos } from '@/components/FeaturedPhotos';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Anton Bossenbroek Photography</h1>
      <FeaturedPhotos />
    </main>
  );
}
