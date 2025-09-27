import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


const prisma=new PrismaClient();
export async function GET(request:NextRequest,context:any){
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const { bookId } = context.params as { bookId: string };
    console.log("Id is:",bookId)

    const book=await prisma.books.findUnique({where:{id:bookId}});
    console.log("Book found is ",book);
    return NextResponse.json({
      success:true,
      book
    })
  } catch (error) {
    console.error(error);
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}