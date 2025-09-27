import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma=new PrismaClient();

export async function GET(request:Request){
  try {
    const session=await getServerSession(authOptions);   
    // if (!session) {
    //   return NextResponse.json({ success: false, message: "Session Expired" }, { status: 401 });
    // }
    // const admin=await prisma.admin.findFirst();
    // if(!admin){
    //   return NextResponse.json({ success: false, message: "Admin is unauthorized" }, { status: 401 });
    // }
    // if(session.user._id!==admin.id){
    //   return NextResponse.json({ success: false, message: "Duplicate admin" }, { status: 401 });
    // }
    const requestedBooks=await prisma.bookissuerequest.findMany({
      where:{issueStatus:"pending"},
      include: {

      book: { select: { title: true, createdAt: true ,author:{select:{username:true}}} },
      customer: { select: { username: true, email: true} }, },
    })
    return NextResponse.json({
      success: true,
      message: "Book has been published successfully",
      books:requestedBooks
    },{status:200});
  } catch (error) {
    console.error("error is",error)
      return Response.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}