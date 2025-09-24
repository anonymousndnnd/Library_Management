
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const prisma=new PrismaClient()

// prisma.$connect()
//   .then(() => console.log("✅ Prisma connected to DB"))
//   .catch(err => console.error("❌ Prisma connection failed:", err))

export const authOptions:NextAuthOptions={
  providers: [
    CredentialsProvider({
      id:"Credentials",
      //name to show in the page 
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials:any):Promise<any>{
        try {
          let user=await prisma.admin.findFirst({
            where:{
              //here inside where ,OR is used because it will search either for email or username
              OR:[
                {email:credentials.identifier},
                {username:credentials.identifier}
              ]
            }
          })
          if (!user) {
            user=await prisma.author.findFirst({
            where:{
              //here inside where ,OR is used because it will search either for email or username
              OR:[
                {email:credentials.identifier},
                {username:credentials.identifier}
              ]
            }
          })
          }
          if (!user) {
            user=await prisma.customer.findFirst({
            where:{
              //here inside where ,OR is used because it will search either for email or username
              OR:[
                {email:credentials.identifier},
                {username:credentials.identifier}
              ]
            }
          })
          }
          console.log("🔹 [DEBUG] User found in DB:", user ? user.email : "Not Found");

          if(!user){
            throw new Error("No user found with this identifier");
          }

          const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password);
          if(isPasswordCorrect){
            console.log("✅ [DEBUG] Login successful for user:", user.email);
            return user
          }
          else{
            throw new Error('Incorrect Password')
          }

        } catch (error:any) {
          console.log("Authentication error:",error.message);
          throw new Error(error);
        }

      }
    })
    ,
     GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      //yaha pe jo user mil raha hai wo authorize ke andar jo user return kiye hai wo hai 
      if(user){
        token._id= user.id?.toString()
        token.isVerified= user.isVerified
        token.username= user.username
        token.role = user.role;
      }
      
      return token
    },
    //ye fuction session return karega jisse hum directly check kar paayenge session token hai ki nhi
    async session({ session,token }) {
      const Token = token as {
        _id?: string;
        isVerified?: boolean;
        username?: string;
        role?: string;
      };
      if(token){
        session.user._id=Token._id
        session.user.isVerified=Token.isVerified
        session.user.username=Token.username
        session.user.role=Token.role
      }
      console.log("Session is",session);
      return session;
    }
  },
  pages:{
    signIn:'/sign-in',
    signOut:'/sign-out'
  },
  session: {
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET
}