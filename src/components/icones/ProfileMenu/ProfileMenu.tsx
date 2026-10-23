import type { IconProps } from "../../../Types";

/**
 * Ícones de traço (stroke) usados na tela "Meu perfil".
 * Todos usam `currentColor`, então a cor vem de `text-*` no elemento pai.
 */
function StrokeIcon({ children, ...props }: IconProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <circle cx="12" cy="7.2" r="3.7" />
      <rect x="5" y="13" width="14" height="7.8" rx="3.9" />
    </StrokeIcon>
  );
}

export function LocationIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M12 13.43a3.12 3.12 0 1 0 0-6.24 3.12 3.12 0 0 0 0 6.24Z" />
      <path d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.193 5.193 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z" />
    </StrokeIcon>
  );
}

export function ActivityIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M2 2h1.74c1.08 0 1.93.93 1.84 2l-.83 9.96a2.796 2.796 0 0 0 2.79 3.03h10.65c1.44 0 2.7-1.18 2.81-2.61l.54-7.5c.12-1.66-1.14-3.01-2.81-3.01H5.82" />
      <path d="M8.25 19.5V22M16.25 19.5V22" />
      <path d="M9 8h12" />
      <path
        d="M6 8h15l-.5 6.4c-.1 1.2-1.2 2.1-2.4 2.1H8.9c-1.4 0-2.6-1.2-2.5-2.7L6 8Z"
        fill="currentColor"
        fillOpacity={0.35}
        stroke="none"
      />
    </StrokeIcon>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </StrokeIcon>
  );
}

export function OffersIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M13.5 3H9C4 3 2 5 2 10v5c0 5 2 7 7 7h6c5 0 7-2 7-7v-4.5" />
      <path d="M6.5 15.5 10 12l2.5 2.5 4-4.5" />
      <circle cx="19.5" cy="4.5" r="2.25" />
    </StrokeIcon>
  );
}

export function DownloadsIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M8.5 4.5H7C4 4.5 2 6 2 9.5v6C2 19 4 20.5 7 20.5h10c3 0 5-1.5 5-5v-6c0-3.5-2-5-5-5h-1.5" />
      <path d="M12 3v9.5" />
      <path d="m8.75 9.5 3.25 3.25 3.25-3.25" />
    </StrokeIcon>
  );
}

export function SupportIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M12 9v5" />
      <path d="M21.76 15.92 15.36 4.4C14.5 2.85 13.31 2 12 2s-2.5.85-3.36 2.4l-6.4 11.52c-.81 1.47-.9 2.88-.25 3.99.65 1.11 1.93 1.72 3.64 1.72h12.74c1.71 0 2.99-.61 3.64-1.72.65-1.11.56-2.53-.25-3.99Z" />
      <path d="M11.995 17h.009" />
    </StrokeIcon>
  );
}

export function SignOutIcon(props: IconProps) {
  return (
    <StrokeIcon viewBox="0 0 20 20" {...props}>
      <path d="M18.1592 10.1006H8.125" />
      <path d="M15.7202 7.67059L18.1602 10.1006L15.7202 12.5306" />
      <path d="M13.6332 6.35825C13.3582 3.37492 12.2415 2.29158 7.79985 2.29158C1.88234 2.29158 1.88234 4.21658 1.88234 9.99992C1.88234 15.7833 1.88234 17.7083 7.79985 17.7083C12.2415 17.7083 13.3582 16.6249 13.6332 13.6416" />
    </StrokeIcon>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M15.58 12c0 1.98-1.6 3.58-3.58 3.58S8.42 13.98 8.42 12s1.6-3.58 3.58-3.58 3.58 1.6 3.58 3.58Z" />
      <path d="M12 20.27c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-2.29-3.6-5.58-5.68-9.11-5.68-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19 2.29 3.6 5.58 5.68 9.11 5.68Z" />
    </StrokeIcon>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="m14.53 9.47-5.06 5.06a3.576 3.576 0 1 1 5.06-5.06Z" />
      <path d="M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73c-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19.79 1.24 1.71 2.31 2.71 3.17" />
      <path d="M8.42 19.53c1.14.48 2.35.74 3.58.74 3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-.33-.52-.69-1.01-1.06-1.47" />
      <path d="M15.51 12.7a3.565 3.565 0 0 1-2.82 2.82" />
      <path d="M9.47 14.53 2 22" />
      <path d="M22 2 14.53 9.47" />
    </StrokeIcon>
  );
}

export function GalleryIcon(props: IconProps) {
  return (
    <StrokeIcon {...props}>
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" />
      <path d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="currentColor" fillOpacity={0.6} />
      <path d="m2.67 18.95 4.93-3.31c.79-.53 1.93-.47 2.64.14l.33.29c.78.67 2.04.67 2.82 0l4.16-3.57c.78-.67 2.04-.67 2.82 0L22 13.9" />
      <path
        d="m2.67 18.95 4.93-3.31c.79-.53 1.93-.47 2.64.14l.33.29c.78.67 2.04.67 2.82 0l4.16-3.57c.78-.67 2.04-.67 2.82 0L22 13.9V15c0 5-2 7-7 7H9c-3.2 0-5.2-.8-6.1-3.2l-.23-.85Z"
        fill="currentColor"
        fillOpacity={0.3}
        stroke="none"
      />
    </StrokeIcon>
  );
}
