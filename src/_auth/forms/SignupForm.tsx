
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SignupValidation } from "@/lib/validation"
import { z } from "zod";
import Loader from "@/components/shared/loader"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"




const Signupform = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const {mutateAsync: createUserAccount, isPending: isCreatingUser} = useCreateUserAccount();

  const {mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();

  // 1. Define your form
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name:"",
      username: "",
      email:"",
      password:"", 

    },
  })

  // 2. Define a submit handler
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
      const newUser = await createUserAccount(values);

      if(!newUser) {
        return toast({title:'Sign up failed. Please try again!'})
      }

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      })

      if(!session) {
        return toast({ title: 'Sign in Failed. Please try again. 1'})
      }

      const isLoggedIn = await checkAuthUser();

      if(isLoggedIn){
        form.reset();

      navigate('/')
      } else {
        return toast({ title: 'Sign up failed. Please try again. 2' })
      }
  }
  return (
    <Form {...form}>
      <div className="flex-col sm:w-420 flex-center">
        <h2 className="h3=bold md:h2-bold pt-5 sm:pt-12">Create a new Account</h2>
        <p className="mt-2 text-light-3 small-medium md:base-regular">To use StudentShare enter your account details</p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Your log in user" className="shad-input" {...field} />
              </FormControl>
            </FormItem>
          )}
          />
           <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Your public display name" className="shad-input" {...field} />
              </FormControl>
              <FormDescription>
              </FormDescription>
            </FormItem>
          )}
          />
           <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Your account email" className="shad-input" {...field} />
              </FormControl>
            </FormItem>
          )}
          />
            <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Minimum 8 characters" className="shad-input" {...field} />
              </FormControl>
            </FormItem>
          )}
          />
          <Button type="submit" className="shad-button_primary">
            {isCreatingUser ? (
              <div className="gap-2 flex-center">
                <Loader />Loading...
              </div>
            ): "Sign up"}
          </Button>

          <p className="mt-2 text-center text-small-regular text-light-2">
            Already have an account?
            <Link to="/sign-in" className="ml-1 text-primary-500 text-small-semibold">Log in</Link>
          </p>
      </form>
    </Form>
  )
}

export default Signupform