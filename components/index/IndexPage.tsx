import { CanonicalPageDataSerialized } from 'lib/types';
import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import utilStyles from 'styles/utils.module.css';
import { parseISO, format } from 'date-fns';
import Layout from './Layout';
import Pagination from './Pagination';

const Date: FunctionComponent<{
  dateString: string;
  last_modified_atString: string;
}> = ({ dateString, last_modified_atString }) => {
  const date = parseISO(dateString);
  const last_modified_at =
    last_modified_atString !== null ? parseISO(last_modified_atString) : null;
  return (
    <div className="transition ease-in-out duration-500 group-hover:text-blue-500 dark:text-white dark:group-hover:text-blue-400">
      发布于
      <time dateTime={dateString}> {format(date, 'LLLL d, yyyy')}</time>
      {last_modified_at !== null ? (
        <>
          <span className="mx-1">/</span>
          更新于
          <time dateTime={last_modified_atString}>
            {' '}
            {format(last_modified_at, 'LLLL d, yyyy')}
          </time>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

const BlogCard: FunctionComponent<{
  data: CanonicalPageDataSerialized;
  className: string
}> = ({ data, className }) => {
  return (
    <Link href={`/${data.pageId}`}>
      <div
        className={
          cn(
            className,
            'group transition-all ease-in-out duration-700 hover:shadow-lg shadow bg-white dark:bg-gray-900 sm:rounded-lg'
          )
        }
      >
        <div className="relative z-0 h-auto overflow-hidden">
          <div
            className={cn(
              'absolute bottom-0 left-0 h-full w-full sm:rounded-t',
              'pattern'
            )}
          ></div>
          {data.cover !== null ? (
            <Image
              className="z-50 w-full sm:rounded-t-lg"
              alt="blog card covor"
              placeholder="blur"
              blurDataURL={data.cover[1].dataURIBase64}
              width={data.cover[1].originalWidth}
              height={data.cover[1].originalHeight}
              src={data.cover[0]}
            ></Image>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col justify-around px-5 py-3 sm:py-6 sm:px-10">
          <Link href={`/${data.pageId}`}>
            <a className="">
              <div className="mb-2 text-2xl group-hover:text-red-600 dark:group-hover:text-red-300 transition duration-500 ease-in-out">
                {data.title}
              </div>
            </a>
          </Link>
          <div
            className="my-3 text-sm text-gray-800 dark:text-gray-300"
          ></div>

          <div className="flex items-center justify-between mt-2 text-sm">
            <div>
              <Date
                dateString={data.createdTime}
                last_modified_atString={data.lastEditedTime}
              ></Date>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const BlogCardList: FunctionComponent<{
  pages: CanonicalPageDataSerialized[]
}> = (
  {
    pages
  }
) => {
    console.log(pages)
    return <section className={cn(
      utilStyles.headingMd,
      utilStyles.padding1px
    )}>
      <div className={cn(utilStyles.list)}>
        {pages.map((data) => (
          <BlogCard
            className="my-8 hover:my-10"
            data={data}
            key={data.pageId}
          ></BlogCard>
        ))}
      </div>
    </section>;
  };


const IndexPage: FunctionComponent<{
  pages: CanonicalPageDataSerialized[],
  index: number,
  totalPaginations: number,
}> = (
  {
    pages,
    index,
    totalPaginations,
  }
) => {
    return <Layout home><BlogCardList pages={pages}></BlogCardList>
      <Pagination current={index} totalPaginations={totalPaginations}></Pagination>
    </Layout>;
  };

export default IndexPage;

