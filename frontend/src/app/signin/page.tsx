"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Md5 } from "ts-md5";
import { zodResolver } from "@hookform/resolvers/zod";
import { postData } from "@/utils/axiosInstance";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setToken } from "@/lib/authSlice";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(
      /[#@$!%*?&]/,
      "Must include at least one special character (@, $, #, !, etc.)"
    ),
});

type FormData = z.infer<typeof formSchema>;

const Signup: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    const requestBody = {
      user_email: data.email,
      password: Md5.hashStr(data.password),
    };
    postData("/api/auth/login", requestBody).then((resp) => {
      if (resp.success) {
        dispatch(setToken(resp.token));
        router.replace("/home");
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-green-100">
      <div className="max-w-md min-w-md mx-auto p-6 border rounded-2xl shadow-2xl bg-white">
        <h2 className="text-xl font-bold mb-8 text-center">
          Login to NoteDown📚
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <button
            type="submit"
            className="w-full text-white bg-gray-800 py-2 rounded-lg cursor-pointer hover:bg-purple-700 hover:shadow-xl transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="hover:underline text-blue-500 hover:text-blue-800 transition duration-200 cursor-pointer"
          >
            Register Here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
