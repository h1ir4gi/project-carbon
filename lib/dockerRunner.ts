import { spawn } from "child_process";
import { NextResponse } from 'next/server'

type CompileResult = {
    compile_status: "success" | "error",
    output?: string,
    error_details?: { compiler_message: string },
};


export function runUserCodeInDocker(source: string, stdin: string) {
    const input = JSON.stringify({source, stdin});

    const proc = spawn("docker", ["run", "-i", "--rm", "dcc-runner-dcc_help_testing", "/root/compile.sh"]);
    proc.stdin?.write(input + "\n");
    proc.stdin?.end();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const send = (chunk: Buffer) => {
          controller.enqueue(
            encoder.encode(chunk.toString())
          );
        };

        proc.stdout.on("data", (c) => send(c));
        proc.stderr.on("data", (c) => send(c));

        proc.on("exit", (_code) => {
          controller.close();
        });
      },
    });

  return stream;
}
