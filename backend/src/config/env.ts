// Doc bien moi truong. Khong hardcode mat khau / khoa bi mat trong code.

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Thieu bien moi truong bat buoc: ${name} (xem backend/.env.example)`);
  return value;
}

export function loadEnv() {
  return {
    port: Number(process.env.PORT ?? 3000),
    nodeEnv: process.env.NODE_ENV ?? "development",
    databaseUrl: required("DATABASE_URL"),
    corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  };
}

export type Env = ReturnType<typeof loadEnv>;
