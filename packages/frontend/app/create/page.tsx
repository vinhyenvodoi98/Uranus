'use client'
import { useMemo, useState } from "react";
import { isAddress, parseEther } from 'viem';
import NFTImage from "../components/NFTImage";
import { useAccount, useContractReads, useContractWrite } from "wagmi";

import Erc721Abi from '../../../contract-stylus/output/erc721.json';
import AuctionAbi from '../../../contract-stylus/output/auction.json';
import AuctionAddress from '../../../contract-stylus/address.json'

export default function CreatePage() {
  const account = useAccount();
  const [tokenContract, setTokenContract] = useState<string>('');
  const [tokenId, setTokenId] = useState<string>('');
  const [minBid, setMinBid] = useState<string>('');
  const [reserverPrice, setReserverPrice] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('3');

  const expirationOption = ['3', '5', '7']

  const handleInput = (input: string) => {
    if (isAddress(input)) {
      setTokenContract(input);
    }
  };

  // Read token
  const { data: token } = useContractReads({
    contracts: [
      {
        address: tokenContract as `0x${string}`,
        abi: Erc721Abi as any,
        functionName: 'name',
      },
      {
        address: tokenContract as `0x${string}`,
        abi: Erc721Abi as any,
        functionName: 'tokenURI',
        args: [tokenId],
      },
      {
        address: tokenContract as `0x${string}`,
        abi: Erc721Abi as any,
        functionName: 'ownerOf',
        args: [tokenId as any],
      },
      {
        address: tokenContract as `0x${string}`,
        abi: Erc721Abi as any,
        functionName: 'getApproved',
        args: [tokenId as any],
      }
    ],
  });

  const isOwner = useMemo(() => {
    if (
      token &&
      token[2].result &&
      (token[2].result.toString().toLocaleLowerCase() as any) ===
        account.address?.toLocaleLowerCase()
    )
      return true;
    else false;
  }, [token, account]);

  const isApprove = useMemo(() => {
    if (
      token &&
      token[3].result &&
      (token[3].result.toString().toLocaleLowerCase() as any) ===
        AuctionAddress.address?.toLocaleLowerCase()
    )
      return true;
    else false;
  }, [token, AuctionAddress]);

  const isReady = useMemo(() => {
    if (
      isOwner &&
      minBid.length > 0 &&
      reserverPrice.length > 0
    )
      return true;
    else false;
  }, [isOwner, minBid, reserverPrice]);

  const {
    // data: transactionHash,
    // isLoading: isLoading,
    // isSuccess: isSuccess,
    write: triggerApprove
  } = useContractWrite({
    address: tokenContract as `0x${string}`,
    abi: Erc721Abi as any,
    functionName: 'approve',
  });

  const approve = () => {
    triggerApprove({
      args: [
        AuctionAddress.address,
        tokenId,
      ],
    });
  }

  const {
    data: transactionHash,
    isLoading: isLoading,
    isSuccess: isSuccess,
    write: triggerStartAuction
  } = useContractWrite({
    address: AuctionAddress.address as `0x${string}`,
    abi: AuctionAbi as any,
    functionName: 'startAuction',
  });

  const startAuction = () => {
    let today = new Date()
    let endTime = new Date(today.setDate(today.getDate() + Number(expirationDate)))
    triggerStartAuction({
      args: [
        tokenContract,
        tokenId,
        parseEther(minBid),
        parseEther(reserverPrice),
        (today.getTime()-(today.getTime()%1000))/1000,
        (endTime.getTime()-(endTime.getTime()%1000))/1000,
      ],
    });
  }

  return (
    <div className="bg-base-100">
      <div className="mx-8">
        <p className="text-6xl uppercase">Create Bid</p>
        <div className='flex flex-col w-full lg:flex-row'>
          <div className='grid flex-grow h-[450px] rounded-box place-items-center'>
            <div className='form-control w-full'>
              <label className='label'>
                <span className='label-text'>Token Address</span>
              </label>
              <input
                onChange={(e) => handleInput(e.target.value)}
                value={tokenContract}
                type='text'
                placeholder='Type Token Address: 0x...'
                className='input input-bordered w-full rounded-md z-10'
              />
              <label className='label'>
                <span className='label-text'>TokenID</span>
              </label>
              <input
                onChange={(e) => setTokenId(e.target.value.toString())}
                value={tokenId}
                type='number'
                placeholder='Type TokenID: 1'
                className='input input-bordered w-full rounded-md z-10'
              />
              <label className='label'>
                <span className='label-text'>Minium Bid</span>
              </label>
              <input
                onChange={(e) => setMinBid(e.target.value.toString())}
                value={minBid}
                type='number'
                placeholder='Type minium bid: 0.05'
                className='input input-bordered w-full rounded-md z-10'
              />
              <label className='label'>
                <span className='label-text'>Reserve Price</span>
              </label>
              <input
                onChange={(e) => setReserverPrice(e.target.value.toString())}
                value={reserverPrice}
                type='number'
                placeholder='Type Reserve pirce: 0.5'
                className='input input-bordered w-full rounded-md z-10'
              />
              <label className='label'>
                <span className='label-text'>Expiration Date</span>
              </label>
              <div className='dropdown w-full z-50'>
                <div
                  tabIndex={0}
                  className='btn text-left w-full bg-gray-100 hover:bg-gray-200 justify-start'
                >
                  in {expirationDate} days
                </div>
                <ul
                  tabIndex={0}
                  className='dropdown-content z-10 p-2 shadow bg-base-100 rounded-box w-full'
                >
                  {expirationOption.map((v) => (
                    <li
                      key={v}
                      onClick={() => setExpirationDate(v)}
                      className='flex flex-row items-center gap-2 w-full hover:bg-gray-200'
                    >
                      <p className='font-bold'>in {v} days</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className='divider lg:divider-horizontal' />
          <div className='grid flex-grow card rounded-box place-items-center'>
            <div className='w-64 border rounded-2xl p-4'>
              <div className='flex flex-col gap-4'>
                <div className='flex gap-4 items-center'>
                  <div className='flex flex-col gap-1'>
                    {token && token[0].result ? (
                      <>
                        <p className='font-medium'>{token[0].result}</p>
                        <p className='font-medium'>#{tokenId}</p>
                      </>
                    ) : (
                      <>
                        <div className='skeleton h-4 w-28'></div>
                        <div className='skeleton h-4 w-20'></div>
                      </>
                    )}
                  </div>
                </div>
                <NFTImage token={token as any} />
              </div>
            </div>
            {
              isApprove ?
                <button
                  onClick={() => startAuction()}
                  disabled={!(isReady)}
                  className='btn btn-outline rounded-sm text-primary hover:bg-primary-500 text-lg w-60'
                >
                  {isOwner ? isReady ? 'Start Auction' : 'Not full information' : 'Not Owner'}
                </button>
                :
                <button
                  onClick={() => approve()}
                  disabled={!(isOwner)}
                  className='btn btn-outline rounded-sm text-primary hover:bg-primary-500 text-lg w-60'
                >
                  {isOwner ? 'Approve' : 'Not Owner'}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
