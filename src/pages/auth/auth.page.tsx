import { useAuth } from "~/hooks/use-auth";
import { LoginForm } from "./components/login-form";
import { OTPForm } from "./components/otp-form";

const AuthPage = () => {
  const { step } = useAuth();
  return (
    <div className="container mx-auto max-w-md py-16">
      {step === "password" ? <LoginForm /> : <OTPForm />}
    </div>
  );
};

export default AuthPage;
