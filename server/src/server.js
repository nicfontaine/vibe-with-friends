import { createServer } from "http";
import * as dotenv from "dotenv";
import app from "./app";
dotenv.config();
const PORT = process.env.PORT || 3680;

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
