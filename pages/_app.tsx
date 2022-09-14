import "reflect-metadata";
import "../sass/base.scss";
import 'react-toastify/dist/ReactToastify.css';
import { NextUIProvider } from "@nextui-org/react";
import { sessionOptions } from "../src/utils/withIronSession";
import App, { AppContext } from "next/app";
import { getIronSession, IronSessionData } from "iron-session";
import { UserLogged } from "../src/global/types";
import {ToastContainer} from 'react-toastify';


const MyApp = ({ Component, pageProps }) => {
  return (
    <NextUIProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </NextUIProvider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const ironSession: IronSessionData = await getIronSession(
    appContext.ctx.req,
    appContext.ctx.res,
    sessionOptions
  );

  const appProps = await App.getInitialProps(appContext);

  const user: UserLogged = ironSession.user ?? { logged: false };

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      user,
    },
  };
};

export default MyApp;
