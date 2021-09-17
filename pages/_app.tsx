import type { AppProps } from "next/app";
import { FC } from "react";
import SanityProvider from "../providers/SanityProvider";
import "../styles/global.css";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <SanityProvider>
      <Component {...pageProps} />
    </SanityProvider>
  </>
);

export default MyApp;
