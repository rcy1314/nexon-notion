import React, {
  FunctionComponent,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.scss';
import cn from 'classnames';
// import classnames from 'classnames/bind';
import { description } from 'lib/config'
import useDarkMode from 'use-dark-mode'
import profileImage from '../../public/images/profile.png'
import darkIcon from '../../public/icons8-moon-and-stars-96.png'
import lightIcon from '../../public/icons8-sun-96.png'
// const cx = classnames.bind(styles);

const Header: FunctionComponent = () => {
  const darkMode = useDarkMode(false, {
    onChange: (state: boolean) => {
      const htmlElement = document.documentElement;
      if (state) {
        htmlElement.classList.add('dark');
        htmlElement.classList.remove('light');
      } else {
        htmlElement.classList.add('light');
        htmlElement.classList.remove('dark');
      }
    }
  })

  return (
    <div
      className={cn(
        'z-50 absolute top-0 left-0 flex justify-between w-full px-3 py-3 sm:px-8',
        {
          'sm:fixed': true,
        },
        styles['frost-glass']
      )}
    >
      <div className="hover:animate-pulse">
        <Link href="/">
          <a className="flex items-center">
            <div className="h-6 w-6">
              <Image
                className={`borderCircle mr-2 dark:bg-grey-300`}
                src={profileImage}
                alt={'FKYnJYQ'}
                placeholder="blur"
                width={24}
                height={24}
              /></div>

            <div>{description}</div>
          </a>
        </Link>
      </div>
      <button
        aria-label="Toggle Dark Mode"
        className={cn('hover:animate-pulse')}
        onClick={() => darkMode.toggle()}
      >
        {darkMode.value ? (
          <Image
            src={darkIcon}
            width="24px"
            height="24px"
            layout="fixed"
            placeholder="blur"
            alt="Sun"
            className="invert"
          ></Image>
        ) : (
          <Image
            src={lightIcon}
            width="24px"
            height="24px"
            layout="fixed"
            placeholder="blur"
            alt="Moon and Stars"
          ></Image>
        )}
      </button>
    </div>
  );
};

export default Header;
