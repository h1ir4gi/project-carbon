import {promisify} from "util";
import { exec } from "child_process";

import {Ollama} from 'ollama';

const MODEL =  process.env.DCC_HELP_MODEL ?? 'hf.co/unsloth/gemma-3n-E2B-it-GGUF:Q4_K_M';
const ollama = new Ollama({ host: process.env.OLLAMA_HOST ?? 'http://localhost:11434' })

const asyncExec = promisify(exec);

// type LogField = string | number | boolean | string[];
// type LogType = Record<string, LogField>;

export type DccResult =
  | { status: "compile"; error: string; prompt: string }
  | { status: "runtime"; error: string; output: string; prompt: string }
  | { status: "success"; output: string };

export async function runUserCodeInDocker(source: string, stdin: string): Promise<string> {
  const input = JSON.stringify({source, stdin});

    // memory limit  = 128mb for standard
    // cpu limit = 0.5 for single-threaded programs, which is the case for beginner C programs
    // setting memory-swap to the same value as memory avoids container from using swap memory
    // using --rm to automatically remove the container after it exits
    const dockerCmd = `docker run --rm -i --memory=128mb --memory-swap=128m --cpus='0.5' --pids-limit 16 --network none --stop-timeout 1 --init dcc-runner-dcc_help_testing`;
    try {
      const process = asyncExec(dockerCmd, { maxBuffer: 1024 * 1000, timeout: 15000 });
      process.child.stdin?.end(input + "\n");
      const {stdout, stderr} = await process;
      // console.log(stdout);
      const data: DccResult = JSON.parse(stdout);
      if (data.status === "success") return data.output;
      // TODO Generate dcc-help message.
      let output = "";
      if (data.status === "runtime") output += data.output + "\n";
      output += 
          "[!] Error:\n" +  data.error + 
          "[?] Don't understand? Here's what dcc-help says:\n" +  await query_ollama(data.prompt);
      // console.log(output);
      return output;

    } catch(e) {
      console.log(e);
      return e.stderr ?? "An unexpected error occurred";
    }
}



async function query_ollama(prompt:string) {

  const startTime = performance.now();
  const response = await ollama.chat({
    model: MODEL,
    messages: [
      { role: 'user', content: prompt }
    ],
    stream: false
  });

  const endTime = performance.now();
  console.log(`Execution time: ${(endTime - startTime) / 1000}s`);

  // for await (const part of stream) {
  //   process.stdout.write(part?.message?.content ?? '');
  // }
  return response.message.content;
}