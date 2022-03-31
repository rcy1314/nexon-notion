import pMemoize from 'p-memoize'
import { getAllPagesInSpace, getPageProperty, getBlockTitle } from 'notion-utils'

import * as types from './types'
import { includeNotionIdInUrls, overrideCreatedTime, overrideLastEditedTime } from './config'
import { notion } from './notion'
import { getCanonicalPageId } from './get-canonical-page-id'
import { PageBlock } from 'notion-types'
import { mapImageUrl } from 'lib/map-image-url'
import { getPreviewImageHelper } from 'lib/preview-images'
import pMap from 'p-map'

const uuid = !!includeNotionIdInUrls

export const getAllPages = pMemoize(getAllPagesImpl, {
  cacheKey: (...args) => JSON.stringify(args)
})

export async function getAllPagesImpl(
  rootNotionPageId: string,
  rootNotionSpaceId: string
): Promise<Partial<types.SiteMap>> {
  const pageMap = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    notion.getPage.bind(notion)
  )

  console.group(`async generate canonicalPageMap`)

  const canonicalPageMap = (await pMap(Object.entries(pageMap), async ([pageId, recordMap]): Promise<null | [string, types.CanonicalPageData]> => {
    let canonicalPageId = getCanonicalPageId(pageId, recordMap, {
      uuid
    })

    const block = recordMap.block[pageId]?.value as PageBlock

    // if the page contains a property `Draft` with value `true`,
    // then it is a draft page and should not be included in the sitemap.
    if (block) {
      const draft = getPageProperty('Draft', block, recordMap)

      if (draft === 'Yes') {
        console.warn(`${pageId} is a draft page and will not be included in the sitemap.`)
        return null;
      }
    }

    // Get Page Title
    const title = getBlockTitle(block, recordMap)

    // Get Last Edited Time
    let lastEditedTime: Date | null = null;
    if (overrideLastEditedTime) {
      let timestamp = NaN;
      try {
        timestamp = getPageProperty(overrideLastEditedTime, block, recordMap);
      } catch (e) {
        console.error(e);
      }
      lastEditedTime = new Date(timestamp);
      // If it's invalidDate, set to null
      if (isNaN(lastEditedTime.getTime())) {
        console.warn('overrideLastEditedTime:', overrideLastEditedTime, '. Invalid lastEditedTime: ', lastEditedTime);
        lastEditedTime = null;
      }
    }
    if (!lastEditedTime)
      lastEditedTime = block?.last_edited_time ? new Date(block.last_edited_time) : null

    // Get Created Time
    let createdTime: Date | null = null;
    if (overrideCreatedTime) {
      let timestamp = NaN;
      try {
        timestamp = getPageProperty(overrideCreatedTime, block, recordMap);
      } catch (e) {
        console.error(e);
      }
      createdTime = new Date(timestamp);
      // If it's invalidDate, set to null
      if (isNaN(createdTime.getTime())) {
        console.warn('OverrideCreatedTime:', overrideCreatedTime, '. Invalid createdTime: ', createdTime);
        createdTime = null;
      }
    }
    if (!createdTime)
      createdTime = block?.created_time ? new Date(block.created_time) : null

    // Get Page cover in `format.page_cover`
    const pageCover = mapImageUrl((block as PageBlock).format?.page_cover, block) || null

    // Insert SlugName instead of PageId.
    if (block) {
      const slugName = getPageProperty('SlugName', block, recordMap)

      if (slugName) {
        canonicalPageId = slugName as string
      }
    }

    const canonicalPageData: types.CanonicalPageData = {
      pageId: pageId,
      lastEditedTime,
      createdTime,
      title,
      cover: null,
    }

    if (typeof pageCover === 'string') {
      const previewCover = await getPreviewImageHelper(pageCover);
      canonicalPageData.cover = [pageCover, previewCover];
    }

    return [canonicalPageId, canonicalPageData];
  }, { concurrency: 4 }))
    .filter(v => v !== null)
    .reduce((map, [canonicalPageId, canonicalPageData]: [string, types.CanonicalPageData]) => {
      if (map[canonicalPageId]) {
        console.error(
          'error duplicate canonical page id',
          canonicalPageId,
          canonicalPageData.pageId,
          map[canonicalPageId]
        )

        return map
      }

      map[canonicalPageId] = canonicalPageData;
      return map;
    }, {} as { [pageId: string]: types.CanonicalPageData })

  console.log(canonicalPageMap)
  console.groupEnd()

  return {
    pageMap,
    canonicalPageMap
  }
}

