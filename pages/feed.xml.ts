import { GetServerSideProps } from 'next'

import {
  getBlockParentPage,
  getPageProperty,
  idToUuid,
  uuidToId
} from 'notion-utils'
import RSS from 'rss'

import * as config from '@/lib/config'
import * as types from '@/lib/types'
import { author, description, host, name, site } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import { getSocialImageUrl } from '@/lib/get-social-image-url'
import { getCanonicalPageUrl } from '@/lib/map-page-url'
import { ExtendedRecordMap } from '@/lib/types'

const ttlMinutes = 24 * 60 // 24 hours
const ttlSeconds = ttlMinutes * 60

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
    `public, max-age=${ttlSeconds}, stale-while-revalidate=${ttlSeconds}`
  )
  res.setHeader('Content-Type', 'text/xml; charset=utf-8')

  const feed = new RSS({
    title: name,
    site_url: host,
    feed_url: `${host}/feed.xml`,
    description,
    copyright: `${new Date().getFullYear()} ${author}`,
    webMaster: author,
    ttl: ttlMinutes
  })

  // For each siteMap, add all the posts to the feed.
  const pageMap = siteMap.canonicalPageMap
  Object.keys(pageMap).map((pageURL) => {
    const pageData = pageMap[pageURL] as types.CanonicalPageData

    // Skip the root page.
    if (uuidToId(pageData.pageId) === siteMap.site.rootNotionPageId) {
      return
    }

    // Skip the draft page.
    if (pageData.publicPage == false) {
      return
    }

    const recordMap = siteMap.pageMap[pageData.pageId] as ExtendedRecordMap
    const keys = Object.keys(recordMap?.block || {})
    const block = recordMap?.block?.[keys[0]]?.value
    if (!block) return

    const parentPage = getBlockParentPage(block, recordMap)
    const isBlogPost =
      block.type === 'page' &&
      block.parent_table === 'collection' &&
      parentPage?.id === idToUuid(config.rootNotionPageId)
    if (!isBlogPost) {
      return
    }

    const url = getCanonicalPageUrl(site, recordMap)(pageData.pageId)
    const socialImageUrl = getSocialImageUrl(pageData.pageId)
    const description =
      getPageProperty<string>('Description', block, recordMap) ||
      config.description
    feed.item({
      title: pageData.title,
      url,
      guid: pageData.pageId,
      date: pageData.lastEditedTime
        ? pageData.lastEditedTime
        : pageData.createdTime
        ? pageData.createdTime
        : undefined,
      description,
      author,
      enclosure: socialImageUrl
        ? {
            url: socialImageUrl,
            type: 'image/jpeg'
          }
        : undefined
    })
  })

  res.write(feed.xml({ indent: true }))

  res.end()
  return {
    props: {}
  }
}

export default () => null
