import { createClient } from "./supabase";

export async function sendOtp(email: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke("send-otp", {
    body: { email },
  });

  if (error || (data && data.error)) {
    throw new Error(error?.message || data?.error || "Failed to send OTP");
  }

  return true;
}

export async function verifyOtp(email: string, otp: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.functions.invoke("verify-otp", {
    body: { email, otp },
  });

  if (error || (data && data.error)) {
    throw new Error(error?.message || data?.error || "Failed to verify OTP");
  }

  return true;
}
