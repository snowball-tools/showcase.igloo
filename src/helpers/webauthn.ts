import { LitPasskeyAuth } from '@snowballtools/auth-lit'
import { Snowball, SnowballChain } from '@snowballtools/js-sdk'
import { LinkLitAlchemyLight } from '@snowballtools/link-lit-alchemy-light'

import { useEffect, useState } from 'react'

import {
  SNOWBALL_API_KEY,
  alchemyApiKey_sepolia,
  alchemyGasPolicyId_sepolia,
  litRelayApiKey,
} from './constants'

const snowball = Snowball.withAuth({
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
    apiKey: SNOWBALL_API_KEY,
    initialChain: SnowballChain.sepolia,
    ssrMode: true,
  })

export function useSnowball() {
  const [state, setState] = useState(100) // Value doesn't matter

  useEffect(() => {
    // Subscribe and directly return the unsubscribe function
    return snowball.subscribe(() => setState(state + 1))
  }, [state])

  useEffect(() => {
    snowball.initUserSessions()
  }, [])

  return snowball
}
