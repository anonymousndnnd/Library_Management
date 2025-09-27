import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma=new PrismaClient();

export async function GET(request:NextRequest){
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
    const issuedBooks=await prisma.bookissuerequest.findMany({
      where:{issueStatus:"issued"},
      include: {
        customer: { select: { username: true, email: true } },
        book: {
          select: {
            title: true,
            createdAt: true,
            author: { select: { username: true } },
          },
        },
      }, 
    })
    return NextResponse.json({ success: true, issuedBooks }, { status: 200 });
  } catch (error) {
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}