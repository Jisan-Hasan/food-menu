import { Server } from "http";
import app from "./app";
import config from "./config";

// handle uncaught exception
process.on("uncaughtException", (err) => {
    console.error(err);
    process.exit(1);
});

let server: Server;
async function main() {
    try {
        server = app.listen(config.port, () => {
            console.log(`App is listening on port ${config.port}`);
        });
    } catch (error) {
        console.error(error);
    }

    // unhandled rejection handled
    process.on("unhandledRejection", (err) => {
        console.error(err);
        if (server) {
            server.close(() => {
                console.error(err);
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    });
}

process.on("SIGTERM", () => {
    console.log("SIGTERM is received");
    if (server) {
        server.close();
    }
});

main();
