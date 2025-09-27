import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
const prisma=new PrismaClient();


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
      where:{authorId:author.id},
      include: {
        issueRequests: {   
        where: { issueStatus: "issued" }, // ✅ only confirmed issues
        select: {
          id: true,
          customerId: true,
        },
        }
    },
    });
    const booksWithReaders = books.map((book) => ({
      id: book.id,
      title: book.title,
      description: book.description,
      status: book.status,
      readersCount: book.issueRequests.length, // ✅ only issued requests counted
    }));
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