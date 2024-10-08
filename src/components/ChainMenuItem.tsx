import { SnowballChain } from '@snowballtools/js-sdk'

import Image from 'next/image'
import React from 'react'

import { getChainIcon } from '../helpers/chains'

interface ChainMenuItemProps {
  chain: SnowballChain
  testnet: boolean
}

const ChainMenuItem = ({ chain, testnet = false }: ChainMenuItemProps) => (
  <div className="flex flex-row gap-2 w-full items-center rounded-[41px]">
    <Image
      src={getChainIcon(chain)}
      alt={`${chain.name} logo`}
      className="h-5 w-5"
      width={20}
      height={20}
    />
    <span className="flex font-sf_pro_text font-semibold w-full">
      {chain.name} {testnet ? 'Testnet' : ''}
    </span>
  </div>
)

export default ChainMenuItem
