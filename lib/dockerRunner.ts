import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";

type CompileResult = {
    compile_status: "success" | "error",
    output?: string,
    error_details?: {
        compiler_message: string,
    }
};

export async function runUserCodeInDocker(source: string, stdin: string): Promise<CompileResult> {
    const tempDir = path.join(process.cwd(), "dcc-runner/volume/temp"); 
    await fs.mkdir(tempDir, { recursive: true });

    const sourcePath = path.join(tempDir, "program.c");
    const stdinPath = path.join(tempDir, "stdin.txt");

    await fs.writeFile(sourcePath, source);
    await fs.writeFile(stdinPath, stdin);

    const containerSource = `/root/volume/temp/program.c`;
    const containerStdin = `/root/volume/temp/stdin.txt`;

    const dockerCmd = `docker exec dcc-runner-dcc_help_testing-1 /root/compile.sh ${containerSource} ${containerStdin}`;

    return new Promise((resolve) => {
        exec(dockerCmd, { maxBuffer: 1024 * 1000 }, (error, stdout, stderr) => {
            if (error) {
                console.error("Docker exec failed:", stdout || error.message);
                return resolve({
                    compile_status: "error",
                    error_details: { compiler_message: stdout || error.message },
                });
            }

            resolve({
                compile_status: "success",
                output: stdout,
            });
        });
    });
}