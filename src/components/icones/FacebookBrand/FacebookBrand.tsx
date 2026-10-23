import type { IconProps } from "../../../Types";

/** Versão colorida (marca) do Facebook, usada nos botões de login social. */
export function FacebookBrand(props: IconProps) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="#3B5998"
        d="M14 8.5V6.9c0-.7.5-.9.9-.9H17V2.1L14.1 2C10.9 2 10 4.4 10 6.1v2.4H7.5V12H10v10h4V12h2.7l.5-3.5H14Z"
      />
    </svg>
  );
}
