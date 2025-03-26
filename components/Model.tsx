import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
// import { forgotPassword } from "../services/authService";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
interface ModelProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof schema>;

const Model = ({ setIsOpen }: ModelProps) => {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      const response = await api.post("/api/auth/forgot-password", data);
      console.log(response, "response");
      if (response.data.success) {
        resetField("email");
        toast.success(response.data.successMessage);
      } else {
        toast.error(response.data.errorMessage);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.response.data.errorMessage);
    }
    // const response = await forgotPassword(data);
    // if (response.success) {
    //   resetField("email");
    //   toast.success(response.successMessage);
    // } else {
    //   toast.error(response.errorMessage);
    // }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <p className="text-gray-600 mb-4">
          Enter your email to receive a reset link.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 mr-2 cursor-pointer"
            >
              Cancel
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Model;
