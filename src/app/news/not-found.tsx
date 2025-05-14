import Link from 'next/link';

export default function BlogNotFound() {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold">404 - Not Found</h1>
      <p className="mb-8 text-lg">Sorry, the news you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/blog" className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
        Return to News
      </Link>
    </div>
  );
} 