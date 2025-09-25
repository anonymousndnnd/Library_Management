'use client'

import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useState,useEffect, useRef } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { motion } from "framer-motion";
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { signUpSchema } from "@/schemas/signUpSchema";

export default function SignUpPage() {
  const [isSubmitting,setIsSubmitting]=useState(false);
  const modalRef = useRef<HTMLDivElement>(null); 
  const router=useRouter();

  //zod implementation
  const form=useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:'',
      role: "CUSTOMER",
    },
    mode: "onChange",     
    reValidateMode: "onChange"
  })

  
  const onSubmit=async (data:z.infer<typeof signUpSchema>)=>{
    setIsSubmitting(true);
    try {
      const response=await axios.post('/api/sign-up',data);
      toast("Signed-up successfully")
      router.replace(`/sign-in`)
    } catch (error) {
      console.error("Error in signup of user",error)
      //scope of error during debugging 
      toast("SignUp Failed")
    } finally{
      setIsSubmitting(false);
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      router.back(); // go to previous page
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50" onClick={handleOverlayClick}>
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
            Join True Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign up to start your anonymous adventure
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="CUSTOMER">Customer</SelectItem>
                      <SelectItem value="AUTHOR">Author</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input type="text" {...field} name="username" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} name="email" />
                  <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>
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

            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button> 
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

