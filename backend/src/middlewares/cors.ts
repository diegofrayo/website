import cors from "cors";

import envVars from "~/modules/env";

const corsMiddleware = [cors({ origin: envVars.CORS_ALLOWED_ORIGINS })];

export default corsMiddleware;
