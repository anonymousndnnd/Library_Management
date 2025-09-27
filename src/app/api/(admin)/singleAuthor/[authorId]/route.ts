import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma=new PrismaClient();

//this route return the list of all datas associated with single author
export async function GET(request:NextRequest,context:any){
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
    const { authorId } = context.params as { authorId: string };
    console.log("Id is:",authorId)
    const author=await prisma.author.findUnique({
      where:{id:authorId},
      select:{
        id:true,
        username:true,
        email:true,
        createdAt:true,
        books: {
          where: { status: { not: "rejected" } },
          select: {
            id: true,
            title: true,
            isPublished: true,
            status:true,
            createdAt:true,
          },
        }
      }
    })
    return NextResponse.json({ success: true, author },{status:200});
  } catch (error) {
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}