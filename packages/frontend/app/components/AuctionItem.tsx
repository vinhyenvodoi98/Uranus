import Link from "next/link";
import CountDown from "./Countdown";
import Erc721Abi from '../../../contract-stylus/output/erc721.json';
import AuctionAbi from '../../../contract-stylus/output/auction.json';
import AuctionAddress from '../../../contract-stylus/address.json'
import { useContractReads } from "wagmi";
import { useEffect } from "react";
import { formatEther } from 'viem'
import NFTImage from "./NFTImage";

export default function AuctionItem({id}: {id:string}) {
  const { data: auctionInfo, refetch } = useContractReads({
    contracts: [
      {
        address: AuctionAddress.address as `0x${string}`,
        abi: AuctionAbi as any,
        functionName: 'getEndtimeAuction',
        args: [id],
      },
      {
        address: AuctionAddress.address as `0x${string}`,
        abi: AuctionAbi as any,
        functionName: 'getTokenIdOfAuction',
        args: [id],
      },
      {
        address: AuctionAddress.address as `0x${string}`,
        abi: AuctionAbi as any,
        functionName: 'getContractOfAuction',
        args: [id],
      },
      {
        address: AuctionAddress.address as `0x${string}`,
        abi: AuctionAbi as any,
        functionName: 'getCurrentPrice',
        args: [id],
      },
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

  return(
    <Link href={`/auction/${id}`} className="w-full">
      <div className="border-solid border-4 rounded-md border-primary p-2 flex flex-col items-center gap-4 cursor-pointer">
        {
          auctionInfo && auctionInfo[0].result
          ?
          <CountDown endTimestamp={Number(auctionInfo[0].result.toString())*1000} type='colons' />
          :
          <div className='skeleton h-8 w-28'></div>
        }
        {
          auctionInfo && auctionInfo[1].result &&  auctionInfo[2].result ?
            <NFTInfo tokenContract={auctionInfo[2].result} tokenId={auctionInfo[1].result}/>
            :
            <div className="flex flex-col h-48 gap-3 w-full px-2">
              <div className='skeleton h-32 w-full'></div>
              <div className='skeleton h-4 w-28'></div>
              <div className='skeleton h-4 w-20'></div>
            </div>

        }
        <div className="flex flex-col gap-2 w-full">
          <p className="text-3xl">{auctionInfo && auctionInfo[3].result ? formatEther(auctionInfo[3].result as any) : "Loading.."} ETH</p>
        </div>
      </div>
    </Link>
  )
}

const NFTInfo = ({tokenContract, tokenId}: any) => {
  const { data: token, refetch } = useContractReads({
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
    ],
  });

  return (
    <div className="w-full flex flex-col h-60 gap-3">
      <NFTImage token={token} />
      {
        token && token[0].result
        ?
        <p className="text-2xl">{token[0].result}</p>
        :
        <div className='skeleton h-4 w-28'></div>
      }
    </div>
  )
}
