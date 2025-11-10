import type { MaybePromiseVoid } from "./customTypes.ts";

let handlers: (() => MaybePromiseVoid)[] = [];

export const addSigListener = (fun: () => MaybePromiseVoid): void => {
  handlers.push(fun);
};
export const removeSigListener = (fun: () => MaybePromiseVoid): void => {
  handlers = handlers.filter((v) => v === fun);
};

const sigHandler = async () => {
  console.log("Shutting down...");
  for (const i of handlers) {
    await i();
  }

  Deno.exit();
};

if (Deno.build.os !== "windows") {
  Deno.addSignalListener("SIGTERM", sigHandler);
}
// Windows momentje
Deno.addSignalListener("SIGINT", sigHandler);
