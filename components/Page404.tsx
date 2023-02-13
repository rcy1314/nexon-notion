import * as React from 'react'
import Image from 'next/image'

import * as types from '@/lib/types'

import { PageHead } from './PageHead'
import styles from './styles.module.css'
import errImg from 'public/404.png'

export const Page404: React.FC<types.PageProps> = ({ site, pageId, error }) => {
  const title = site?.name || 'Notion Page Not Found'

  return (
    <>
      <PageHead site={site} title={title} />

      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Notion Page Not Found</h1>

          {error ? (
            <p>{error.message}</p>
          ) : (
            pageId && (
              <p>
                Make sure that Notion page &quot;{pageId}&quot; is publicly
                accessible.
              </p>
            )
          )}

          <div
            className={styles.errorImage}
          >
            <Image
              src={errImg}
              alt='404 Not Found'
              width={errImg.width}
              height={errImg.height}
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
            />
          </div>
        </main>
      </div>
    </>
  )
}
