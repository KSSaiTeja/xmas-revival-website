/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateSheet } from "@/lib/googleSheets";
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
    const body = await request.json();
    const entryId = body?.entryId;
    const selectedDiscount = body?.selectedDiscount;

    if (!entryId) {
      console.error("Missing entryId in request body");
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 },
      );
    }

    const entry = await prisma.christmasEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      console.error(`Entry not found for id: ${entryId}`);
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    // If gift already exists, return it
    if (entry.gift) {
      return NextResponse.json({ gift: entry.gift });
    }

    // Determine the final offer
    const shouldOffer2Lakh = await calculateProbability();
    let finalDiscount = selectedDiscount || "1 Lakh"; // Fallback to "1 Lakh" if selectedDiscount is undefined

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

    if (!updatedEntry || !updatedEntry.gift) {
      console.error("Failed to update entry or gift is undefined");
      return NextResponse.json(
        { error: "Failed to update entry" },
        { status: 500 },
      );
    }

    return NextResponse.json({ gift: updatedEntry.gift });
  } catch (error) {
    console.error("Error selecting gift:", error);
    return NextResponse.json(
      { error: "An error occurred while selecting the gift" },
      { status: 500 },
    );
  }
}
