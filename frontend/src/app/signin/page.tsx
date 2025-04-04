"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Md5 } from "ts-md5";
import { zodResolver } from "@hookform/resolvers/zod";
import { postData } from "@/utils/axiosInstance";
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setToken } from '@/lib/authSlice';

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
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Sign In Form</h2>
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
          className="w-full text-black bg-white py-2 rounded-lg cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Signup;
