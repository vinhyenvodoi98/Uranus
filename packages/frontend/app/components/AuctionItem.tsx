import Link from "next/link";
import CountDown from "./Countdown";

export default function AuctionItem({id}: {id:string}) {
  return(
    <Link href={`/auction/${id}`}>
      <div className="border-solid border-4 rounded-md border-primary p-2 flex flex-col items-center gap-4 cursor-pointer">
        <CountDown endTimestamp={1712811702000} type='colons' />
        <img src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" />
        <div className="flex flex-col gap-2 w-full">
          <p className="text-2xl">Shoes</p>
          <p className="text-3xl">0.4 ETH</p>
        </div>
      </div>
    </Link>
  )
}