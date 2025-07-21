import { exec } from "child_process";

type CompileResult = {
    compile_status: "success" | "error",
    output?: string,
    error_details?: { compiler_message: string },
};

export async function runUserCodeInDocker(source: string, stdin: string): Promise<CompileResult> {
    // Convert both strings to base64 so they can safely be reconstructed in the container
    // const sourceBase64 = Buffer.from(source, "utf8").toString("base64");
    // const stdinBase64 = Buffer.from(stdin, "utf8").toString("base64");

    const input = JSON.stringify({source, stdin});

    const dockerCmd = "docker run -i --rm dcc-runner-dcc_help_testing /root/compile.sh";

    return new Promise((resolve) => {
        const child = exec(dockerCmd, { maxBuffer: 1024 * 1000 }, (error, stdout, stderr) => {
            if (error) {
                return resolve({
                    compile_status: "error",
                    error_details: { compiler_message: stderr || stdout || error.message },
                });
            }
            resolve({
                compile_status: "success",
                output: stdout,
            });
        });
        child.stdin?.write(input + "\n")
        child.stdin?.end()
    });

}
