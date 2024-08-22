'use client'

import { SnowballError } from '@snowballtools/types'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Header from '../../components/Header'
import LoadingAnimation from '../../components/LoadingAnimation'
import StickyButtonGroup from '../../components/StickyButtonGroup'
import track from '../../helpers/analytics'
import { logErrorMsg } from '../../helpers/bugsnag'
import { useSnowball } from '../../helpers/webauthn'
import {
  AuthViews,
  authenticated,
  disconnect,
  setErrorMsg,
  setView,
} from '../../store/credentialsSlice'
import { RootState } from '../../store/store'
import InitialView from './InitialView'
import SignUpView from './SignUpView'

export default function AuthView() {
  const [username, setUsername] = React.useState('')
  const { view, errorMsg } = useSelector((state: RootState) => state.credentials)
  const dispatch = useDispatch()
  const snowball = useSnowball()

  async function createPKPWithWebAuthn() {
    track('Signup Start')
    dispatch(setView(AuthViews.REGISTERING))

    try {
      await snowball.auth.passkey.register(username)

      dispatch(setView(AuthViews.MINTED))
    } catch (error) {
      track('Signup Failure')
      logErrorMsg(`${error}`)
      dispatch(setErrorMsg('Error creating passkey'))
    }
  }

  async function authThenGetSessionSigs() {
    track('Auth Start')

    dispatch(setView(AuthViews.AUTHENTICATING))

    try {
      await snowball.auth.passkey.authenticate()

      const address = await snowball.getSmartWalletAddress('passkey')

      dispatch(authenticated(address))
    } catch (error) {
      if (error instanceof SnowballError) {
        console.error('SnowballError', error.name, error.message, error.details)
        console.error(error)
      }
      track(`Auth Failed ${JSON.stringify(error)}`)
      logErrorMsg(`${error}`)
      dispatch(setErrorMsg('Error authenticating passkey'))
    }
  }

  const renderView = () => {
    switch (view) {
      case AuthViews.REGISTERING:
      case AuthViews.AUTHENTICATING:
      case AuthViews.MINTING:
        return (
          <>
            <Header infoView={view} />
            <LoadingAnimation animationDuration={view === AuthViews.IGLOO_NFT_MINTING ? 5 : 2.5} />
          </>
        )
      case AuthViews.MINTED:
        return (
          <>
            <Header infoView={view} />
            <StickyButtonGroup
              buttons={[
                {
                  label: 'Log in',
                  onClick: authThenGetSessionSigs,
                  bgColor: 'bg-cyan-200',
                  textColor: 'text-black',
                  disabledColor: 'disabled:bg-disabled-gray disabled:text-white/10',
                },
              ]}
            />
          </>
        )
      case AuthViews.ERROR:
        return (
          <>
            <Header infoView={view} errorMsg={errorMsg ?? ''} />
            <div className="flex-col justify-center items-start gap-7 inline-flex">
              <div className="self-stretch text-white text-2xl font-bold leading-7 tracking-tight font-sf_pro_display">
                Note:
              </div>
              <div className="self-stretch text-white text-opacity-60 text-base font-normal leading-tight font-sf_pro_text">
                If you created your passkey BEFORE Aug 21st, 2024, then you created it on a previous
                version of Lit. Please create a new passkey instead.
              </div>
            </div>

            <StickyButtonGroup
              buttons={[
                {
                  label: 'Try again',
                  onClick: () => dispatch(disconnect()),
                  bgColor: 'bg-cyan-200',
                  textColor: 'text-black',
                  disabledColor: 'disabled:bg-disabled-gray disabled:text-white/10',
                },
              ]}
            />
          </>
        )
      case AuthViews.SIGN_UP:
        return (
          <SignUpView
            signIn={authThenGetSessionSigs}
            createNewPasskey={createPKPWithWebAuthn}
            username={username}
            setUsername={(newUsername) => setUsername(newUsername)}
          />
        )
      default:
        return (
          <InitialView
            creatNewPasskey={() => dispatch(setView(AuthViews.SIGN_UP))}
            useExistingPasskey={authThenGetSessionSigs}
          />
        )
    }
  }

  return renderView()
}
