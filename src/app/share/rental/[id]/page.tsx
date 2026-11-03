import { Metadata } from 'next';
import { RESOURCE_URL } from '@/constants';
import RentalDetail from '@/views/share/Rental';
import { capitalizeFLetter } from '@/utils/capitalizeLetter';

interface Props {
    params: Promise<{ id: string }>;
}

// Generate SEO + social OpenGraph metadata server-side
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { id } = await params;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const res = await fetch(`${baseUrl}/rental/search?id=${id}`, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
        if (!res.ok) return { title: 'Rental Details | Chasescroll' };
        const data = await res.json();
        const rental = data?.content?.[0];
        if (!rental) return { title: 'Rental Details | Chasescroll' };

        const title = rental.name
            ? `${capitalizeFLetter(rental.name)} | Chasescroll`
            : 'Rental Details | Chasescroll';
        const description = rental.description || 'Check out this rental on Chasescroll';

        let imageUrl: string | undefined;
        if (rental.images && Array.isArray(rental.images) && rental.images.length > 0) {
            const firstImg = rental.images[0];
            imageUrl = firstImg.startsWith('http') ? firstImg : `${RESOURCE_URL}${firstImg}`;
        }

        const canonicalUrl = `https://share.chasescroll.com/share/rental/${id}`;

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
                              alt: rental.name || 'Rental Image',
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
        return { title: 'Rental Details | Chasescroll' };
    }
}

// Render rental share page dynamically
export default async function RentalSharePage({ params }: Props) {
    const { id } = await params;
    return <RentalDetail id={id} />;
}

