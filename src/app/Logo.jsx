import React from "react";

const Logo = (props) => (
  <div className="logo" onClick={props.onClick}>
    <div className="logo-bolt">
      <svg width="21" height="24" viewBox="0 0 21 24">
        <path
          d="M9.04857 24C8.0819 24 7.32866 23.1716 7.43165 22.2216L8.16315 15.4742C8.19061 15.2209 7.98975 15 7.73197 15L2.19222 15C1.93779 15 1.69618 14.8896 1.5314 14.698L0.95647 14.0295C0.691003 13.7209 0.680427 13.2707 0.931114 12.9502L10.9953 0.0832306C11.0363 0.0307359 11.0997 0 11.1668 0H11.9338C12.9005 0 13.6538 0.828439 13.5508 1.77836L12.8193 8.52577C12.7918 8.77908 12.9927 9 13.2505 9H18.7945C19.0465 9 19.286 9.10827 19.4507 9.29666L20.0389 9.96923C20.3089 10.278 20.3212 10.732 20.0684 11.0546L9.98697 23.9169C9.94591 23.9693 9.88262 24 9.81556 24H9.04857Z"
          fill="url(#paint0_linear)"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.82593 15.5461L8.09443 22.2935C8.03512 22.8405 8.46987 23.3333 9.04857 23.3333H9.59736L19.5437 10.6434C19.5987 10.5731 19.5964 10.476 19.537 10.4081L18.9489 9.73552C18.9117 9.69301 18.8557 9.66667 18.7945 9.66667H13.2505C12.6047 9.66667 12.0854 9.11011 12.1565 8.45392L12.888 1.7065C12.9473 1.15946 12.5125 0.666667 11.9338 0.666667H11.3853L1.45623 13.3609C1.40159 13.4308 1.40361 13.527 1.46191 13.5948L2.03684 14.2633C2.07398 14.3065 2.13048 14.3333 2.19223 14.3333L7.73197 14.3333C8.37772 14.3333 8.89707 14.8899 8.82593 15.5461ZM7.43165 22.2216C7.32866 23.1716 8.0819 24 9.04857 24H9.81556C9.88262 24 9.94591 23.9693 9.98697 23.9169L20.0684 11.0546C20.3212 10.732 20.3089 10.278 20.0389 9.96923L19.4507 9.29666C19.286 9.10827 19.0465 9 18.7945 9H13.2505C12.9927 9 12.7918 8.77908 12.8193 8.52577L13.5508 1.77836C13.6538 0.828439 12.9005 0 11.9338 0H11.1668C11.0997 0 11.0363 0.0307359 10.9953 0.0832306L0.931114 12.9502C0.680427 13.2707 0.691003 13.7209 0.95647 14.0295L1.5314 14.698C1.69618 14.8896 1.93779 15 2.19222 15L7.73197 15C7.98975 15 8.19061 15.2209 8.16315 15.4742L7.43165 22.2216Z"
          fill="url(#paint1_linear)"
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="17.073"
            y1="15.2973"
            x2="5.91331"
            y2="5.80026"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#CE0F50" />
            <stop offset="1" stopColor="#FE112D" />
          </linearGradient>
          <linearGradient
            id="paint1_linear"
            x1="10.5"
            y1="2.73593e-09"
            x2="10.5"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF003D" />
            <stop offset="1" stopColor="#FF003D" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div className="nav-item--title logo-wordmark">
      <svg
        width="63"
        height="12"
        viewBox="0 0 63 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.3635 5.7644C10.6463 5.85106 10.9128 5.98374 11.1522 6.15707C11.7319 6.62042 12.0197 7.41362 12.0197 8.51309V8.7644C12.0197 10.9908 10.8998 12 8.42722 12H0V0H7.8357C10.3083 0 11.4085 1.00524 11.4085 3.25131V3.48691C11.4085 4.72382 11.1403 5.30105 10.3635 5.7644ZM7.34276 4.79843C8.19061 4.79843 8.42722 4.59817 8.42722 3.89922V3.53796C8.42722 2.83901 8.19061 2.63875 7.34276 2.63875H3.00493V4.79843H7.34276ZM7.93823 9.34555C8.8058 9.34555 9.02269 9.14922 9.02269 8.44634V8.08508C9.02269 7.38613 8.8058 7.18979 7.93823 7.18979H3.00493V9.34555H7.93823Z"
          fill="white"
        />
        <path
          d="M18.7495 9.35474H25.6974V12H15.75V0H18.7495V9.35474Z"
          fill="white"
        />
        <path d="M29.4276 12V0H32.5362V12H29.4276Z" fill="white" />
        <path
          d="M40.8894 12V2.62562H36.2664V0H48.4934V2.62562H43.8901V12H40.8894Z"
          fill="white"
        />
        <path
          d="M63 12H52.2237V9.35474L59.1737 2.62562H52.2237V0H63V2.62562L56.0499 9.35474H63V12Z"
          fill="white"
        />
      </svg>
    </div>
  </div>
);

export default Logo;