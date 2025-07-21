import { NextRequest, NextResponse } from 'next/server'
import { runUserCodeInDocker } from '@/lib/dockerRunner'

export async function POST(req: NextRequest) {
    const { source, stdin = "" } = await req.json()

    if (!source || typeof source !== "string") {
        return NextResponse.json({ error: "Source code is required" }, { status: 400 })
    }

    try {
        const stream = await runUserCodeInDocker(source, stdin)
        return new NextResponse(stream);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
}

