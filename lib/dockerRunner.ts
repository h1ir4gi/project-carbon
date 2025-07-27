import { exec } from "child_process";

type CompileResult = {
    compile_status: "success" | "error",
    output?: string,
    error_details?: { compiler_message: string },
};

export async function runUserCodeInDocker(source: string, stdin: string): Promise<CompileResult> {
    // Convert both strings to base64 so they can safely be reconstructed in the container
    const sourceBase64 = Buffer.from(source, "utf8").toString("base64");
    const stdinBase64 = Buffer.from(stdin, "utf8").toString("base64");

    const dockerCmd = `
        docker run --rm dcc-runner-dcc_help_testing sh -c '
            echo "${sourceBase64}" | base64 -d > /tmp/program.c &&
            echo "${stdinBase64}" | base64 -d > /tmp/stdin.txt &&
            /root/compile.sh /tmp/program.c /tmp/stdin.txt
        '
    `;

    return new Promise((resolve) => {
        exec(dockerCmd, { maxBuffer: 1024 * 1000 }, (error, stdout, stderr) => {
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
    });
}
