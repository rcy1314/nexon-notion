import type { GetServerSideProps } from 'next'

import { uuidToId } from 'notion-utils'

import { host } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import type { SiteMap } from '@/lib/types'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()
    return {
      props: {}
    }
  }

  const siteMap = await getSiteMap()

  // cache for up to 8 hours
  res.setHeader(
    'Cache-Control',
    'public, max-age=28800, stale-while-revalidate=28800'
  )
  res.setHeader('Content-Type', 'text/xml')
  res.write(createSitemap(siteMap))
  res.end()

  return {
    props: {}
  }
}

const createSitemap = (siteMap: SiteMap) =>
  `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${host}</loc>
    </url>

    <url>
      <loc>${host}/</loc>
    </url>

    ${Object.entries(siteMap.canonicalPageMap)
      .filter(
        ([, data]) => uuidToId(data.pageId) !== siteMap.site.rootNotionPageId
      )
      .map(([canonicalPagePath, canonicalPageData]) =>
        `
          <url>
            <loc>${host}/${canonicalPagePath}</loc>
            <lastmod>${canonicalPageData.lastEditedTime.toISOString()}</lastmod>
          </url>
        `.trim()
      )
      .join('')}
  </urlset>
`

export default () => null
