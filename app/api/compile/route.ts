import { NextRequest, NextResponse } from 'next/server'
import { runUserCodeInDocker } from '@/lib/dockerRunner'

const MAX_SOURCE_LEN = Number(process.env.MAX_SOURCE_LEN) || 10000;
const MAX_STDIN_LEN = 100;

export async function POST(req: NextRequest) {
    let source, stdin;
    try {
       ({ source, stdin = "" } = await req.json());
    } catch (error:any) {
        return NextResponse.json(
            // This error message could be better.
            { error: `Invalid POST request body` },
            { status: 400 }
        )
    }

    if (!source || typeof source !== "string") {
        return NextResponse.json({ error: "Source code is required" }, { status: 400 })
    }
    if (source.length > MAX_SOURCE_LEN) {
        return NextResponse.json(
            { error: `Source code too long. Max length is ${MAX_SOURCE_LEN} characters.` },
            { status: 400 }
        )
    }
    if (stdin.length > MAX_STDIN_LEN) {
        return NextResponse.json(
            { error: `Stdin input too long. Max length is ${MAX_STDIN_LEN} characters.` },
            { status: 400 }
        )
    }

    try {
        const result = await runUserCodeInDocker(source, stdin)
        return new NextResponse(result)
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
}

