"use client";
import Model from "@/components/Model";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { redirect } from "next/navigation";
import { AxiosError } from "axios";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type SigninFormValues = z.infer<typeof schema>;

const SignIn = () => {
  //   const { setAccessToken,setRefreshToken } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SigninFormValues) => {
    try {
      const response = await api.post("/api/auth/sign-in", data);
      console.log(response, "response");
      if (response.data.success) {
        resetField("email");
        resetField("password");
        toast.success(response.data.successMessage);
        setTimeout(() => {
          redirect("/dashboard");
        }, 500);
      } else {
        toast.error(response.data.errorMessage);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.response.data.errorMessage);
    }
  };
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-3 mx-auto md:h-[90vh] lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h2>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-1">
                  <input
                    type="password"
                    id="password"
                    {...register("password")}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-sm">
                <a
                  onClick={() => setIsOpen(true)}
                  className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </section>
      {isOpen && <Model setIsOpen={setIsOpen} />}
    </>
  );
};

// Redirect logged-in users away from sign-in page
// export async function getServerSideProps({ req }) {
//   const token = req.cookies.token;

//   if (token) {
//     return {
//       redirect: { destination: "/dashboard", permanent: false },
//     };
//   }

//   return { props: {} };
// }

export default SignIn;
