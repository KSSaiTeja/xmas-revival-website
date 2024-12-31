import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateSheet } from "@/lib/googleSheets";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { offers } from "@/config/offers";

const calculateProbability = async () => {
  const [totalEntries, entriesWith2Lakh] = await Promise.all([
    prisma.christmasEntry.count(),
    prisma.christmasEntry.count({ where: { gift: "₹2 Lakh" } }),
  ]);
  return entriesWith2Lakh / totalEntries < 0.5;
};

export async function POST(request: Request) {
  try {
    const { entryId, selectedDiscount } = await request.json();

    if (!entryId) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 },
      );
    }

    const entry = await prisma.christmasEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    // If gift already exists, return it
    if (entry.gift) {
      return NextResponse.json({ gift: entry.gift });
    }

    // Determine the final offer
    const shouldOffer2Lakh = await calculateProbability();
    let finalDiscount = selectedDiscount;

    if (shouldOffer2Lakh && Math.random() < 0.5) {
      finalDiscount = "2 Lakh";
    }

    const gift = `₹${finalDiscount}`;

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toTimeString().split(" ")[0];

    // Update both database and sheets with the final offer
    const [updatedEntry] = await Promise.all([
      prisma.christmasEntry.update({
        where: { id: entryId },
        data: { gift },
      }),
      updateSheet(entry.email, {
        offer: gift,
        time: formattedTime,
        date: formattedDate,
      }),
    ]);

    return NextResponse.json({
      gift: updatedEntry.gift || `₹${selectedDiscount}`,
    });
  } catch (error) {
    console.error("Error selecting gift:", error);
    return NextResponse.json(
      { error: "An error occurred while selecting the gift" },
      { status: 500 },
    );
  }
}
