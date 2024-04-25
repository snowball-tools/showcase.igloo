'use client'

import { SnowballChain } from '@snowballtools/js-sdk'

import { Alchemy, NftOrdering, OwnedNftsResponse } from 'alchemy-sdk'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Address, encodeFunctionData } from 'viem'

import Card from '../../components/Card'
import ColumnButton from '../../components/ColumnButton'
import Header from '../../components/Header'
import LoadingAnimation from '../../components/LoadingAnimation'
import NavBar from '../../components/NavBar'
import { IglooNFTABI } from '../../helpers/abis/IglooNFTABI'
import track from '../../helpers/analytics'
import { logErrorMsg, logInfo } from '../../helpers/bugsnag'
import { IGLOO_NFT_ADDRESSES } from '../../helpers/chains'
import { alchemyApiKey_sepolia } from '../../helpers/constants'
import { snowball } from '../../helpers/webauthn'
import {
  AuthViews,
  disconnect,
  setErrorMsg,
  setMintedNFT,
  setView,
  switchChain,
} from '../../store/credentialsSlice'
import { RootState } from '../../store/store'
import MintedIglooNFTView from './MintedIglooNFTView'

export interface WalletViewProps {}

const WalletView = ({}: WalletViewProps) => {
  const { view, currentAppChainId, appChains, ethAddress, nftId, userOpHash } = useSelector(
    (state: RootState) => state.credentials,
  )
  const dispatch = useDispatch()

  const currentAppChain = SnowballChain.byChainId.get(currentAppChainId)!
  const iglooNFTAddress = IGLOO_NFT_ADDRESSES.get(currentAppChain.chainId)

  async function sendUserOp() {
    logInfo('sendUserOp view', 'Sending user operation')
    dispatch(setView(AuthViews.IGLOO_NFT_MINTING))
    try {
      if (!iglooNFTAddress) {
        throw new Error(
          `No IglooNFT address for chain ${currentAppChain.name} (${currentAppChain.chainId})`,
        )
      }

      const smartWallet = await snowball.getSmartWallet('passkey')
      const address = await smartWallet.getAddress()
      const result = await smartWallet.sendUserOp({
        target: iglooNFTAddress,
        data: encodeFunctionData({
          abi: IglooNFTABI.abi,
          functionName: 'safeMint',
          args: [address],
        }),
      })

      console.log('Waiting for user operation transaction')
      await smartWallet.waitForUserOperationTransaction({ hash: result.hash })

      console.log('Fetching NFTs')
      const alchemy = new Alchemy({
        apiKey: alchemyApiKey_sepolia,
        network: currentAppChain.toAlchemyNetwork(),
      })

      // theres a better more accurate way to do this...
      let mintedNFTs: OwnedNftsResponse = await alchemy.nft.getNftsForOwner(address, {
        contractAddresses: [iglooNFTAddress],
        orderBy: NftOrdering.TRANSFERTIME,
      })

      if (mintedNFTs === undefined || mintedNFTs.ownedNfts.length === 0) {
        return {
          hash: result.hash,
          nftId: null,
        }
      }

      let nft = mintedNFTs.ownedNfts.reduce((curr, next) => {
        return Number(curr.tokenId) > Number(next.tokenId) ? curr : next
      })

      dispatch(
        setMintedNFT({
          hash: result.hash,
          nftId: nft.tokenId,
        }),
      )

      return result
    } catch (error) {
      console.error(error)
      logErrorMsg(`Error sending user operation ${error}`)
      dispatch(setErrorMsg('Error sending user operation'))
    }
  }

  function changeChain(newChain: SnowballChain) {
    snowball.switchChain(newChain)
    dispatch(switchChain(newChain))
  }

  if (view === AuthViews.IGLOO_NFT_MINTED) {
    track('IGLOO_NFT_MINTED')
    return (
      <MintedIglooNFTView
        nftLabel={nftId ? `IglooNFT #${nftId}` : 'IglooNFT'}
        chain={currentAppChain}
        primaryActionAfterMint={() =>
          window.open(
            nftId
              ? `https://testnets.opensea.io/assets/${currentAppChain.name.toLowerCase()}/${iglooNFTAddress}/${nftId}`
              : `https://www.jiffyscan.xyz/userOpHash/${userOpHash}?network=${currentAppChain.name.toLowerCase()}`,
            '_blank',
          )
        }
        returnToWalletAction={() => dispatch(setView(AuthViews.WALLET_HOME))}
      />
    )
  } else if (view === AuthViews.IGLOO_NFT_MINTING) {
    track('Igloo NFT Minting')
    return (
      <>
        <Header infoView={view} />
        <LoadingAnimation animationDuration={view === AuthViews.IGLOO_NFT_MINTING ? 7 : 2.5} />
      </>
    )
  } else {
    track('Wallet View')
  }

  return (
    <div className="flex flex-col gap-2">
      <NavBar
        exitAction={() => dispatch(disconnect())}
        currentChain={currentAppChain}
        supportedChains={appChains}
        switchChainAction={(newChain) => changeChain(newChain)}
      />
      <div className="border-solid border-white/10 h-px shrink-0 mb-3 ml-px border-t border-b-0 border-x-0" />
      <div className="text-2xl font-sf_pro_display font-bold tracking-[0.35] leading-[26px] text-white self-start ml-px">
        Welcome to your smart wallet
      </div>
      <div className="font-sf_pro_text tracking-[-0.24] leading-[20px] text-white/60 self-center mb-3 w-full">
        We&apos;re talking ERC-4337. No more passwords, no more seed phrases, no more extensions.
      </div>
      <Card color="bg-[#9ee7ff]" textColor="text-black" borderColor={undefined}>
        <div className="flex flex-col gap-1 items-start">
          <div className="text-xl font-sf_pro_display font-bold leading-[40px] text-black">
            Your Eth Smart Wallet
          </div>
          <div className="text-sm font-sf_mono font-medium leading-[20px] w-full break-all text-black">
            {ethAddress}
          </div>
        </div>
        <div className="flex flex-row mr-1 gap-2 items-start">
          <ColumnButton
            text="Copy address"
            color="bg-[#00d4ff]"
            textColor="text-black"
            onClick={() => navigator.clipboard.writeText(ethAddress ?? '')}
          />
          <ColumnButton
            text="View on Etherscan"
            color="bg-[#00d4ff]"
            textColor="text-black"
            onClick={() =>
              window.open(`${currentAppChain.blockExplorerUrls[0]}/address/${ethAddress}`, '_blank')
            }
          />
        </div>
      </Card>
      <Card
        color="bg-clear"
        textColor="text-white"
        borderColor="border border-white/32 border-solid"
      >
        <div className="font-sf_pro_text font-bold tracking-[-0.41] leading-[24px] text-white self-start">
          What is a <a href="https://eips.ethereum.org/EIPS/eip-4337">ERC-4337</a> wallet?
        </div>
        <div className="font-sf_pro_text tracking-[-0.41] leading-[24px] text-white w-full">
          Smart contract wallets - AKA Account Abstraction{' '}
          <a className="text-cyan-200" href="https://eips.ethereum.org/EIPS/eip-4337">
            ERC-4337
          </a>{' '}
          - is changing the landscape of crypto UX forever enabling gas sponsored transactions,
          bundling, intents, social recovery, scheduling “transactions” (user operations), limit
          orders, and so much more.{' '}
          <a className="text-cyan-200" href="https://www.alchemy.com/blog/account-abstraction">
            Learn more
          </a>
        </div>
      </Card>
      <Card
        color="bg-clear"
        textColor="text-white"
        borderColor="border border-white/30 border-solid"
      >
        <div className="flex-col justify-start items-start gap-1 inline-flex">
          <div className="self-stretch text-white text-baseleading-normal font-sf_pro_text font-bold">
            Take your smart wallet for a spin
          </div>
          <div className="self-stretch grow shrink basis-0 justify-start items-center gap-3 inline-flex">
            <div className="font-sf_pro_text grow shrink basis-0 text-white text-base font-normal leading-normal">
              Mint a free Igloo NFT. We&apos;ll cover the gas.
            </div>
            <button
              className="px-4 py-2 bg-cyan-200 rounded-3xl justify-center items-center gap-1 flex"
              onClick={sendUserOp}
            >
              <div className="text-black text-xs font-semibold leading-normal font-sf_pro_text">
                Mint NFT
              </div>
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default WalletView
