/* eslint-disable react/jsx-key */
import { Button, createFrames } from "frames.js/next";
import { baseSepolia } from "viem/chains";
// import contractAddress from '../../../contracts/contract-address.json'
// import contractAbi from '../../../contracts/artifacts/contracts/Board.sol/Board.json'
import {
  createPublicClient,
  http,
} from "viem";

const frames = createFrames({
  basePath: "/frames",
});

const handleRequest = frames(async (ctx:any) => {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });
  // const board = await publicClient.readContract({
  //   address: contractAddress["84532"].address as `0x${string}`,
  //   abi: contractAbi.abi,
  //   functionName: 'getBoard',
  // })  as string[][];

  return {
    version: "vNext",
    image: (
      <div tw="w-full h-full bg-slate-200 text-white justify-center items-center flex flex-col">
        <p tw="text-slate-900 text-center">This is a 20x20 table</p>
        <p tw="text-slate-900 text-center">Please enter [0-19] [0-19] into the input and select the color</p>
      </div>
    ),
    imageOptions: {
      aspectRatio: "1:1",
    },
    buttons: [
      <Button action="tx" target="/txdata">🟥</Button>,
      <Button action="tx" target="/txdata">🟦</Button>,
      <Button action="tx" target="/txdata">🟨</Button>,
      <Button action="post">Refresh</Button>
    ],
    textInput: "Put Coordinates example : 15-15",
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
