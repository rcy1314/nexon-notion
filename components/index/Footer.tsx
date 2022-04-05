import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import { FaTwitter, FaZhihu, FaGithub, FaLinkedin } from 'react-icons/fa'
import styles from './Footer.module.scss';
import * as config from 'lib/config'
import cn from 'classnames'

const year = new Date().getFullYear()

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
      <div className="flex py-6 sm:py-10 flex-col sm:flex-row flex-shrink-0 w-full">
        <div className="basis-1/3 my-2 text-center">
          Copyright © {year}{' '}
          <a className="font-bold text-gray-700 dark:text-gray-300">
            {config.author}
          </a>
          . All rights reserved.
        </div>
        <div className="basis-1/3 my-2 text-center">
          <div>
            Powered by
            <Link href="https://github.com/fky2015/nexon">
              <a className="px-1 font-bold text-gray-700 dark:text-gray-300">
                Nexon
              </a>
            </Link>
            & Made with ❤
          </div>
        </div>

        <div className="basis-1/3 my-2 flex text-2xl items-center justify-center h-8">
          {config.twitter && (
            <a
              className={cn(styles.twitter, styles.social)}
              href={`https://twitter.com/${config.twitter}`}
              title={`Twitter @${config.twitter}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaTwitter />
            </a>
          )}

          {config.zhihu && (
            <a
              className={cn(styles.zhihu, styles.social)}
              href={`https://zhihu.com/people/${config.zhihu}`}
              title={`Zhihu @${config.zhihu}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaZhihu />
            </a>
          )}

          {config.github && (
            <a
              className={cn(styles.github, styles.social)}
              href={`https://github.com/${config.github}`}
              title={`GitHub @${config.github}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaGithub />
            </a>
          )}

          {config.linkedin && (
            <a
              className={cn(styles.linkedin, styles.social)}
              href={`https://www.linkedin.com/in/${config.linkedin}`}
              title={`LinkedIn ${config.linkedin}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaLinkedin />
            </a>
          )}
        </div>
      </div>
      <ColorBar></ColorBar>
    </div>
  );
};

export default Footer;
