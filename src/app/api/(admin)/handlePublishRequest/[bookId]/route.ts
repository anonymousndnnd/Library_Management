import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma=new PrismaClient();

export async function PATCH(request:Request,{ params }: { params: { bookId: string }}){
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

    const updatedBook = await prisma.books.update({
      where: { id: bookId },
      data: {
        isPublished: true,
        status: "published",
      },
    });
    return NextResponse.json({
      success: true,
      message: "Book has been published successfully",
      book: updatedBook,
    });
  } catch (error) {
    return Response.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}   