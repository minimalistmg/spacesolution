export const SITE = {
  name: 'Space Solutions',
  url: 'https://spacesolution.in',
  tagline: 'Interior Designers in Mysuru & Karnataka',
  email: 'marketing@spacesolution.co.in',
  phones: ['+916364564563', '+919845241484'],
  address: {
    streetAddress: '90, Kalidasa Rd, opp. Muthoot Finance, 3rd A Block, Vani Vilas Mohalla',
    addressLocality: 'Mysuru',
    addressRegion: 'Karnataka',
    postalCode: '570002',
    addressCountry: 'IN',
  },
  social: {
    facebook: 'https://www.facebook.com/spacesolutio',
    instagram: 'https://www.instagram.com/spacesolutions.mys',
  },
} as const;

export function getLocalBusinessSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE.name,
    url: siteUrl,
    image: `${siteUrl}/images/favicon.png`,
    description:
      'Residential and commercial interior design, modular kitchens, and turnkey fitouts in Mysuru and Karnataka.',
    telephone: SITE.phones,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      ...SITE.address,
    },
    areaServed: {
      '@type': 'State',
      name: 'Karnataka',
    },
    sameAs: [SITE.social.facebook, SITE.social.instagram],
  };
}
