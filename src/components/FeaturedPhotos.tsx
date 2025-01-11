'use client';
import React from 'react';
import { PhotoCard } from './PhotoCard';
import { useRouter } from 'next/navigation';

interface Photo {
  id: string;
  desktop_blob: string;
  caption: string | null;
  sequence: number;
}

export const FeaturedPhotos = () => {
  const [photos, setPhotos] = React.useState<Photo[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos/featured');
        if (!response.ok) {
          throw new Error('Failed to load photos');
        }
        const data = await response.json();
        setPhotos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load photos');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return <div data-testid="loading-photos">Loading photos...</div>;
  }

  if (error) {
    return <div data-testid="error-message">{error}</div>;
  }

  if (photos.length === 0) {
    return <div data-testid="no-photos">No featured photos available</div>;
  }

  return (
    <section data-testid="featured-photos" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          title={photo.caption || 'Untitled'}
          imageUrl={photo.desktop_blob}
          onView={() => router.push(`/photos/${photo.id}`)}
        />
      ))}
    </section>
  );
}; 