import { useAuth } from "~/hooks/use-auth";
import { LoginForm } from "./LoginForm";
import { OTPForm } from "./OTPForm";

const AuthPage = () => {
  const { step } = useAuth();
  return (
    <div className="container mx-auto max-w-md py-16">
      {step === "password" ? <LoginForm /> : <OTPForm />}
    </div>
  );
};

export default AuthPage;
