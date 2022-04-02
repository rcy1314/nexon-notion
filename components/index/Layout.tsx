import React, { FunctionComponent, ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image'
import Header from './Header';
import Footer from './Footer';
import utilStyles from 'styles/utils.module.css';
import { useState, useEffect } from 'react';
import { description, name } from 'lib/config';
import profileImage from 'public/images/profile.png'
import { AiFillRocket } from 'react-icons/ai';

const Name = (
  <>
    <span className="text-red-500 dark:text-orange-500">FKY</span>
    <span className="text-sm text-gray-700 align-middle dark:text-gray-300">
      {' '}
      &{' '}
    </span>
    <span className="text-blue-500 dark:text-yellow-500">JYQ </span>
  </>
);

export const siteTitle = description;

type PropsType = {
  children: ReactNode;
  home?: boolean;
};

let scrollAnimation = null;

const goToTop = () => {
  const position =
    document.body.scrollTop || document.documentElement.scrollTop;
  if (position) {
    window.scrollBy(0, -Math.max(1, Math.floor(position / 10)));
    scrollAnimation = setTimeout(() => {
      goToTop();
    }, 30);
  } else clearTimeout(scrollAnimation);
};

const Layout: FunctionComponent<PropsType> = ({ children, home = false }) => {
  const [needBackToTop, setNeedBackToTop] = useState(false);

  const checkScroll = (e) => {
    const window = e.currentTarget;

    if (!needBackToTop && window.scrollY >= 500) {
      setNeedBackToTop(!needBackToTop);
    } else if (needBackToTop && window.scrollY < 500) {
      setNeedBackToTop(!needBackToTop);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', (e) => checkScroll(e));
  });

  const Profile = () => {
    return (
      <div className="flex flex-col items-center">
        <div className="flex mt-4 mb-6 rounded-full group">
          <Link href="/">
            <a className="w-24 h-24 rounded-full">
              <Image
                className={`z-10 absolute rounded-full shadow-sm bg-white dark:bg-grey-300 hover:shadow transition ease-in-out duration-500 focus:shadow-outline`}
                src={profileImage}
                placeholder="blur"
                alt={name}
                height="100"
                width="100"
              />
            </a>
          </Link>
        </div>
        <Link href="/">
          <a>
            <h1 className={utilStyles.heading2Xl}>{Name}</h1>
          </a>
        </Link>
        <h2 className="my-0">{description}</h2>
      </div>
    );
  };

  return (
    <>
      <div className="max-w-3xl px-0 mx-auto mt-12 mb-24 sm:px-3">
        <>
          <Head>
            <link rel="icon" href="/favicon.ico" />
            <meta
              name="description"
              content="Learn how to build a personal website using Next.js"
            />
            <meta
              property="og:image"
              content={`https://og-image.now.sh/${encodeURI(
                siteTitle
              )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
            />
            <meta name="og:title" content={siteTitle} />
            <meta name="twitter:card" content="summary_large_image" />
          </Head>
        </>
        <Header></Header>
        <header className="m-6">{home ? <Profile /> : <></>}</header>
        <main>{children}</main>
        {!home && (
          <div className="mt-12">
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
        )}
      </div>
      {needBackToTop ? (
        <div className="fixed bottom-0 right-0 pb-12 pr-3 sm:pr-3">
          <button
            className="m-2 w-8 h-8 bg-white rounded-full shadow hover:shadow-lg dark:bg-gray-200 transition ease-in-out duration-500 focus:shadow-sm"
            onClick={goToTop}
          >
            <div className="p-2 rounded-full hover:animate-pulse">
              <AiFillRocket className="text-red-500 dark:text-orange-500" />
            </div>
          </button>
        </div>
      ) : (
        <></>
      )}
      <Footer></Footer>
    </>
  );
};

export default Layout;
