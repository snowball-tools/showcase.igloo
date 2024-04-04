import { SnowballChain } from '@snowballtools/js-sdk'
import { Address } from '@snowballtools/types'

export const IGLOO_NFT_ADDRESSES = new Map<number, Address>([
  [SnowballChain.ethereum.chainId, '0x799e75059126E6DA27A164d1315b1963Fb82c44F'],
  [SnowballChain.goerli.chainId, '0x799e75059126E6DA27A164d1315b1963Fb82c44F'],
  [SnowballChain.sepolia.chainId, '0x98AdA10fC1EAf5d21DB0f91d09fAa6165e427106'],
  [SnowballChain.mantle.chainId, '0x98AdA10fC1EAf5d21DB0f91d09fAa6165e427106'],
  [SnowballChain.mantle_testnet.chainId, '0x98AdA10fC1EAf5d21DB0f91d09fAa6165e427106'],
  [SnowballChain.polygon.chainId, '0x98AdA10fC1EAf5d21DB0f91d09fAa6165e427106'],
  [SnowballChain.mumbai.chainId, '0x98AdA10fC1EAf5d21DB0f91d09fAa6165e427106'],
  [SnowballChain.arbitrum.chainId, '0x98AdA10fC1EAf5d21DB0f91d09fAa6165e427106'],
  [SnowballChain.optimism.chainId, '0x98AdA10fC1EAf5d21DB0f91d09fAa6165e427106'],
  [SnowballChain.celo.chainId, '0x98AdA10fC1EAf5d21DB0f91d09fAa6165e427106'],
])

export function getChainIcon(chain: SnowballChain): string {
  switch (chain.chainId) {
    case SnowballChain.polygon.chainId:
    case SnowballChain.mumbai.chainId:
      return 'polygon.svg'
    case SnowballChain.mantle.chainId:
    case SnowballChain.mantle_testnet.chainId:
      return 'mantle_black.svg'
    case SnowballChain.arbitrum.chainId:
      return 'arbitrum.svg'
    case SnowballChain.optimism.chainId:
      return 'optimism.svg'
    case SnowballChain.celo.chainId:
      return 'celo.svg'
    default:
      return 'ethereum.svg'
  }
}
