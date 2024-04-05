'use client'

import { useParams } from 'next/navigation'
import { useEffect } from "react";
import { useContractReads } from "wagmi";
import { useAccount } from "wagmi";

import AuctionAbi from '../../../../contract-stylus/output/auction.json';
import AuctionAddress from '../../../../contract-stylus/address.json'
import AuctionDetail from "../AuctionDetail";

export default function Auction() {
  const params = useParams<{ id: string }>()

  const account = useAccount();
  // Read token
  const { data: auctionInfo, refetch } = useContractReads({
    contracts: [
      {
        address: AuctionAddress.address as `0x${string}`,
        abi: AuctionAbi as any,
        functionName: 'getEndtimeAuction',
        args: [params?.id],
      },
      {
        address: AuctionAddress.address as `0x${string}`,
        abi: AuctionAbi as any,
        functionName: 'getTokenIdOfAuction',
        args: [params?.id],
      },
      {
        address: AuctionAddress.address as `0x${string}`,
        abi: AuctionAbi as any,
        functionName: 'getContractOfAuction',
        args: [params?.id],
      },
      {
        address: AuctionAddress.address as `0x${string}`,
        abi: AuctionAbi as any,
        functionName: 'getCurrentPrice',
        args: [params?.id],
      },
      {
        address: AuctionAddress.address as `0x${string}`,
        abi: AuctionAbi as any,
        functionName: 'bidderBalance',
        args: [params?.id, account.address?.toLocaleLowerCase()],
      }
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-base-100">
      <div className="mx-4">
        {auctionInfo &&
          <AuctionDetail
            endtime={auctionInfo[0].result}
            tokenId={auctionInfo[1].result}
            tokenContract={auctionInfo[2].result}
            currentPrice={auctionInfo[3].result}
            bidderBalance={auctionInfo[4].result}
          />
        }
      </div>
    </div>
  )
}