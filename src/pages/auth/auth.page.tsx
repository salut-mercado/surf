import { useState } from "react";
import { apiAxios } from "../../lib/axiosConfig";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: any = pendingToken
        ? { code, pending_authentication_token: pendingToken }
        : { email, password };
      const res = await apiAxios.post("/auth/login", payload);
      const token = res.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        window.location.href = "/suppliers";
      } else if (res.status === 202 && res.data?.next_step === "email_verification_required") {
        setPendingToken(res.data?.pending_authentication_token);
        setCode("");
      } else {
        setError("Unexpected response");
      }
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "64px auto" }}>
      <h1>Sign in</h1>
      <form onSubmit={onSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {!pendingToken && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </>
          )}
          {pendingToken && (
            <>
              <input
                type="text"
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </>
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Working..." : pendingToken ? "Verify & continue" : "Sign in"}
          </button>
          {error && (
            <div style={{ color: "red", fontSize: 12 }} role="alert">
              {error}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
