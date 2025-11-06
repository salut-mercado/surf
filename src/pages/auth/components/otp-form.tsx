import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { useAuth } from "~/hooks/use-auth";

export function OTPForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { t } = useTranslation();
  const { verifyOtp } = useAuth();
  const [code, setCode] = useState("");

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{t("auth.otp.title")}</CardTitle>
        <CardDescription>{t("auth.otp.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verifyOtp.mutate({ code });
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">{t("auth.otp.verificationCode")}</FieldLabel>
              <InputOTP
                maxLength={6}
                id="otp"
                required
                value={code}
                onChange={(val) => setCode(val)}
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {verifyOtp.isError && (
                <FieldDescription className="text-red-600">
                  {verifyOtp.error?.message || t("auth.otp.failed")}
                </FieldDescription>
              )}
              <FieldDescription>
                {t("auth.otp.descriptionText")}
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Button type="submit" disabled={verifyOtp.isPending}>
                {verifyOtp.isPending ? t("auth.otp.verifying") : t("auth.otp.verify")}
              </Button>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
