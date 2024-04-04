import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'

import Box from '../components/Box'
import { ErrorBoundary, start } from '../helpers/bugsnag'
import { IS_DEBUG } from '../helpers/constants'
import { store } from '../store/store'
import '../styles/globals.css'

start()

function MyApp({ Component, pageProps }: AppProps) {
  const setVHVariable = () => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  useEffect(() => {
    setVHVariable()

    window.addEventListener('resize', setVHVariable)
    window.addEventListener('orientationchange', setVHVariable)

    return () => {
      window.removeEventListener('resize', setVHVariable)
      window.removeEventListener('orientationchange', setVHVariable)
    }
  }, [])

  const renderView = () => {
    return (
      <Provider store={store}>
        <Box>
          <Component {...pageProps} />
          <Analytics mode={IS_DEBUG ? 'development' : 'production'} debug={IS_DEBUG} />
        </Box>
      </Provider>
    )
  }

  return ErrorBoundary ? <ErrorBoundary>{renderView()}</ErrorBoundary> : renderView()
}

export default MyApp
