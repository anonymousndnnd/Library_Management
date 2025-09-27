import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/option";

const prisma=new PrismaClient();

export async function GET(request:NextRequest){
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
    //Bassically in this route i will group all the customers on the basis of customerId whose issueStatus has been issued and also count
    //books with the helpof _count 
    const refinedCustomerData=await prisma.bookissuerequest.groupBy({
      by:["customerId"],
      where:{issueStatus:"issued"},
      _count:{bookId:true}
    })
    console.log("customer refined data is ",refinedCustomerData);
    //Now from the above refined data we will fetch what we want
    const customerData=await Promise.all(
      refinedCustomerData.map(
        async (item)=>{
          const customer = await prisma.customer.findUnique({
            where: { id: item.customerId },
            select: { id: true, username: true, email: true },
          });
          const books = await prisma.bookissuerequest.findMany({
          where: { customerId: item.customerId, issueStatus: "issued" },
          select: {
            id: true,
            book: {
              select: {
                title: true,
                createdAt: true,
                author: { select: { username: true } },
              },
            },
          },
        });
          return {
            id: customer?.id,
            username: customer?.username,
            email: customer?.email,
            totalBooksIssued: item._count.bookId,
            issuedBooks: books.map((b) => ({
            id: b.id,
            title: b.book.title,
            author: b.book.author.username,
            publishedAt: b.book.createdAt,
          })),
          };
        }
      )
    );
    return NextResponse.json({ success: true, customerData }, { status: 200 });
  } catch (error) {
      console.error("error is",error)
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}