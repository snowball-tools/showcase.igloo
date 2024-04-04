import { LitPasskeyAuth } from '@snowballtools/auth-lit'
import { Snowball, SnowballChain } from '@snowballtools/js-sdk'
import { LinkLitAlchemyLight } from '@snowballtools/link-lit-alchemy-light'

// prettier-ignore

export const snowball = Snowball
  .withAuth(
    LitPasskeyAuth.configure({
      litReplayApiKey: process.env.NEXT_PUBLIC_LIT_RELAY_API_KEY!
    }),
  )
  .withSmartWallet(
    LinkLitAlchemyLight.pkpEthersWallet.configure({
      alchemyApiKeys: {
        [SnowballChain.sepolia.chainId]: {
          apiKey: process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_API_KEY!,
          gasPolicyId: process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_GAS_POLICY_ID,
        },
      },
    }),
  )
  .create({
    initialChain: SnowballChain.sepolia,
  })
