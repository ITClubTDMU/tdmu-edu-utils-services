import { verifySupabaseJWT } from './auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SB_PROJECT_URL!,
  process.env.SB_SERVICE_ROLE!
)

const sb = {
  verifySupabaseJWT,
  db: supabase.from
};

export default sb;
