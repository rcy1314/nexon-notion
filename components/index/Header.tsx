import React, {
  FunctionComponent,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.scss';
import cn from 'classnames';
import { description } from 'lib/config'
import useDarkMode from '@fisch0920/use-dark-mode'
import { IoMoonSharp, IoSunnyOutline } from 'react-icons/io5'
import profileImage from '../../public/images/profile.png'

const Header: FunctionComponent = () => {

  const [hasMounted, setHasMounted] = React.useState(false);

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

  React.useEffect(() => {
    setHasMounted(true);
  }, [])

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
      {
        hasMounted ?
          <button
            aria-label="Toggle Dark Mode"
            className={cn('hover:animate-pulse',)}
            onClick={() => darkMode.toggle()}
          >
            {darkMode.value ? (
              <IoMoonSharp
                className='h-6 w-6'
              />
            ) : (
              <IoSunnyOutline
                className='h-6 w-6' />
            )}
          </button> : null
      }
    </div>
  );
};

export default Header;
