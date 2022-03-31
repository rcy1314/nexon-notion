import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import cn from 'classnames';

const Pagination: FunctionComponent<{
  current: number;
  totalPaginations: number;
}> = ({ current, totalPaginations }) => {
  return (
    <div className="flex justify-center mt-12">
      {Array(totalPaginations).fill(null).map((_, i) => {
        const p = i + 1;
        // TODO: default page to index
        return (
          <Link href={p === 1 ? '/pages/1/' : `/pages/${p}/`} key={p}>
            <a>
              <button
                className={cn(
                  'transition ease-in-out duration-500 hover:shadow-inner hover:bg-gray-200 focus:bg-gray-300 dark:bg-black dark-hover:bg-gray-700 dark-focus:bg-gray-600 m-2 w-10 h-10',
                  {
                    'font-bold': current === p,
                    'shadow-inner': current === p,
                    'bg-gray-200': current === p,
                    'hover:bg-gray-300': current === p,
                    'hover:bg-gray-400': current === p,
                    'dark:bg-gray-800': current === p,
                  }
                )}
              >
                {' '}
                {p}{' '}
              </button>
            </a>
          </Link>
        );
      })}
    </div>
  );
};

export default Pagination;
