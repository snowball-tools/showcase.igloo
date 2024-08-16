import { browserSupportsWebAuthn } from '@simplewebauthn/browser'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

import TestView from '../components/TestView'
import track from '../helpers/analytics'
import { useSnowball } from '../helpers/webauthn'
import AuthView from './Views/AuthView'
import BrowserUnsupportedView from './Views/BrowserUnsupportedView'
import WalletView from './Views/WalletView'

const Home = () => {
  const snowball = useSnowball()
  const isAuthenticated = !!snowball.session?.getSessionExpirationTime()

  const [isWebAuthnSupported, setIsWebAuthnSupported] = useState(true)

  useEffect(() => {
    const supported = browserSupportsWebAuthn() && !navigator.userAgent.includes('Firefox')
    setIsWebAuthnSupported(supported)
  }, [])

  if (!isWebAuthnSupported) {
    return <BrowserUnsupportedView />
  }

  const renderView = () => {
    if (process.env.NEXT_PUBLIC_SHOW_TEST_VIEW === 'true') {
      return <TestView />
    } else if (!isWebAuthnSupported) {
      track('Unsupported Browser')
      return <BrowserUnsupportedView />
    } else if (isAuthenticated) {
      track('Authenticated User')
      return <WalletView />
    }
    track('Initial View')
    return <AuthView />
  }

  return (
    <>
      <Head>
        <title>Igloo</title>
        <meta name="description" content="MPC Passkey Wallet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      {renderView()}
    </>
  )
}

export default Home
