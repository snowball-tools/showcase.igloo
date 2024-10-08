import React from 'react'

import StatusBar from '../components/StatusBar'
import { AuthViews } from '../store/credentialsSlice'

export interface HeaderConstants {
  titleText: string
  subtitleText: string
  step: number
  additionalText?: string
}

function getHeaderConstants(loginView: string, errorMsg?: string): HeaderConstants {
  switch (loginView) {
    case AuthViews.UNSUPPORTED_BROWSER:
      return {
        titleText: 'Browser not supported',
        subtitleText:
          'Unfortunately, your browser does not support platform authenticators. Try visiting this demo on Chrome, Safari, Brave, or Edge. Refer to this table for a more comprehensive list of supported browsers and operating systems.',
        step: 0,
      }
    case AuthViews.REGISTERING:
      return {
        titleText: 'Registering your passkey...',
        subtitleText: "Follow your browser's prompts to create a passkey.",
        step: 2,
      }
    case AuthViews.AUTHENTICATING:
      return {
        titleText: 'Authenticate with your passkey',
        subtitleText:
          "To start using your new cloud wallet, you'll need to authenticate with your newly registered passkey. Follow your browser's prompts to authenticate.",
        step: 0,
      }
    case AuthViews.IGLOO_NFT_MINTING:
      return {
        titleText: 'Minting your Igloo NFT',
        subtitleText: 'Stay with us on this page as your Igloo NFT is being minted on-chain.',
        step: 0,
      }
    case AuthViews.MINTING:
      return {
        titleText: 'Minting your Wallet',
        subtitleText: 'Stay with us on this page as your cloud wallet is being minted on-chain.',
        step: 3,
      }
    case AuthViews.MINTED:
      return {
        titleText: 'Wallet created',
        subtitleText: 'Wallet minted. Log in',
        step: 3,
      }
    case AuthViews.IGLOO_NFT_MINTED:
      return {
        titleText: 'Minting successful',
        subtitleText: 'Added to your smart wallet',
        step: 0,
        additionalText: '🎉',
      }
    case AuthViews.WALLET_HOME:
      return {
        titleText: 'Wallet Home',
        subtitleText: '',
        step: 0,
      }
    case AuthViews.ERROR:
      return {
        titleText: 'Error',
        subtitleText: errorMsg ?? '',
        step: 0,
      }
    case AuthViews.SIGN_UP:
      return {
        titleText: 'Name your passkey',
        subtitleText: 'Give your passkey a unique name.',
        step: 1,
      }
    default:
      return {
        titleText: 'Welcome to Igloo!',
        subtitleText: 'Please sign in to continue',
        step: 0,
      }
  }
}

interface InfoViewProps {
  infoView: string
  errorMsg?: string
}

const Header = ({ infoView, errorMsg }: InfoViewProps) => {
  const { titleText, subtitleText, step, additionalText } = getHeaderConstants(infoView, errorMsg)

  return (
    <>
      <div className="flex flex-col gap-6 items-center w-full">
        <StatusBar step={step} />
        <div className="self-stretch flex flex-col gap-2 items-start w-full">
          <div className="self-stretch text-white text-2xl font-bold tracking-[0.35] leading-[28px] font-sf_pro_display">
            {titleText}&nbsp;&nbsp;{additionalText && additionalText}
          </div>
          <div className="self-stretch text-white text-opacity-60 text-base font-normal leading-tight font-sf_pro_text">
            {subtitleText}
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
