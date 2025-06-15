import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getHashParams, { getCookieHandlers } from "@/utils/utils";
import axios from "../../../config/customAxios";
import { AUTH_TOKEN_KEY } from "@/utils/constant";
import { supabase } from "@/lib/dbClient";


function OAuthCallback() {
  const navigate = useNavigate();
  const { setCookieValue: setAccessToken } = getCookieHandlers(AUTH_TOKEN_KEY)();

  useEffect(() => {
    const completeLogin = async () => {
      const hashParams = getHashParams();

      if (!hashParams.access_token) {
        navigate("/signin");
        return;
      }
      // Set access token in cookie
      setAccessToken(hashParams.access_token);
      // Fetch user info from Supabase
      const { data: userData, error } = await supabase.auth.getUser(hashParams.access_token);
      if (error) {
        console.error("Error fetching user:", error.message);
        navigate("/signin");
        return;
      }
      const user = userData?.user;
      if (user) {
        // Optional: Call your backend to insert the user if not already in DB
        await axios.post("/authorize/oauth-signin", {
          email: user.email,
          name: user.user_metadata.full_name,
          supabase_uid: user.id,
          phone: user.phone ||  null,
        });
      }

      navigate("/");
    };

    completeLogin();
  }, []);

  return <div>Signing you in...</div>;
}

export default OAuthCallback;


