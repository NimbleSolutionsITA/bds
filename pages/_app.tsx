import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../src/theme/theme';
import createEmotionCache from '../src/theme/createEmotionCache';
import '../styles/globals.css';

import {Provider} from "react-redux";
import {store} from "../src/redux/store";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { appWithTranslation } from 'next-i18next'
import NextNProgress from 'nextjs-progressbar';


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface BDGAppProps extends AppProps {
    emotionCache?: EmotionCache;
}
// Create a client
const queryClient = new QueryClient()

function MyApp(props: BDGAppProps) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    return (
        <Provider store={store}>
            <CacheProvider value={emotionCache}>
                <Head>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                </Head>
                <ThemeProvider theme={theme}>
                    <QueryClientProvider client={queryClient}>
                        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                        <CssBaseline />
                        <NextNProgress color="#000" />
                        <Component {...pageProps} />
                    </QueryClientProvider>
                </ThemeProvider>
            </CacheProvider>
        </Provider>
    );
}

export default appWithTranslation(MyApp);