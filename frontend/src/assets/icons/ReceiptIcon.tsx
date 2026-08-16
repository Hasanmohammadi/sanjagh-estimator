interface Args {
  active?: boolean;
}

const ReceiptIcon = ({ active = false }: Args) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.16884 18.0585C6.92051 17.2518 8.06634 17.316 8.72634 18.196L9.65217 19.4335C10.3947 20.4143 11.5955 20.4143 12.338 19.4335L13.2638 18.196C13.9238 17.316 15.0697 17.2518 15.8213 18.0585C17.453 19.8002 18.7822 19.2227 18.7822 16.7843V6.4535C18.7913 2.75933 17.9297 1.8335 14.4647 1.8335H7.53467C4.06967 1.8335 3.20801 2.75933 3.20801 6.4535V16.7752C3.20801 19.2227 4.54634 19.791 6.16884 18.0585Z"
      fill={active ? "#1A1A1E" : "none"}
      stroke="#1A1A1E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M7.33301 6.4165H14.6663"
      stroke={active ? "white" : "#1A1A1E"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M8.25 10.0835H13.75"
      stroke={active ? "white" : "#1A1A1E"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ReceiptIcon;
