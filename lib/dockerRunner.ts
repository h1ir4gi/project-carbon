import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";

type CompileResult = {
    compile_status: "success" | "error",
    output?: string,
    error_details?: {
        compiler_message: string,
        // any other useful info
    }
  };

export async function runUserCodeInDocker(source: string, stdin: string): Promise<CompileResult> {
    const id = uuidv4();
    const tempDir = path.join(os.tmpdir(), `code-${id}`);
    await fs.mkdir(tempDir);

    const sourcePath = path.join(tempDir, "program.c");
    const stdinPath = path.join(tempDir, "stdin.txt");

    await fs.writeFile(sourcePath, source);
    await fs.writeFile(stdinPath, stdin);

    // Compose docker command: mount tempDir to /app in container, run compile_and_run.sh script inside container
    const dockerCmd = `docker run --rm -v ${tempDir}:/app/code --memory=150m --cpus=0.5 --network none carbon-dcc-runner /app/compile_and_run.sh /app/code/program.c /app/code/stdin.txt`;

    return new Promise((resolve, reject) => {
        exec(dockerCmd, (error, stdout, stderr) => {
            if (error) {
                console.error("Docker run failed:", stderr || error.message);
                console.log(error);
                return resolve({
                    compile_status: "error",
                    error_details: { compiler_message: stderr || error.message },
                });
            }
            resolve({
                compile_status: "success",
                output: stdout,
            });
          });
    });
}
