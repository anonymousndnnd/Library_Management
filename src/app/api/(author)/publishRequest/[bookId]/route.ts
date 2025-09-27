import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


const prisma=new PrismaClient();

export async function POST(request:NextRequest,context:any){
  try {

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const author=await prisma.author.findUnique({
      where:{id:session.user._id}
    });
    if(!author){
      return NextResponse.json({ success: false, message: "Author is unauthorized" }, { status: 401 });
    }
    const { bookId } = context.params as { bookId: string };
    console.log("Book Id is:",bookId)
    const authorId=session?.user._id;

    const book = await prisma.books.findUnique({ where: { id: bookId } });
    console.log("Book is",book)
    if (!book || book.authorId !== authorId) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You do not own this book" },
        { status: 404 }
      );
    }
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "No admin found" },
        { status: 500 }
      );
    }
    const updatedBook=await prisma.books.update({
      where:{id:bookId},
      data: {
        adminId: admin.id,  
        status: "pending",  
      },
    })
    console.log("Updated Book is:",updatedBook);
    return NextResponse.json({ success: true,book: updatedBook });
  } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}