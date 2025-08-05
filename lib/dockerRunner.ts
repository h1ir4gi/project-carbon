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

export async function runUserCodeInDocker(source: string, stdin: string) {
  const input = JSON.stringify({source, stdin});
  
  // memory limit  = 128mb for standard
  // cpu limit = 0.5 for single-threaded programs, which is the case for beginner C programs
  // setting memory-swap to the same value as memory avoids container from using swap memory
  // using --rm to automatically remove the container after it exits
  const dockerCmd = `docker run --rm -i --memory=128mb --memory-swap=128m --cpus='0.5' --pids-limit 16 --network none --stop-timeout 1 --init dcc-runner-dcc_help_testing`;
  try {
    const process = asyncExec(dockerCmd, { maxBuffer: 1024 * 1000, timeout: 15000 });
    process.child.stdin?.end(input + "\n");
    const {stdout} = await process;
    const data: DccResult = JSON.parse(stdout);
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({async start(controller) {
      const send = (chunk: string) => {
        controller.enqueue(
          encoder.encode(chunk)
        );
      };
      
      if (data.status !== "compile") {
        send(data.output + "\n");
      }
      
      if (data.status !== "success") {
        send("[!] Error:\n" +  data.error + "[?] Don't understand? Here's what dcc-help says:\n");
        await query_ollama(data.prompt, send);
      }
      
      controller.close();
    }});
    
    return stream;
  } catch(e) {
    console.log(e);
    return e.stderr ?? "An unexpected error occurred";
  }
}



async function query_ollama(prompt:string, send: { (chunk: string): void; (_: string): void; }) {
  
  const stream = await ollama.chat({
    model: MODEL,
    messages: [
      { role: 'user', content: prompt }
    ],
    stream: true
  });
  for await (const part of stream) {
    if (part?.message?.content) send(part.message.content);
  }
}