import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
const prisma=new PrismaClient();


import React from 'react'
import { authOptions } from "../auth/[...nextauth]/option";

export async function POST(request:Request){
  try {
    const session = await getServerSession(authOptions)
    console.log("session:",session);
    if(!session || session.user.role!=="AUTHOR"){
      return Response.json({
        success:false,
        message:"User not authenticated"
      },{status:404})
    }
    const {title,description}=await request.json();
    const author = await prisma.author.findFirst({
      where: { id: session.user._id },  
    });
    console.log("Author is:",author)
    if (!author) {
      return Response.json(
        { success: false, message: "Author profile not found" },
        { status: 404 }
      );
    }
    
    const book = await prisma.books.create({
      data: {
        title,
        description,
        authorId: author.id
      },
    });
    return Response.json(
      { success: true, book },
      { status: 201 }
    );
  } catch (error) {
      console.error(error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}