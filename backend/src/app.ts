import cors from "cors";
import express, { type ErrorRequestHandler } from "express";

export interface AppOptions {
  corsOrigin: string;
}

// Cac module nghiep vu (auth, products, inventory, ...) se duoc mount o day
// o cac Task 5-15. Moi module nam trong src/modules/<ten-module>/ va chi
// thao tac du lieu qua Prisma, khong de Frontend cham truc tiep database.
export function createApp(options: AppOptions) {
  const app = express();
  app.use(cors({ origin: options.corsOrigin }));
  app.use(express.json());

  app.get("/api/v1/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Khong tim thay duong dan" } });
  });

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Loi he thong" } });
  };
  app.use(errorHandler);

  return app;
}
