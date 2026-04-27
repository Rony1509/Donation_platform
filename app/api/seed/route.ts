import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/server/models/User";
import MonetaryDonation from "@/server/models/MonetaryDonation";
import PhysicalDonation from "@/server/models/PhysicalDonation";
import Task from "@/server/models/Task";
import Notification from "@/server/models/Notification";
import Feedback from "@/server/models/Feedback";

export async function POST() {
  console.log("SEED: URI:", process.env.MONGODB_URI);
  try {
    console.log("SEED: connecting to DB...");
    await connectDB();
    console.log("SEED: connected!");

    await Promise.all([
      User.deleteMany({}),
      MonetaryDonation.deleteMany({}),
      PhysicalDonation.deleteMany({}),
      Task.deleteMany({}),
      Notification.deleteMany({}),
      Feedback.deleteMany({}),
    ]);

    const admin = await User.create({
      name: "System Admin",
      email: "bsse1504@iit.du.ac.bd",
      phone: "01700000000",
      role: "admin",
      password: "morshaline123",
    });

    await Notification.create({
      userId: admin._id,
      message: "Welcome to DonateChain! You can now register new donors and volunteers.",
    });

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      credentials: {
        admin: "bsse1504@iit.du.ac.bd / morshaline123",
      },
    });
  } catch (err: unknown) {
    console.error("SEED FULL ERROR:", err);
    const message = err instanceof Error ? err.message : String(err);
    console.error("SEED ERROR MESSAGE:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}