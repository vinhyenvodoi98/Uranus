
import Link from "next/link";
import Wallet from "./Wallet";
import Image from "next/image";

export default function Header() {
  return (
    <header className='sticky top-0 z-50 bg-base-100'>
      <div className='layout flex items-center justify-between'>
        <div className="navbar bg-base-300 m-4">
          <div className="flex-1">
            <Link href={"/"} className="btn btn-ghost text-xl">
              <Image src={"/uranus-logo.webp"} width={36} height={36} alt="logo" style={{borderRadius: "5px"}}/>
              Uranus
            </Link>
            <label className="input input-bordered flex items-center gap-2">
              <input type="text" className="grow" placeholder="Search" />
              <kbd className="kbd kbd-sm">⌘</kbd>
              <kbd className="kbd kbd-sm">K</kbd>
            </label>
            <Link href={"/create"} className="btn btn-ghost text-xl">Create</Link>
            <Link href={"/explore"} className="btn btn-ghost text-xl">Explore</Link>
          </div>
          <div className="flex-none gap-2">
            <Wallet />
          </div>
        </div>
      </div>
    </header>
  );
}