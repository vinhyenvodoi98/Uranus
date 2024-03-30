'use client'
import Board from './Board';
import { useMemo, useRef, useState, useEffect } from "react";
import Palette from './Palette';
import Header from './Header';
import Providers from './Provider';
import { useContractRead, usePrepareContractWrite, useAccount, useContractWrite } from 'wagmi';

import contractAddress from '../../../contracts/contract-address.json'
import contractAbi from '../../../contracts/artifacts/contracts/Board.sol/Board.json'
import { colorOptions } from '../config/color';
import Wallet from './Wallet';

export default function MainPage() {
  return(
    <Providers>
      <Header />
    </Providers>
  )
}

const Body = () => {

}
