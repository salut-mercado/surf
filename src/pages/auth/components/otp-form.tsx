import { useState } from "react";
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
  const { verifyOtp } = useAuth();
  const [code, setCode] = useState("");

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Enter verification code</CardTitle>
        <CardDescription>We sent a 6-digit code to your email.</CardDescription>
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
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>
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
                  {verifyOtp.error?.message || "Verification failed"}
                </FieldDescription>
              )}
              <FieldDescription>
                Enter the 6-digit code sent to your email.
              </FieldDescription>
            </Field>
            <FieldGroup>
              <Button type="submit" disabled={verifyOtp.isPending}>
                {verifyOtp.isPending ? "Verifying..." : "Verify"}
              </Button>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
