import { Buffer, crypto, iobuf } from "../deps.ts";

async function promptString(question: string): Promise<string | undefined> {
    console.log(question);

    for await (const line of iobuf.readLines(Deno.stdin)) {
        return line;
    }

    return undefined;
}

console.log(
  Buffer.from(
    new Uint8Array(
      await crypto.subtle.digest(
        "BLAKE3",
        new TextEncoder().encode(await promptString("enter password:")),
      ),
    ),
  ).toString("hex"),
);