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

    // memory limit  = 128mb for standard
    // cpu limit = 0.5 for single-threaded programs, which is the case for beginner C programs
    // setting memory-swap to the same value as memory avoids container from using swap memory
    // using --rm to automatically remove the container after it exits
    const dockerCmd = `
        docker run --rm --memory=128mb --memory-swap=128m --cpus='0.5' dcc-runner-dcc_help_testing sh -c '
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
