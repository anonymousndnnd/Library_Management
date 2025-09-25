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
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { fetchAdminData } from "@/store/slices/adminSlice";


export default function SigInPage(){
  const modalRef = useRef<HTMLDivElement>(null);
  const router=useRouter();
  const { data: session ,status} = useSession();
  const [loginError, setLoginError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
//   if (status === "loading") {
//   return <p>Loading...</p>; // or a spinner
// }
useEffect(() => {
  if (status === "authenticated" && session?.user) {
    const role = session.user.role;
    console.log("role is:", role);

    if (role === "ADMIN") {
      dispatch(fetchAdminData());
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
    setLoginError("");
    const result=await signIn('Credentials',{
      redirect:false,
      identifier:data.identifier,
      password:data.password,
      
    })
    if (result?.error) {
      setLoginError("Incorrect email or password");
      toast("Incorrect email or password");
    } 
    else {
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
    },
    //this is for realtime validation using zod
    mode: "onChange",     
    reValidateMode: "onChange"
  })

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      router.back(); // go to previous page
    }
  }
  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md" onClick={handleOverlayClick}>
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-10 space-y-8 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/20 dark:border-gray-700/40"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold lg:text-5xl mb-2 text-blue-600 dark:text-blue-400">
            Library Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to access your dashboard
          </p>
        </div>
        {loginError && (
          <div className="text-red-600 dark:text-red-400 text-center font-medium mb-2">
            {loginError}
          </div>
        )}
        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Email/Username</FormLabel>
                  <Input {...field} placeholder="Enter your email or username" className="border-gray-300 dark:border-gray-600"/>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} placeholder="Enter your password" className="border-gray-300 dark:border-gray-600"/>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              Sign In
            </Button>
          </form>
        </Form>

        {/* OR Divider */}
        <div className="flex items-center justify-center my-4">
          <span className="w-1/5 border-b border-gray-300"></span>
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <span className="w-1/5 border-b border-gray-300"></span>
        </div>

        {/* Google Sign In */}
        <Button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 py-3 text-lg border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 rounded-lg"
        >
          <FcGoogle size={22} /> Sign in with Google
        </Button>
      </motion.div>
    </div>
  );
}