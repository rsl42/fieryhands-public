import Head from "next/head";
import "rsuite/dist/rsuite.min.css";
import "../styles/index.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Əlimyandı - qaqa tut</title>
      </Head>

        <Component {...pageProps} />
    </>
  );
}

export default MyApp;
