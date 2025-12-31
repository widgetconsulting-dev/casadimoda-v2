import db from "@/utils/db";
import GiftCardModel from "@/models/GiftCard";
import GiftCardsList from "./GiftCardsList";
import { GiftCard } from "@/types";

export default async function AdminGiftCardsPage() {
  await db.connect();
  const giftCards = await GiftCardModel.find({}).lean();

  const serializedGiftCards: GiftCard[] = giftCards.map(
    (doc: Omit<GiftCard, "_id"> & { _id: { toString: () => string } }) => {
      return db.convertDocToObj(doc) as unknown as GiftCard;
    }
  );

  return <GiftCardsList initialGiftCards={serializedGiftCards} />;
}
