"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Md5 } from "ts-md5";
import { zodResolver } from "@hookform/resolvers/zod";
import { postData } from "@/utils/axiosInstance";

const formSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(
        /[#@$!%*?&]/,
        "Must include at least one special character (@, $, !, etc.)"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

const Signup: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    const requestBody = {
      user_name: data.name,
      user_email: data.email,
      password: Md5.hashStr(data.password),
    };
    postData("/api/auth/register", requestBody).then((response) => {
      console.log(response);
      if (response.success) {
        router.replace("/signin");
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-green-100">
      <div className="max-w-md min-w-md mx-auto p-6 border rounded-2xl shadow-2xl bg-white">
        <h2 className="text-xl font-bold mb-8 text-center">
          Register to NoteDown📚
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              {...register("name")}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full text-white bg-gray-800 py-2 rounded-lg cursor-pointer hover:bg-purple-700 hover:shadow-xl transition duration-200"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <a
            href="/signin"
            className="hover:underline text-blue-500 hover:text-blue-800 transition duration-200 cursor-pointer"
          >
            Login Here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
