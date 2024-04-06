'use client'
import Image from "next/image";
import CountDown from "../components/Countdown";
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { formatEther, parseEther } from 'viem'
import { useContractWrite } from "wagmi";
import AuctionAbi from '../../../contract-stylus/output/auction.json';
import AuctionAddress from '../../../contract-stylus/address.json'
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

export default function AutionDetailNFTImage({ token, endtime, currentPrice, bidderBalance }: any) {
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async (url: string) => {
      try {
        const response = await axios.get(url);

        setTokenInfo(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (token && token[1].result) fetchData(token[1].result as any);
  }, [token]);

  const isEnd = useMemo(() => {
    let today = new Date()
    if (
      endtime &&
      Number(endtime) < (today.getTime()-(today.getTime()%1000))/1000
    )
      return false;
    else return true;
  }, [endtime]);

  return (
    <div className="grid grid-cols-8 gap-4">
      <div className="col-span-3">
        <div className="border-4 border-primary rounded-md gap-2 p-2 min-h-[600px] flex flex-col">
          <div className="h-[40px] w-full flex justify-between">
          <Image src={"/png/ethereum.png"} width={36} height={36} alt="ETH" />
          <div className="flex gap-2">
            <p className="text-2xl">5</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </div>
          </div>
          <div className="flex-auto h-full flex justify-center items-center">
          {token && token[1].result && tokenInfo && tokenInfo.image ? (
            <img
              className='h-96 w-full object-cover'
              src={tokenInfo.image}
              alt='nft image'
            />
          ) : (
            <div className='skeleton h-96 w-full'></div>
          )}
          </div>
        </div>
      </div>
      <div className="col-span-5 p-4 flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="text-5xl">{token[0].result}</p>
          <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Reference</a></li>
              <li><a>Report</a></li>
          </ul>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-3xl">{tokenInfo && tokenInfo.name}</p>
        </div>
        <div className="bg-base-200 p-4">
          <div className="flex justify-between">
          <div className="flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
            <path d="M12 7V12L10.5 14.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Sale ends {endtime && new Date(Number(endtime.toString())*1000).toTimeString()}
          </div>
          {
            endtime
            ?
            <CountDown endTimestamp={Number(endtime.toString())*1000} type='colons' />
            :
            <div className='skeleton h-8 w-28'></div>
          }
          </div>
          <div className="divider"></div>
          <div className="flex flex-col gap-2">
            <p className="text-info-content text-base">Minimum bids</p>
            <p className="text-3xl">{currentPrice && formatEther(currentPrice as any)} ETH</p>
            <div className="flex gap-4 items-end">
            <BidButton />
            </div>
          </div>
        </div>
        <div className="bg-base-200 p-4">
          <p className="text-2xl uppercase">
            Your bids
          </p>
          <div className="divider"></div>
          <div className="flex flex-col gap-2">
            <p className="text-3xl">{bidderBalance && formatEther(bidderBalance as any)} ETH</p>
            <div className="flex gap-4 items-end">
              <WithdrawButton disabled={isEnd}/>
            </div>
          </div>
          {/* <ReferenceLink text="https://layer3.xyz/quests/cubes-on-arbitrum?ref=taio-newgate.eth"/> */}
        </div>
      </div>
    </div>
  );
}

const BidButton = () => {
  const params = useParams<{ id: string }>()
  const [inputBid, setInputBid] = useState(0)

  const {
    data: transactionHash,
    // isLoading: isLoading,
    isSuccess: isSuccess,
    write: triggerBidCall,
  } = useContractWrite({
    address: AuctionAddress.address as `0x${string}`,
    abi: AuctionAbi as any,
    functionName: 'placeBid',
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        `Transaction has been created successfully:
        ${transactionHash?.hash}`
      );
    }
  }, [isSuccess]);

  const handleOpenModal = () => {
    // eslint-disable-next-line
    // @ts-ignore
    document.getElementById('bidButton').showModal()
  }

  const handleExecute = () => {
    triggerBidCall({
      args:[params?.id],
      value: parseEther(inputBid.toString()) as any,
    });
  }

  return(
    <>
      <button className="btn btn-primary w-60" onClick={() => handleOpenModal()}>Place bid</button>
      <dialog id="bidButton" className="modal">
        <div className='modal-box text-black'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>Bid</h3>
          <div className='grid grid-col-3 gap-4'>
            <div className='form-control w-full'>
              <label className='label'>
                <span className='label-text'>To</span>
              </label>
              <input
                onChange={(e) => setInputBid(Number(e.target.value))}
                type='number'
                placeholder='1'
                className='input input-bordered w-full rounded-md z-10'
              />
            </div>
          </div>
          <div className='mt-8 flex flex-row-reverse'>
            <button
              onClick={() => handleExecute()}
              className='btn btn-outline btn-primary rounded-sm text-lg w-32'
            >
              Bid
            </button>
          </div>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

const WithdrawButton = ({disabled}: any) => {
  const params = useParams<{ id: string }>()

  const {
    data: transactionHash,
    // isLoading: isLoading,
    isSuccess: isSuccess,
    write: triggerWithdraw,
  } = useContractWrite({
    address: AuctionAddress.address as `0x${string}`,
    abi: AuctionAbi as any,
    functionName: 'withdraw',
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        `Transaction has been created successfully:
        ${transactionHash?.hash}`
      );
    }
  }, [isSuccess]);

  const handleWithdraw = () => {
    triggerWithdraw({
      args:[params?.id],
    });
  }

  return(
    <>
      <button className="btn btn-primary w-60" disabled={disabled} onClick={() => handleWithdraw()}>Withdraw</button>
    </>
  )
}
