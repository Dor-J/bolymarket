import type { ReactNode } from 'react';
import type { SidebarIconKey } from '@/lib/sports/sidebarNav';
import { cn } from '@/lib/cn';

export function LiveNavIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={cn('size-5 text-red-500', className)}
      aria-hidden
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor">
        <path d="M5.641,12.359c-1.855-1.855-1.855-4.863,0-6.718" opacity="0.32" />
        <path d="M3.52,14.48C.493,11.454,.493,6.546,3.52,3.52" opacity="0.32" />
        <circle cx="9" cy="9" r="1.75" />
        <path d="M12.359,12.359c1.855-1.855,1.855-4.863,0-6.718" opacity="0.32" />
        <path d="M14.48,14.48c3.027-3.027,3.027-7.934,0-10.96" opacity="0.32" />
      </g>
    </svg>
  );
}

export function FuturesNavIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={cn('size-5 text-neutral-500', className)}
      aria-hidden
    >
      <rect
        x="2.75"
        y="2.75"
        width="12.5"
        height="12.5"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <line x1="5.75" y1="8" x2="5.75" y2="12.25" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12.25" y1="10.25" x2="12.25" y2="12.25" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9" y1="5.75" x2="9" y2="12.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function WorldCupIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" className={cn('size-5', className)} aria-hidden>
      <path
        fill="currentColor"
        d="M2.06 10.267c1.307-1.307 3.647-1.113 5.187.426 1.54 1.54 1.753 3.82.42 5.154a3.03 3.03 0 0 1-1.82.82 8 8 0 0 1-4.527-5.1c.129-.49.384-.94.74-1.3m8.727.4c1.547-1.514 3.846-1.707 5.153-.447a2.9 2.9 0 0 1 .734 1.333 8 8 0 0 1-4.527 5.114 3 3 0 0 1-1.787-.847c-1.307-1.306-1.113-3.613.427-5.153M9 3.333c2.18 0 3.94 1.494 3.94 3.334S11.18 10 9 10 5.06 8.507 5.06 6.667 6.82 3.333 9 3.333m0-2c1.129 0 2.245.241 3.273.707-.22.14-1.146.627-3.273.627-2.126 0-3.053-.487-3.273-.627A7.9 7.9 0 0 1 9 1.333"
      />
    </svg>
  );
}

function MlbIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" className={cn('size-5 text-[#B90E3B]', className)} aria-hidden>
      <path
        fill="currentColor"
        d="M7.578 1.217c.205.67.467 1.316.75 1.863l-.845.386-.004.002a.667.667 0 0 0 .28 1.272h.017a.65.65 0 0 0 .273-.06l.947-.427.037.063a16 16 0 0 0 1.589 2.07l-.427.434a.667.667 0 0 0 .47 1.134h.004c.175-.001.342-.07.466-.194l.433-.434a16 16 0 0 0 2.001 1.547l-.407.913.002-.003a.665.665 0 0 0 .332.884l-.004-.002q.131.061.277.062c.268 0 .5-.16.606-.394l.352-.757c.643.334 1.32.617 2.108.865l-.008.05c-.608 3.221-3.148 5.76-6.42 6.376l-.022-.087a11.7 11.7 0 0 0-.844-2.046l.787-.354h.004a.666.666 0 1 0-.524-1.18l-.906.407-.034-.056c-.447-.69-.954-1.341-1.513-1.944l.426-.434a.667.667 0 0 0-.94-.94l-.433.426A16 16 0 0 0 4.248 9l.427-.967-.002.005a.667.667 0 0 0-1.212-.551l-.385.844c-.594-.3-1.22-.553-1.948-.77l.008-.05c.608-3.222 3.148-5.762 6.42-6.377z"
      />
    </svg>
  );
}

function NhlIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" className={cn('size-5 text-[#15803d]', className)} aria-hidden>
      <path
        fill="currentColor"
        d="M16.996 1c-.015.033-5.195 11.465-6.826 15.206l-.004.009A1.33 1.33 0 0 1 8.95 17H4.363l1.094-3.253h2.247c.515-.007.96-.306 1.18-.747l6.112-12zm-14 16H1.663a.667.667 0 0 1-.62-.893l.62-1.54.003-.01a1.33 1.33 0 0 1 1.23-.824h1.187z"
      />
    </svg>
  );
}

function UfcIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" className={cn('size-4.5 text-red-500', className)} aria-hidden>
      <path
        fill="currentColor"
        d="M14.331 15.887v.668a1.334 1.334 0 0 1-1.333 1.333H6.003a1.334 1.334 0 0 1-1.334-1.333v-.668zM11.074 1.89a2 2 0 0 1 1.37.609h1.261a2 2 0 0 1 1.96 2v2.054q.01.137 0 .274v3.727l-1.333 4H4.664l-2.334-4V5.885a.72.72 0 0 1 .76-.667h.573v-.72a2 2 0 0 1 2-2h1.24a2 2 0 0 1 2.761-.093 2 2 0 0 1 1.41-.516z"
      />
    </svg>
  );
}

function FootballIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18" className={cn('size-4.5 text-[#00457B]', className)} aria-hidden>
      <path d="M17.223 9.508a.7.7 0 0 0-.647-.118l.004-.002c-.651.205-1.422.37-2.215.46l-.059.006c-.064-.742-.12-1.462-.17-2.119.658-.261 1.215-.46 1.237-.466-.911-3.233-3.834-5.563-7.301-5.563a7.571 7.571 0 0 0-5.364 12.916c3.468 0 4.238 1.469 6.28 1.469 2.04 0 3.326-1.455 3.326-2.825a3.64 3.64 0 0 0-.657-1.933l.008.011h1.363c.097 1.354.305 2.608.618 3.82l-.032-.147a2.27 2.27 0 0 0 2.291 1.264h-.01.008q.405 0 .789-.074l-.026.004a.71.71 0 0 0 .565-.655v-.002l.268-5.453.001-.032a.7.7 0 0 0-.274-.56z" />
    </svg>
  );
}

function SoccerIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" className={cn('size-4.5 text-[#16a34a]', className)} aria-hidden>
      <path
        fill="currentColor"
        d="M2.06 10.267c1.307-1.307 3.647-1.113 5.187.426 1.54 1.54 1.753 3.82.42 5.154a3.03 3.03 0 0 1-1.82.82 8 8 0 0 1-4.527-5.1c.129-.49.384-.94.74-1.3m8.727.4c1.547-1.514 3.846-1.707 5.153-.447a2.9 2.9 0 0 1 .734 1.333 8 8 0 0 1-4.527 5.114 3 3 0 0 1-1.787-.847c-1.307-1.306-1.113-3.613.427-5.153m2.426-8.127A8 8 0 0 1 17 9.333q0 .57-.087 1.134a13 13 0 0 1-2.953-3.8 6.05 6.05 0 0 1-.746-4.127m-8.44.007a6 6 0 0 1-.747 4.12 13 13 0 0 1-2.94 3.76A7.4 7.4 0 0 1 1 9.333a8 8 0 0 1 3.773-6.786M9 3.333c2.18 0 3.94 1.494 3.94 3.334S11.18 10 9 10 5.06 8.507 5.06 6.667 6.82 3.333 9 3.333m0-2c1.129 0 2.245.241 3.273.707-.22.14-1.146.627-3.273.627-2.126 0-3.053-.487-3.273-.627A7.9 7.9 0 0 1 9 1.333"
      />
    </svg>
  );
}

function TennisIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" className={cn('size-4.5 text-[#9ACD32]', className)} aria-hidden>
      <path
        fill="currentColor"
        d="M12.935 5.073a5.66 5.66 0 0 0-2.414-1.414l-.047-.012a6.7 6.7 0 0 1-2.819-1.72l-.667-.667-.056.012a8 8 0 0 1 2.071-.27c2.204 0 4.199.89 5.645 2.331h.001A8 8 0 1 1 1 8.998c0-.713.093-1.404.255-2.005l.687.666v.001a6.4 6.4 0 0 1 1.673 2.813l.01.039a5.55 5.55 0 0 0 2.223 3.095l.148.094a5.58 5.58 0 0 0 6.939-8.628m-6.24-2.16a7.9 7.9 0 0 0 3.447 2l.03.008a4.26 4.26 0 0 1 3.023 4.478l-.001.02a4.3 4.3 0 0 1-1.886 3.12l.015-.008a4.2 4.2 0 0 1-2.356.715c-1.944 0-3.582-1.311-4.086-3.126l-.013-.055A7.74 7.74 0 0 0 2.881 6.72L1.755 5.593h.001l.02-.047A7.86 7.86 0 0 1 5.589 1.76z"
      />
    </svg>
  );
}

function BasketballIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" className={cn('size-4.5 text-[#FA4E00]', className)} aria-hidden>
      <path
        fill="currentColor"
        d="M15.446 13.715a8 8 0 0 0 1.327-2.86 6.2 6.2 0 0 0-2.567 1.02c.44.594.854 1.213 1.24 1.84M11.52 16.58a8.05 8.05 0 0 0 3.006-1.812 24 24 0 0 0-1.333-2.02 6.17 6.17 0 0 0-1.667 3.832zM12.973 3.76c0 1.839-.6 3.538-1.613 4.925a25 25 0 0 1 2.013 2.152 7.5 7.5 0 0 1 3.6-1.34c.013-.166.027-.326.027-.5a8 8 0 0 0-4.227-7.05c.127.587.2 1.193.2 1.813m-9.72-.313a25.6 25.6 0 0 1 7.12 4.338 6.97 6.97 0 0 0 .82-6.47C10.493 1.113 9.76 1 9 1c-2.26 0-4.294.94-5.747 2.446m1.333 8.703a8.4 8.4 0 0 1-3.173-.627C2.473 14.701 5.466 17 9 17c.4 0 .786-.04 1.173-.093a7.53 7.53 0 0 1 2.187-5.212q-.872-1.048-1.854-1.985a8.35 8.35 0 0 1-5.913 2.445z"
      />
    </svg>
  );
}

function BaseballIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" className={cn('size-4.5 text-[#B90E3B]', className)} aria-hidden>
      <path
        fill="currentColor"
        d="M1.086 8.893c.523.19 1.029.415 1.45.64l-.327.727-.024.061a.67.67 0 0 0 .357.82l-.004-.002a.666.666 0 0 0 .884-.332l.274-.606.055.033q.92.598 1.738 1.333l-.966.96a.668.668 0 0 0 .47 1.14h.008a.67.67 0 0 0 .449-.173l.98-.933.324.364q.506.592.942 1.236l-.667.287h-.004a.667.667 0 0 0 .265 1.28l.02-.001a.65.65 0 0 0 .272-.06l.787-.387-.03-.061c.29.542.539 1.11.764 1.781h-.108a8 8 0 0 1-7.992-8v-.133z"
      />
    </svg>
  );
}

function HockeyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" className={cn('size-4.5 text-[#15803d]', className)} aria-hidden>
      <path
        fill="currentColor"
        d="M16.996 1c-.015.033-5.195 11.465-6.826 15.206l-.004.009A1.33 1.33 0 0 1 8.95 17H4.363l1.094-3.253h2.247c.515-.007.96-.306 1.18-.747l6.112-12z"
      />
    </svg>
  );
}

function EsportsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" className={cn('size-4.5 text-[#55acee]', className)} aria-hidden>
      <path
        fill="currentColor"
        d="m17.287 12.653-2.048-6.774a2.146 2.146 0 0 0-2.686-1.425l.015-.004a2.15 2.15 0 0 0-.833.478l.002-.002H7.02a2.14 2.14 0 0 0-.816-.472L6.19 4.45a2.141 2.141 0 0 0-2.666 1.413l-.005.015-2.048 6.775a2.142 2.142 0 0 0 4.094 1.257l.004-.015.756-2.504a1.512 1.512 0 0 0 2.019-1.155l.002-.01h2.06a1.514 1.514 0 0 0 1.49 1.26h.003q.28 0 .541-.096l-.01.003.755 2.504a2.143 2.143 0 1 0 4.097-1.26z"
      />
    </svg>
  );
}

function GenericSportIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18" className={cn('size-4.5 text-neutral-400', className)} aria-hidden>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

type IconComponent = (props: { className?: string }) => ReactNode;

const ICON_MAP: Record<SidebarIconKey, IconComponent> = {
  live: LiveNavIcon,
  futures: FuturesNavIcon,
  'world-cup': WorldCupIcon,
  mlb: MlbIcon,
  nhl: NhlIcon,
  ufc: UfcIcon,
  football: FootballIcon,
  soccer: SoccerIcon,
  tennis: TennisIcon,
  cricket: GenericSportIcon,
  basketball: BasketballIcon,
  baseball: BaseballIcon,
  hockey: HockeyIcon,
  rugby: GenericSportIcon,
  'table-tennis': GenericSportIcon,
  golf: GenericSportIcon,
  f1: GenericSportIcon,
  boxing: UfcIcon,
  pickleball: GenericSportIcon,
  lacrosse: GenericSportIcon,
  esports: EsportsIcon,
};

export function SidebarSportIcon({
  icon,
  className,
  muted = false,
}: {
  icon: SidebarIconKey;
  className?: string;
  muted?: boolean;
}) {
  const Icon = ICON_MAP[icon] ?? GenericSportIcon;
  return <Icon className={cn(muted && 'text-neutral-300!', className)} />;
}

export function ChevronDownSmall({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={cn('size-3 shrink-0 text-text-secondary transition-transform duration-200', className)}
      aria-hidden
    >
      <polyline
        points="1.75 4.25 6 8.5 10.25 4.25"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
