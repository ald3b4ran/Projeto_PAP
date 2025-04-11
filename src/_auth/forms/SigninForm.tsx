
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
import Loader from "@/components/shared/loader"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SigninValidation } from "@/lib/validation"
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"




const Signinform = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();


  const {mutateAsync: signInAccount } = useSignInAccount();

  // 1. Define your form
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email:"",
      password:"", 

    },
  })

  // 2. Define a submit handler
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
      console.log('We are here');

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      })

      console.log({session})

      if(!session) {
        return toast({ title: 'Sign in Failed. Please try again. 1'})
      }

      const isLoggedIn = await checkAuthUser();

      console.log({isLoggedIn})

      if(isLoggedIn){
        form.reset();

        console.log('NAVIGATING')

      navigate('/')
      } else {
        return toast({ title: 'Sign up failed. Please try again. 2' })
      }
  }
  return (
    <Form {...form}>
      <div className="flex-col sm:w-420 flex-center">
        <h2 className="h3=bold md:h2-bold pt-5 sm:pt-12">Welcome Back!</h2>
        <p className="mt-2 text-light-3 small-medium md:base-regular">Please enter your account details</p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-4">
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
            {isUserLoading ? (
              <div className="gap-2 flex-center">
                <Loader />Loading...
              </div>
            ): "Sign up"}
          </Button>

          <p className="mt-2 text-center text-small-regular text-light-2">
            Don't have an account?
            <Link to="/sign-up" className="ml-1 text-primary-500 text-small-semibold">Sign in</Link>
          </p>
      </form>
    </Form>
  )
}

export default Signinform