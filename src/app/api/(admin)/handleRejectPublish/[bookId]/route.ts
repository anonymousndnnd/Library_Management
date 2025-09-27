import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma=new PrismaClient();
//this route basically handles rejecting publish request sent by the author


export async function PATCH(request:NextRequest,context:any){
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

    const { bookId } = context.params as { bookId: string };

    const rejectedBook = await prisma.books.update({
      where: { id: bookId },
      data: {
        status: "rejected", // only update status
        adminId: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Book has been rejected successfully",
      book: rejectedBook,
    });
  } catch (error) {
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}