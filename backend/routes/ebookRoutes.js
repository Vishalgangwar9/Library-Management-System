import { Router } from "express";
import eBookControllers from "../controllers/eBookControllers.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import adminMiddleware from "../middlewares/admin-middleware.js";
// import rateLimitMiddleware from "../middlewares/rate-limit-middleware.js"; // Optional for rate limiting

const eBookRouter = Router();

eBookRouter.use(authMiddleware);

eBookRouter.get("/", eBookControllers.getEBooks);

eBookRouter.get("/:_id", eBookControllers.getEBook);

eBookRouter.use(adminMiddleware);

eBookRouter.post("/", eBookControllers.createEBook);

eBookRouter.put("/:_id", eBookControllers.updateEBook);

eBookRouter.delete("/:_id", eBookControllers.deleteEBook);

eBookRouter.get("/files/export", eBookControllers.exportEBooks);

eBookRouter.get("/read/:_id/online", eBookControllers.readEBook);

export default eBookRouter;
