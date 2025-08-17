import { verifySupabaseJWT } from './auth';
import { createClient } from '@supabase/supabase-js';
import { Database } from '~/types/db/database.types';

const sbdb = createClient<Database>(process.env.SB_PROJECT_URL!, process.env.SB_SERVICE_ROLE!);

const sb = {
  verifySupabaseJWT,
};

export default sb;
export { sbdb };
