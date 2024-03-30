// import { STORAGE_REGISTRY_ADDRESS } from "@farcaster/core";
// import { TransactionTargetResponse } from "frames.js";
// import { getFrameMessage } from "frames.js/next/server";
// import { NextRequest, NextResponse } from "next/server";
// import {
//   Abi,
//   encodeFunctionData,
// } from "viem";

// import contractAddress from '../../../../contracts/contract-address.json'
// import contractAbi from '../../../../contracts/artifacts/contracts/Board.sol/Board.json'
// import { colorOptions } from "../../config/color";

// export async function POST(
//   req: NextRequest
// ): Promise<NextResponse<TransactionTargetResponse>> {
//   const json = await req.json();

//   const frameMessage = await getFrameMessage(json);

//   if (!frameMessage) {
//     throw new Error("No frame message");
//   }

//   let x, y, color;

//   if(frameMessage.buttonIndex === 0) {
//     color = colorOptions.red
//   } else if (frameMessage.buttonIndex === 1) {
//     color = colorOptions.blue
//   } else if (frameMessage.buttonIndex === 2){
//     color = colorOptions.yellow
//   } else {
//     throw new Error("No color selected");
//   }

//   if(!!frameMessage.inputText && frameMessage.inputText !== "") {
//     const parts = frameMessage.inputText.split('-');
//     if (parts.length !== 2) {
//       throw new Error("Wrong format");
//     }
//     if(Number(x) > 19 || Number(y) > 19){
//       throw new Error("Out of range");
//     }
//     [x, y] = parts
//   } else {
//     throw new Error("No coordinates input");
//   }

//   const calldata = encodeFunctionData({
//     abi: contractAbi.abi,
//     functionName: "place",
//     args: [{x,y,color}],
//   });

//   return NextResponse.json({
//     chainId: "eip155:84532",
//     method: "eth_sendTransaction",
//     params: {
//       abi: contractAbi.abi as Abi,
//       to: contractAddress["84532"].address as `0x${string}`,
//       data: calldata as any,
//       value: "0"
//     },
//   });
// }
