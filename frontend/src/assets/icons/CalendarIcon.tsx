interface Args {
  color?: string;
}

const CalendarIcon = ({ color = "#050504" }: Args) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 3V7.5"
      stroke={color}
      strokeWidth="2.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 3V7.5"
      stroke={color}
      strokeWidth="2.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.25 13.635H30.75"
      stroke={color}
      strokeWidth="2.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M31.5 12.75V25.5C31.5 30 29.25 33 24 33H12C6.75 33 4.5 30 4.5 25.5V12.75C4.5 8.25 6.75 5.25 12 5.25H24C29.25 5.25 31.5 8.25 31.5 12.75Z"
      stroke={color}
      strokeWidth="2.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M17.9937 20.55H18.0072" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.441 20.55H12.4545" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.441 25.05H12.4545" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default CalendarIcon;
