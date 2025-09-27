import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, message: "Session Expired" }, { status: 401 });
    }

    // Verify customer
    const customer = await prisma.customer.findUnique({
      where: { id: session.user._id }
    });
    if (!customer) {
      return NextResponse.json({ success: false, message: "Customer is unauthorized" }, { status: 401 });
    }

    // Fetch all published books
    const publishedBooks=await prisma.books.findMany({
      where:{isPublished:true,status:"published"},
      include:{
        author:{select:{username:true}},
        issueRequests:{select:{issueStatus:true,customerId: true,}}
      }
    })
    const allPublishedBooks=publishedBooks.map(book=>({
      
      id:book.id,
      title: book.title,
      author: book.author.username,
      issued: book.issueRequests.some(
        req => req.customerId === customer.id && req.issueStatus === "issued"
      )
    }))
    const issuedBooks=await prisma.bookissuerequest.findMany({
      where:{customerId:customer.id,issueStatus:"issued"},
      include:{
        book:{select:{id:true,title:true,description:true,createdAt:true,author:{select:{username:true}}}},
      }
    })
    const allIssuedBooks = issuedBooks.map(req => ({
      id: req.book.id,
      title: req.book.title,
      description:req.book.description,
      author: req.book.author.username,
      publishedAt: req.book.createdAt,
      issued: true
    }));
    return NextResponse.json({ success: true, issuedBooks:allIssuedBooks,publishedBooks:allPublishedBooks }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
