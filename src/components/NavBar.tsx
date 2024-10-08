import { SnowballChain } from '@snowballtools/js-sdk'

import Image from 'next/image'
import React from 'react'

import DropdownMenu from './DropDownMenu'

interface NavBarProps {
  currentChain: SnowballChain
  supportedChains: number[]
  switchChainAction: (chain: SnowballChain) => void
  exitAction: () => void
}

const NavBar = ({ currentChain, supportedChains, switchChainAction, exitAction }: NavBarProps) => (
  <div className="flex">
    <DropdownMenu
      currentChain={currentChain}
      supportedChains={supportedChains}
      switchChainAction={switchChainAction}
    />
    <Image
      src="rectangle_portrait_and_arrow_right.svg"
      alt="exit button"
      className="h-5 w-5 cursor-pointer"
      width={20}
      height={20}
      onClick={exitAction}
    />
  </div>
)

export default NavBar
