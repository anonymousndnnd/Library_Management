import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
const prisma=new PrismaClient();
import { authOptions } from "../auth/[...nextauth]/option";


export async function GET(request:Request){
  try {
    const session = await getServerSession(authOptions);
    console.log("session:",session);
    if(!session || session.user.role!=="AUTHOR"){
      return Response.json({
        success:false,
        message:"User not authenticated"
      },{status:404})
    }
    const author = await prisma.author.findFirst({
      where: { id: session.user._id },  
    });
    if (!author) {
      return Response.json(
        { success: false, message: "Author profile not found" },
        { status: 404 }
      );
    }
    const books=await prisma.books.findMany({
      where:{authorId:author.id}
    })
    console.log("books is:",books)
    return Response.json(
      { success: true, books },
      { status: 200 }
    );
  } catch (error) {
      console.error(error);
      return Response.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}