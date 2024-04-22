import { LitPasskeyAuth } from '@snowballtools/auth-lit'
import { Snowball, SnowballChain } from '@snowballtools/js-sdk'
import { LinkLitAlchemyLight } from '@snowballtools/link-lit-alchemy-light'

import { alchemyApiKey_sepolia, alchemyGasPolicyId_sepolia, litRelayApiKey } from './constants'

export const snowball = Snowball.withAuth({
  passkey: LitPasskeyAuth.configure({ litRelayApiKey }),
})
  .withSmartWallet(
    LinkLitAlchemyLight.pkpEthersWallet.configure({
      alchemyApiKeys: {
        [SnowballChain.sepolia.chainId]: {
          apiKey: alchemyApiKey_sepolia,
          gasPolicyId: alchemyGasPolicyId_sepolia,
        },
      },
    }),
  )
  .create({
    initialChain: SnowballChain.sepolia,
  })
