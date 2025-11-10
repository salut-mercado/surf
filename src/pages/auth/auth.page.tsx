import { LanguageToggle } from "~/components/common/language-toggle";
import { ThemeToggle } from "~/components/common/theme-toggle";
import { useAuth } from "~/hooks/use-auth";
import { LoginForm } from "./components/login-form";
import { OTPForm } from "./components/otp-form";
import { Logo } from "~/components/common/logo";

const AuthPage = () => {
  const { step } = useAuth();
  return (
    <div className="container mx-auto max-w-md py-16">
      <div className="flex justify-between items-center mb-2">
        <Logo variant="full" />
        <div className="flex gap-2">
          <ThemeToggle variant="secondary" className="size-7" />
          <LanguageToggle variant="secondary" className="size-7" />
        </div>
      </div>
      {step === "password" ? <LoginForm /> : <OTPForm />}
    </div>
  );
};

export default AuthPage;
