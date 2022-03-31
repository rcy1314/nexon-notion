import React from 'react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { isDev, domain } from 'lib/config'
import { getSiteMaps } from 'lib/get-site-maps'
import { SiteMap } from 'lib/types'
import IndexPage from 'components/index/IndexPage'
import { serializeCanonicalPageData } from 'lib/utils'

const PAGINATION_LIMIT = 10

const dummyData: SiteMap = {
  canonicalPageMap: {
    ...Array(40).fill(0).map((_, i) => ({
      pageID: `${i}`,
      title: `Page ${i}`,
      // slug: `page-${i}`,
      // description: `Page ${i} description`,
      // image: `${domain}/images/image.jpg`,
      createdTime: new Date(),
      lastEditedTime: new Date(),
      cover: null,
      // tags: ['tag1', 'tag2'],
      // categories: ['category1', 'category2'],
      // content: `Page ${i} content`,
    })).reduce((acc, page) => {
      acc[page.pageID] = page
      return acc
    }, {}),
  },
  site: {
    id: 'site-id',
    name: 'Site name',
    domain: domain,
    rootNotionPageId: 'root-notion-page-id',
    rootNotionSpaceId: 'root-notion-page-url',
    timestamp: new Date(),
    isDisabled: false,
    userId: 'user-id',
    createdAt: 0,
    updatedAt: 0,
  },
  pageMap: {},
}

export const getStaticPaths: GetStaticPaths = async () => {
  let siteMap: SiteMap;
  if (isDev) {
    siteMap = dummyData;
  } else {
    siteMap = (await getSiteMaps())[0];
  }

  console.log('canonicalPageMap', siteMap.canonicalPageMap);

  const pages_count = Object.keys(siteMap.canonicalPageMap).length;
  // iter through 1 to pages_count, devided by PAGINATION_LIMIT
  const paths = Array(Math.ceil(pages_count / PAGINATION_LIMIT))
    .fill(null)
    .map((_, i) => ({ params: { page: String(i + 1) } }));

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let siteMap: SiteMap;
  if (isDev) {
    siteMap = dummyData;
  } else {
    siteMap = (await getSiteMaps())[0];
  }
  const pages = Object.values(siteMap.canonicalPageMap);
  // TODO:Sort by createdTime descending
  pages.sort((a, b) => b.createdTime.getTime() - a.createdTime.getTime());

  const totalPaginations = Math.ceil(pages.length / PAGINATION_LIMIT)
  // Get pagination by page param
  const pagesSlice = pages.slice(
    (Number(params.page) - 1) * PAGINATION_LIMIT,
    Number(params.page) * PAGINATION_LIMIT
  );


  try {
    // TODO: redirect

    return {
      props: {
        params,
        pagesSlice: pagesSlice.map(serializeCanonicalPageData),
        totalPaginations
      },
      revalidate: 10
    }

  } catch (err) {
    console.error('page error', domain, err);

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err;
  }
}


function Page({ pagesSlice, params, totalPaginations }: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log('index page props', pagesSlice, params, totalPaginations)

  return <IndexPage pages={pagesSlice} index={Number(params.page)} totalPaginations={totalPaginations} />
}

export default Page
