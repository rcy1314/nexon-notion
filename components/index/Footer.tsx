import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';
import { author, github } from 'lib/config';

const ColorBar = () => (
  <div className={`${styles.bar} flex w-full h-1 overflow-hidden`}>
    <div className="w-full">
      <div></div>
    </div>
    <div className="w-full">
      <div></div>
    </div>
    <div className="w-full">
      <div></div>
    </div>
    <div className="w-full">
      <div></div>
    </div>
    <div className="w-full">
      <div></div>
    </div>
    <div className="w-full">
      <div></div>
    </div>
    <div className="w-full">
      <div></div>
    </div>
    <div className="w-full">
      <div></div>
    </div>
    <div className="w-full">
      <div></div>
    </div>
    <div className="w-full">
      <div></div>
    </div>
    <div className="w-full">
      <div></div>
    </div>
    <div className="w-full">
      <div></div>
    </div>
  </div>
);

const Footer: FunctionComponent = () => {
  return (
    <div className="bg-white shadow-lg dark:bg-gray-800">
      <div className={`${styles.content} py-12 text-center`}>
        Copyright © 2022{' '}
        <Link href={github}>
          <a className="font-bold text-gray-700 dark:text-gray-300">
            {author}
          </a>
        </Link>
        . All rights reserved.
        <div>
          Powered by
          <Link href="https://nextjs.org/">
            <a className="px-1 font-bold text-gray-700 dark:text-gray-300">
              Next.js
            </a>
          </Link>
          & Made with ❤.
        </div>
      </div>
      <ColorBar></ColorBar>
    </div>
  );
};

export default Footer;
