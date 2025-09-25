import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/option";

const prisma=new PrismaClient();
export async function GET(request:Request){
  try {
    const session=await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Session Expired" }, { status: 401 });
    }
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

    const authors=await prisma.author.findMany({
      where:{adminId:admin.id},
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
    });

    return NextResponse.json({ success: true, authors }, { status: 200 });


  } catch (error) {
    return Response.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}