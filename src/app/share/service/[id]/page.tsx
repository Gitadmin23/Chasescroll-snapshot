import { Metadata } from 'next';
import { RESOURCE_URL } from '@/constants';
import Service from '@/views/share/Service';
import { capitalizeFLetter } from '@/utils/capitalizeLetter';

interface Props {
    params: Promise<{ id: string }>;
}

// Generate SEO + social OpenGraph metadata server-side
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { id } = await params;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const res = await fetch(`${baseUrl}/business-service/search?id=${id}`, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
        if (!res.ok) return { title: 'Service Details | Chasescroll' };
        const data = await res.json();
        const service = data?.content?.[0];
        if (!service) return { title: 'Service Details | Chasescroll' };

        const title = service.name
            ? `${capitalizeFLetter(service.name)} | Chasescroll`
            : 'Service Details | Chasescroll';
        const description = service.description || 'Check out this service on Chasescroll';
        
        let imageUrl: string | undefined;
        if (service.images && Array.isArray(service.images) && service.images.length > 0) {
            const firstImg = service.images[0];
            imageUrl = firstImg.startsWith('http') ? firstImg : `${RESOURCE_URL}${firstImg}`;
        }

        const canonicalUrl = `https://share.chasescroll.com/share/service/${id}`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                url: canonicalUrl,
                type: 'website',
                siteName: 'Chasescroll',
                images: imageUrl
                    ? [
                          {
                              url: imageUrl,
                              width: 1200,
                              height: 630,
                              alt: service.name || 'Service Image',
                          },
                      ]
                    : [],
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: imageUrl ? [imageUrl] : [],
            },
            alternates: {
                canonical: canonicalUrl,
            },
        };
    } catch {
        return { title: 'Service Details | Chasescroll' };
    }
}

// Render service share page dynamically
export default async function ServiceSharePage({ params }: Props) {
    const { id } = await params;
    return <Service id={id} />;
}
