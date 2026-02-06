import { notFound } from 'next/navigation'
import { Metadata } from 'next' 
import { RESOURCE_URL } from '@/constants'
import Product from '@/views/share/Product'

interface Props {
    params: { id: string } 
}

// ✅ Force server-side static generation so crawlers (WhatsApp, LinkedIn, etc.) see OG tags
// export const dynamic = 'force-static'
// export const revalidate = 60 // revalidate every 60 seconds

// ✅ Your production domain (important for absolute URLs) 

// ✅ Generate SEO + social metadata server-side
// export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
//     const { type } = params
//     const { id } = searchParams

//     console.log(type);


//     if (type === 'event') {
//         try {
//             const response = await unsecureHttpService.get(`${URLS.event}/events`, { params: { id } })
//             const event = response.data?.content[0]

//             if (event?.eventName) {

//                 console.log(RESOURCE_URL + event.currentPicUrl);
//                 const imageUrl = `${RESOURCE_URL}${event.currentPicUrl}`

//                 const title = `${event.eventName} | Chasescroll`
//                 const description = event.eventDescription || 'Join this amazing event on Chasescroll'
//                 const pageUrl = `${BASE_URL}/share/event?id=${id}`

//                 return {
//                     title,
//                     description,
//                     openGraph: {
//                         type: 'website',
//                         url: pageUrl,
//                         title,
//                         description,
//                         images: [
//                             {
//                                 url: imageUrl,
//                                 width: 1200,
//                                 height: 630,
//                                 alt: event.eventName || 'Event Image',
//                             },
//                         ],
//                         siteName: 'Chasescroll',
//                     },
//                     twitter: {
//                         card: 'summary_large_image',
//                         title,
//                         description,
//                         images: [imageUrl],
//                     },
//                     alternates: {
//                         canonical: pageUrl,
//                     },
//                 }
//             }
//         } catch (error) {
//             console.error('Error fetching event metadata:', error)
//         }
//     }

//     // ✅ Default fallback metadata
//     return {
//         title: 'Chasescroll | Share',
//         description: 'Discover amazing events, fundraisers, and services on Chasescroll',
//         openGraph: {
//             type: 'website',
//             url: `${BASE_URL}/share`,
//             title: 'Chasescroll | Share',
//             description: 'Discover amazing events, fundraisers, and services on Chasescroll',
//             images: [
//                 {
//                     url: `${BASE_URL}/logo.png`,
//                     width: 1200,
//                     height: 630,
//                     alt: 'Chasescroll Logo',
//                 },
//             ],
//         },
//         twitter: {
//             card: 'summary_large_image',
//             title: 'Chasescroll | Share',
//             description: 'Discover amazing events, fundraisers, and services on Chasescroll',
//             images: [`${BASE_URL}/logo.png`],
//         },
//         alternates: {
//             canonical: `${BASE_URL}/share`,
//         },
//     }
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata | undefined> {
//     const { id } = await params 
//     const url = process.env.NEXT_PUBLIC_BASE_URL as string


//     if (type === 'event') {
//         // fetch data
//         let product: any
//         try {
//             product = await fetch(url + "/events/events?id=" + id, {
//                 // headers: myHeaders,
//                 method: 'GET'
//             }).then((res) => res.json())

//             // console.log(product);
//         } catch (error) {
//             console.log(error);
//         }

//         console.log(product);
        

//         // optionally access and extend (rather than replace) parent metadata
//         // const previousImages = (await parent).openGraph?.images || [] 

//         return {
//             title: product?.content?.length > 0 ? product?.content[0]?.eventName : "",
//             description: product?.content?.length > 0 ? product?.content[0]?.eventDescription : "",
//             openGraph: {
//                 title: product?.content?.length > 0 ? product?.content[0]?.eventName : "",
//                 description: product?.content?.length > 0 ? product?.content[0]?.eventDescription : "",
//                 images: [{
//                     url: RESOURCE_URL + (product?.content?.length > 0 ? product?.content[0]?.currentPicUrl : ""),
//                 }],
//             },
//         }
//     }
// }

// ✅ Render page dynamically by type
export default async function SharePage({ params }: Props) {

    const { id } = params 

    return <Product id={id} />
}
