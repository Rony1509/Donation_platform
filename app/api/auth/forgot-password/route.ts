import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/server/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, role } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const query: Record<string, string> = { email };
    if (role) query.role = role;

    const user = await User.findOne(query).lean();
    if (!user) {
      return NextResponse.json(
        { error: role ? `No ${role} account found with this email address.` : "No account found with this email address." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email verified. You can now reset your password.",
      userId: (user as any)._id.toString(),
      userName: (user as any).name,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}