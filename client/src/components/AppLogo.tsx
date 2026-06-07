import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { clsx } from 'clsx';

const LOGO_SRC = '/logo/logo.png';

const sizeMap = {
  sm: { container: 'h-11 w-11 rounded-xl', icon: 22 },
  md: { container: 'h-14 w-14 rounded-xl', icon: 26 },
  lg: { container: 'h-24 w-24 sm:h-28 sm:w-28 rounded-2xl', icon: 40 },
} as const;

interface AppLogoProps {
  size?: keyof typeof sizeMap;
  className?: string;
}

export const AppLogo = ({ size = 'md', className }: AppLogoProps) => {
  const [imgError, setImgError] = useState(false);
  const { container, icon } = sizeMap[size];

  return (
    <div
      className={clsx(
        'flex shrink-0 items-center justify-center overflow-hidden shadow-lg ring-2 ring-[rgba(var(--primary),0.25)]',
        container,
        imgError && 'bg-primary text-white',
        className
      )}
    >
      {!imgError ? (
        <img
          src={LOGO_SRC}
          alt="SpendWise"
          className="h-full w-full object-contain p-0.5"
          onError={() => setImgError(true)}
        />
      ) : (
        <Wallet size={icon} />
      )}
    </div>
  );
};

export const APP_NAME = 'SpendWise';
