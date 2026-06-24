import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://kbadhddpbuxczljbluaa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiYWRoZGRwYnV4Y3psamJsdWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NDg2MTUsImV4cCI6MjA5NTUyNDYxNX0.atosxWes14liKem0UDPpc8M7DVmaCxpXb5n0jeXgA98"
);