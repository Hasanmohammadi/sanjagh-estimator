interface Args {
  color?: string;
}

const WalletIcon = ({ color = "#050504" }: Args) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M27.06 20.325C26.43 20.94 26.07 21.825 26.16 22.77C26.295 24.39 27.78 25.575 29.4 25.575H32.25V27.36C32.25 30.465 29.715 33 26.61 33H9.39C6.285 33 3.75 30.465 3.75 27.36V17.265C3.75 14.16 6.285 11.625 9.39 11.625H26.61C29.715 11.625 32.25 14.16 32.25 17.265V19.425H29.22C28.38 19.425 27.615 19.755 27.06 20.325Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.75 18.615V11.76C3.75 9.97503 4.845 8.38497 6.51 7.75497L18.42 3.25497C20.28 2.54997 22.275 3.93001 22.275 5.92501V11.625"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.8382 20.9552V24.0453C33.8382 24.8703 33.1782 25.5453 32.3382 25.5753H29.3982C27.7782 25.5753 26.2932 24.3903 26.1582 22.7703C26.0682 21.8253 26.4282 20.9403 27.0582 20.3253C27.6132 19.7553 28.3782 19.4253 29.2182 19.4253H32.3382C33.1782 19.4553 33.8382 20.1302 33.8382 20.9552Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10.5 18H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default WalletIcon;
