'use client'
import Board from './Board';
import { useMemo, useRef, useState, useEffect } from "react";
import Palette from './Palette';
import Header from './Header';
import Providers from './Provider';
import { useContractRead, usePrepareContractWrite, useAccount, useContractWrite } from 'wagmi';
import CountDown from './Countdown';
import Image from 'next/image';
import Link from 'next/link';

// import contractAddress from '../../../contracts/contract-address.json'
// import contractAbi from '../../../contracts/artifacts/contracts/Board.sol/Board.json'
// import { colorOptions } from '../config/color';
// import Wallet from './Wallet';

export default function PageBoard() {
  return(
    <Body />
  )
}

const Body = () => {
  return <div
    className='relative bg-base-100 flex flex-col gap-4 justify-center items-center'
  >
    <div className='min-h-[600px] mx-8 grid grid-cols-5 gap-4 place-items-center'>
      <div className='col-span-3 flex flex-col gap-8'>
        <p className='text-6xl uppercase'>
          discover, Collect and Auction Amazing NFT
        </p>
        <p className='text-3xl uppercase'>
          Start your own auction
        </p>
        <Link href={"/explore"}>
          <button className="btn btn-outline btn-primary">{`Discover Auctions ->`}</button>
        </Link>
      </div>
      <div className='col-span-2'>
        <div className='w-[500px] flex flex-col gap-4 rounded-lg border-solid border-8 border-primary p-8'>
          <CountDown endTimestamp={1712811702000} type='' />
          <img src="https://i.seadn.io/s/raw/files/05a900040633a89c5b1396155cad3b8b.png?auto=format&dpr=1&w=3840" alt="Shoes" />
          <div className='bg-base-300 p-6 flex flex-col gap-4'>
          <div className='flex justify-between'>
            <div className="avatar flex items-center">
              <div className="w-10 h-10 rounded-full">
                <img src="https://i.seadn.io/gae/TGcrkMtoIFqeoabMH6ucTzhnpXkYBr0o5NLcefuSynflkTHy97wqQ8mv2xlsJd98gRBy5vnRo2n7bUFGdYABrI19qRofDkZRb4hN9yI?auto=format&dpr=1&w=1000" />
              </div>
              <p className='font-bold text-2xl pl-2'>taio-newgate.eth</p>
            </div>
            <div>
              <div className='flex gap-2 items-center'>
                <Image
                  style={{ borderRadius: '50%' }}
                  src='/png/ethereum.png'
                  height={32}
                  width={32}
                  alt='raise token'
                />
                <h1 className='font-bold text-2xl'>0.3 ETH</h1>
              </div>
            </div>
          </div>
          <div>
            <p>Moonbirds is the art collector’s PFP. Each of the 10,000 digital artworks...</p>
          </div>
          <p className='font-primary font-bold cursor-pointer'>More Details</p>
        </div>
        </div>
      </div>
    </div>
  </div>
}
