import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { appendToSheet } from "@/lib/googleSheets";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.name || !body?.email || !body?.phone) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 },
      );
    }

    const { name, email, phone } = body;

    // Check for existing entries first
    const existingEntry = await prisma.christmasEntry.findFirst({
      where: {
        OR: [{ email: email }, { phone: phone }],
      },
      select: { id: true }, // Only select the id field for faster query
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "You've already played" },
        { status: 400 },
      );
    }

    // If no existing entry, proceed with transaction
    const result = await prisma.$transaction(async (tx) => {
      const newEntry = await tx.christmasEntry.create({
        data: {
          name,
          email,
          phone,
        },
      });

      // Perform Google Sheets update asynchronously
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      const formattedTime = currentDate.toTimeString().split(" ")[0];

      appendToSheet([
        [name, phone, email, "Not selected yet", formattedTime, formattedDate],
      ]).catch((error) =>
        console.error("Error updating Google Sheets:", error),
      );

      return newEntry;
    });

    return NextResponse.json({
      message: "Form submitted successfully",
      entryId: result.id,
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "You've already played" },
          { status: 400 },
        );
      }
    }
    return NextResponse.json(
      { error: "An error occurred while submitting the form" },
      { status: 500 },
    );
  }
}
