import { spawn } from "child_process";
import { NextResponse } from 'next/server'

type CompileResult = {
    compile_status: "success" | "error",
    output?: string,
    error_details?: { compiler_message: string },
};


export function runUserCodeInDocker(source: string, stdin: string) {
    const input = JSON.stringify({source, stdin});

    const proc = spawn(
      "docker",
      ["run", 
        "-m", "120m",
        "--memory-swap", "120m",
        "-i", "dcc-runner-dcc_help_testing", "/root/compile.sh"], 
      { timeout: 30000, killSignal:"SIGKILL" }
    );
    proc.stdin?.write(input + "\n");
    proc.stdin?.end();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const send = (chunk: string) => {
          controller.enqueue(
            encoder.encode(chunk)
          );
        };

        proc.stdout.on("data", (c) => send(c.toString()));
        proc.stderr.on("data", (c) => send(c.toString()));

        proc.on("exit", (_code, signal) => {
          if(signal !== null) {
            send("\n[!] Process timed out!\n");
          }
          controller.close();
        });
      },
    });

  return stream;
}
