import GiftCardsList from "./GiftCardsList";
import { GiftCard } from "@/types";
import { getBaseUrl } from "@/utils";

export default async function AdminGiftCardsPage() {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/admin/giftcards`, { cache: 'no-store' });
  const giftCards: GiftCard[] = await res.json();

  return <GiftCardsList initialGiftCards={giftCards} />;
}
