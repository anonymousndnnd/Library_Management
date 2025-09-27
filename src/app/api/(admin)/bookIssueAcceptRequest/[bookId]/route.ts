import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma=new PrismaClient();

export async function POST(request:NextRequest , { params }: { params: { bookId: string }}){
  try {
    const session=await getServerSession(authOptions);
    if(!session){
      return NextResponse.json({ success: false, message: "Session Expired" }, { status: 401 });
    }
    const admin=await prisma.admin.findUnique({
      where:{
        id:session.user._id
      }
    })
    if(!admin){
      return NextResponse.json({ success: false, message: "Admin Not Found" }, { status: 401 });
    }
    const {bookId}=params;
    const bookRequest = await prisma.bookissuerequest.findUnique({
      where: { id: bookId },
      include: { book: true, customer: true },
    });
    if (!bookRequest) {
      return NextResponse.json(
        { success: false, message: "Book request not found" },
        { status: 404 }
      );
    }
    if (bookRequest.issueStatus !== "pending") {
      return NextResponse.json(
        { success: false, message: "Request is not pending" },
        { status: 400 }
      );
    }
    await prisma.bookissuerequest.update({
      where: {id: bookId},
      data: {issueStatus: "issued"},
    });
    return NextResponse.json({
      success: true,
      message: "Book request accepted successfully",
    });
  } catch (error) {
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}