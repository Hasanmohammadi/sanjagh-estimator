interface Args {
  color?: string;
}

const UserIcon = ({ color = "#00429A" }: Args) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17 8.5C17 5.73858 14.7614 3.5 12 3.5C9.23858 3.5 7 5.73858 7 8.5C7 11.2614 9.23858 13.5 12 13.5C14.7614 13.5 17 11.2614 17 8.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 21C19 17.134 15.866 14 12 14C8.13401 14 5 17.134 5 21"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default UserIcon;
