import type { Metadata } from "next";
import LongVideoPromoDetail from "../video-types/long-video-promo/LongVideoPromoDetail";

export const metadata: Metadata = {
  title: "Long Video Promo AI Video Maker — YouTube Teasers & Reels | Itnavideo",
  description: "Turn YouTube videos into vertical teaser trailers with our AI video generator. Features thumbnail overlays and viral CTA styling.",
  alternates: { canonical: "/long-video-promo" },
};

export default function LongVideoPromoAliasPage() {
  return <LongVideoPromoDetail />;
}
