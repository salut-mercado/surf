import { useAuth } from "~/hooks/use-auth";
import { LoginForm } from "./components/login-form";
import { OTPForm } from "./components/otp-form";
import { LanguageToggle } from "~/components/common/language-toggle";
import { ThemeToggle } from "~/components/common/theme-toggle";

const AuthPage = () => {
  const { step } = useAuth();
  return (
    <div className="container mx-auto max-w-md py-16">
      <div className="flex justify-end mb-2 gap-2">
        <ThemeToggle variant="secondary" className="size-7" />
        <LanguageToggle variant="secondary" className="size-7" />
      </div>
      {step === "password" ? <LoginForm /> : <OTPForm />}
    </div>
  );
};

export default AuthPage;
