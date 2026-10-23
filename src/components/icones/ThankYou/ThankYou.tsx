import type { IconProps } from "../../../Types";

export function ThankYou(props: IconProps) {
  return (
    <svg
      width="66"
      height="80"
      viewBox="0 0 66 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M23 8V3.5a1.5 1.5 0 0 1 1.5-1.5h17A1.5 1.5 0 0 1 43 3.5V8" />
      <path d="M9 30V9.5A1.5 1.5 0 0 1 10.5 8h45A1.5 1.5 0 0 1 57 9.5V30" />
      <text
        x="33"
        y="22"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="Roboto Mono, monospace"
        fontSize="9"
        fontWeight="700"
      >
        THANK
      </text>
      <text
        x="33"
        y="33"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontFamily="Roboto Mono, monospace"
        fontSize="9"
        fontWeight="700"
      >
        YOU
      </text>
      <path d="M2 30.5V76a2 2 0 0 0 2 2h58a2 2 0 0 0 2-2V30.5" />
      <path d="M2 30.5 16 21" />
      <path d="M64 30.5 50 21" />
      <path d="M2 31.5 33 57l31-25.5" />
      <path d="M2 77 25 51" />
      <path d="M64 77 41 51" />
    </svg>
  );
}
