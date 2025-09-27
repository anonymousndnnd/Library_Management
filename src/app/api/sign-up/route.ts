import bcrypt from "bcryptjs"
import { PrismaClient, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma=new PrismaClient()

export async function POST(request:NextRequest) {
  try {
    const {username,email, password,role} = await request.json();

    // if (!Object.values(userRole).includes(role)) {
    //   return Response.json({ success: false, message: "Invalid role" }, { status: 400 })
    // }
    
    const existingAdmin=await prisma.admin.findUnique({where:{email}});
    const existingCustomer=await prisma.customer.findUnique({where:{email}});
    const existingAuthor=await prisma.author.findUnique({where:{email}});

    if(existingAdmin || existingCustomer || existingAuthor){
      console.log("User already exists")
      return Response.json({
        success:false,
        message:"Error registering user,User already exists"
      },{
        status:400
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if(role===Role.ADMIN){
      const adminExists = await prisma.admin.findFirst();
      if(adminExists){
        return Response.json({
        success:false,
        message:"You are not an admin"
      },{
        status:400
      })
      }
      await prisma.admin.create({
        data:{
          username,
          email,
          password:hashedPassword,
          role: Role.ADMIN
        }
      })
      return Response.json({
        success:true,
        message:"Admin registered Successfully"
      },{
        status:201
      })
    }
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return Response.json(
        { success: false, message: "Cannot create Author/Customer without an Admin." },
        { status: 400 }
      );
    }

    if (role === Role.AUTHOR) {
      const newAuthor = await prisma.author.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: Role.AUTHOR,
          adminId: admin.id,
        },
      });

      return Response.json(
        { success: true, message: "Author created successfully", data: newAuthor },
        { status: 201 }
      );
    }
    if (role === Role.CUSTOMER) {
      const newCustomer = await prisma.customer.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: Role.CUSTOMER,
          adminId: admin.id,
        },
      });

      return NextResponse.json(
        { success: true, message: "Customer created successfully", data: newCustomer },
        { status: 201 }
      );
    }
    return NextResponse.json({
        success:true,
        message:"User Registered Successfully ."
      },{status:201})
  } catch (error) {
      console.error("Error registering user",error)
      return NextResponse.json({
        success:false,
        message:"Error registering user"
      },{
        status:500
      })
  }
}