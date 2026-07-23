/**
 * GET /api/auth/me
 * Returns the current authenticated user's profile based on the HttpOnly JWT.
 */
import { NextRequest } from "next/server";
import { getAuthFromRequest } from "@/backend/middleware/auth.middleware";
import { createClient } from "@/shared/db/supabase.server";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { withErrorHandler } from "@/backend/middleware/error.middleware";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const auth = await getAuthFromRequest(req);
  if (!auth) {
    return errorResponse("Unauthorized", 401);
  }

  // Fetch latest name/profile info from DB to ensure it's up to date
  const supabase = createClient() as any;

  let realName = auth.name;
  let extraProfile: any = {};

  if (auth.role === "practitioner" || auth.role === "doctor") {
    const { data: doc } = await supabase
      .from("practitioners")
      .select("full_name, date_of_birth, gender, blood_group")
      .eq("user_id", auth.id)
      .maybeSingle();
    if (doc) {
      if (doc.full_name) realName = doc.full_name;
      extraProfile = {
        dob: doc.date_of_birth,
        gender: doc.gender,
        bloodGroup: doc.blood_group,
      };
    }
  } else if (auth.role === "patient") {
    const { data: legacyPat } = await supabase
      .from("patients")
      .select("full_name, date_of_birth, gender, blood_group")
      .eq("user_id", auth.id)
      .maybeSingle();
    if (legacyPat) {
      realName = legacyPat.full_name;
      extraProfile = {
        dob: legacyPat.date_of_birth,
        gender: legacyPat.gender,
        bloodGroup: legacyPat.blood_group,
      };
    } else {
      const { data: pat } = await supabase
        .from("patient_profiles")
        .select("full_name, date_of_birth, gender, blood_group")
        .eq("user_id", auth.id)
        .maybeSingle();
      if (pat) {
        if (pat.full_name) realName = pat.full_name;
        extraProfile = {
          dob: pat.date_of_birth,
          gender: pat.gender,
          bloodGroup: pat.blood_group,
        };
      }
    }
  }

  return successResponse({
    user: {
      ...auth,
      ...extraProfile,
      name: realName !== "Unknown" ? realName : auth.name,
    }
  });
});
