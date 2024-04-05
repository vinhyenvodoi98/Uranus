import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";
import { vercelURL } from "./utils";
import MainPage from "./components/MainPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Uranus",
    description: "Best Auction platform",
    other: {
      ...(await fetchMetadata(
        new URL(
          "/frames",
          vercelURL() || "http://localhost:3000"
        )
      )),
    },
  };
}

// This is a react server component only
export default async function Home() {
  return (
    <div className="">
      <MainPage/>
    </div>
  );
}
