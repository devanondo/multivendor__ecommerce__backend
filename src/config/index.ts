import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
    jwt: {
        secret: process.env.JWT_SECRET,
        exprire_in: process.env.JWT_EXPIRE_IN,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        refresh_exprire_in: process.env.JWT_REFRESH_EXPIRE_IN,
    },
};
