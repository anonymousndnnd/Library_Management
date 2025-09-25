import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient();


export async function GET(request:Request){
  try {
    const session=await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Session Expired" }, { status: 401 });
    }
    const admin=await prisma.admin.findFirst();
    if(!admin){
      return NextResponse.json({ success: false, message: "Admin is unauthorized" }, { status: 401 });
    }
    if(session.user._id!==admin.id){
      return NextResponse.json({ success: false, message: "Duplicate admin" }, { status: 401 });
    }

    const authorCount = await prisma.author.count({
      where: { adminId: admin.id },
    });

    return NextResponse.json({
      success: true,
      authorCount,
    });

  } catch (error) {
      console.error(error);
      return Response.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}