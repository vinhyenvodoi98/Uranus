'use client'
import Erc721Abi from '../../../contract-stylus/output/erc721.json';

import { useContractReads } from "wagmi";
import AutionDetailNFTImage from "./AuctionDetailNFTImage";

export default function AuctionDetail({endtime, currentPrice, bidderBalance, tokenContract, tokenId}: any) {
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
    ],
  });

  return (
    <div>
      {token &&
        <AutionDetailNFTImage
          token={token}
          endtime={endtime}
          currentPrice={currentPrice}
          bidderBalance={bidderBalance}
        />
      }
    </div>
  )
}