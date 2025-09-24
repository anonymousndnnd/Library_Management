'use client'
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { signInSchema } from "@/schemas/signInSchema";
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { useEffect } from "react"



export default function SigInPage(){
  const router=useRouter();
  const { data: session ,status} = useSession();
//   if (status === "loading") {
//   return <p>Loading...</p>; // or a spinner
// }
useEffect(() => {
  if (status === "authenticated" && session?.user) {
    const role = session.user.role;
    console.log("role is:", role);

    if (role === "ADMIN") {
      router.replace("/adminDashboard");
    } else if (role === "AUTHOR") {
      router.replace("/authorDashboard");
    } else if (role === "CUSTOMER") {
      router.replace("/customerDashboard");
    } else {
      console.warn("Unknown role:", role);
    }
  }
}, [status, session, router]);
  
  const onSubmit=async (data:z.infer<typeof signInSchema>)=>{
    const result=await signIn('Credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password,
      
    })
    if (result?.error) {
    toast("Login Failed");
  } else {
    toast("Login successful! Redirecting...");
    // No need to manually redirect here — useEffect will handle it
  }
  }

  //zod implementation
  const form=useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:'',
      password:''
    }
  })

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join True Feedback
            </h1>
            <p className="mb-4">Sign in to start your anonymous adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              

              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <Input {...field}  />
                    <p className=' text-gray-700 text-sm'>Enter your email</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" {...field} name="password" />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className='w-full' >
                SignIn
              </Button> 
            </form>
        </Form>
        <div className="flex items-center justify-center my-4">
          <span className="w-1/5 border-b border-gray-300"></span>
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <span className="w-1/5 border-b border-gray-300"></span>
        </div>

        
        <Button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <FcGoogle size={22} /> Sign in with Google
        </Button>
      </div>
    </div>
  );
}