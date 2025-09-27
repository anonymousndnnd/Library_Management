import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


const prisma=new PrismaClient();

export async function POST(request:Request,{params}: { params: { bookId: string }}){
  try {
    const session = await getServerSession(authOptions);
    console.log("session is in request:",session)
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const customer=await prisma.customer.findUnique({
      where:{id:session.user._id}
    });
    console.log("customer is:",customer)
    if(!customer){
      return NextResponse.json({ success: false, message: "Customer is unauthorized" }, { status: 401 });
    }
    const {bookId}=params;
    // const customerId=session?.user._id;
    const book = await prisma.books.findUnique({ where: { id: bookId } });
    const newRequest = await prisma.bookissuerequest.create({
      data: {
        bookId,
        customerId: customer.id,
        issueStatus: "pending",
      },
      include: {
        book: { select: { title: true } },
        customer: { select: { username: true, email: true } },
      }
    });
    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
      console.error(error);
      return Response.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
  }
}