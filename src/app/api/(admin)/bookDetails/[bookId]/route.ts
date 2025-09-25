import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma=new PrismaClient();

export async function GET(request:Request,{ params }: { params: { bookId: string }}){
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
    const {bookId}=params;
    const book=await prisma.books.findUnique({
      where:{id:bookId},
      include:{
        author: { select: { username: true } },
      }
    })
    if (!book) {
      return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, book }, { status: 200 });
  } catch (error) {
      return Response.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}