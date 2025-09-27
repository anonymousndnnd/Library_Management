
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma=new PrismaClient();

export async function GET(request:NextRequest,context:any){
  try {
    console.log("error Apart")
    const session=await getServerSession(authOptions)
    console.log("Session is in overview:",session);
    if (!session) {
      return NextResponse.json({ success: false, message: "Session Expired" }, { status: 401 });
    }
    const customer=await prisma.customer.findUnique({
      where:{id:session.user._id}
    });
    if(!customer){
      return NextResponse.json({ success: false, message: "Customer is unauthorized" }, { status: 401 });
    }
    const { bookId } = context.params as { bookId: string };
    const book=await prisma.books.findUnique({
      where:{id:bookId},
      include:{
        author:{select:{username:true}}
      }
    })
    if (!book) {
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 });
    }
    const requestRecord = await prisma.bookissuerequest.findFirst({
      where: {
        bookId,
        customerId: session.user._id,
      },
      select: {
        id: true,
        issueStatus: true,
      },
    });
    return NextResponse.json({ success: true, book , request: requestRecord}, { status: 200 });
  } catch (error) {
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}