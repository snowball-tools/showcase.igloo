import { SnowballChain } from '@snowballtools/utils'

import { AuthMethod, SessionSigsMap } from '@lit-protocol/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Address } from 'viem'

const DEFAULT_CHAIN = SnowballChain.sepolia

export const AuthViews = {
  INITIAL_VIEW: 'initial_view',
  SIGN_UP: 'sign_up',
  SIGN_IN: 'sign_in',
  REGISTERING: 'registering',
  AUTHENTICATING: 'authenticating',
  MINTING: 'minting',
  MINTED: 'minted',
  WALLET_HOME: 'wallet_home',
  ERROR: 'error',
  IGLOO_NFT_MINTING: 'igloo_nft_minting',
  IGLOO_NFT_MINTED: 'igloo_nft_minted',
  UNSUPPORTED_BROWSER: 'unsupported_browser',
}

export interface CredentialState {
  view: string
  isAuthenticated: boolean
  username: string
  currentPKP: string | undefined
  currentPKPEthAddress: string | undefined
  currentAuthMethod: AuthMethod | undefined
  sessionSigs: SessionSigsMap
  sessionExpiration: string | null
  currentAppChainId: number
  appChains: number[]
  errorMsg: string | null
  userOpHash: string | null
  ethAddress: string | null
  nftId: string | null
}

export const initialState: CredentialState = {
  view: AuthViews.INITIAL_VIEW,
  isAuthenticated: false,
  username: '',
  currentPKP: undefined,
  currentPKPEthAddress: undefined,
  currentAuthMethod: undefined,
  sessionSigs: {},
  sessionExpiration: null,
  currentAppChainId: DEFAULT_CHAIN.chainId,
  appChains: [...SnowballChain.byChainId.keys()],
  errorMsg: null,
  userOpHash: null,
  ethAddress: null,
  nftId: null,
}

const credentialsSlice = createSlice({
  name: 'credentials',
  initialState,
  reducers: {
    authenticated: (state, action: PayloadAction<Address>) => {
      state.ethAddress = action.payload
      state.isAuthenticated = true
      state.view = AuthViews.WALLET_HOME
    },
    disconnect: () => initialState,
    switchChain: (state, action: PayloadAction<SnowballChain>) => {
      state.currentAppChainId = action.payload.chainId
    },
    setView: (state, action: PayloadAction<string>) => {
      state.view = action.payload
    },
    setMintedNFT: (
      state,
      action: PayloadAction<{
        hash: string
        nftId: string | null
      }>,
    ) => {
      state.userOpHash = action.payload.hash
      state.nftId = action.payload.nftId
      state.view = AuthViews.IGLOO_NFT_MINTED
    },
    setErrorMsg: (state, action: PayloadAction<string>) => {
      state.errorMsg = action.payload
      state.view = AuthViews.ERROR
    },
  },
})

export const { authenticated, disconnect, switchChain, setView, setMintedNFT, setErrorMsg } =
  credentialsSlice.actions

export default credentialsSlice.reducer
