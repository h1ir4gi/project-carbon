#!/usr/bin/python3

import argparse, json, re, sys
from string import Template

MAX_JSON_BYTES = 1000000
DEFAULT_MODEL="hf.co/Project-Carbon/Gemma3N-E4B-DCCHelp-gguf:Q4_K_M"
DEFAULT_SAMPLE_CONFIG={
    'temperature': 1.0,
    'top_k': 64,
    'top_p': 0.95,
    'min_p': 0.0,
    'repeat_penalty': 1.0,
}

RESPONSE_STRUCTURE='''\
Without providing the solution, give me guidance on how to resolve this error, in the following structure.
# Response Structure
1. Begin with the subheading (# Error Message)
2. Follow with one short sentence, explaining the error message without programming jargon.
3. Next, write the subheading (# Potential Causes)
4. Follow with 1-2 short sentences, identifying and explaining potential issues in my code that may be causing this error.
5. Next, write the subheading (# Hints/Guidance)
6. Follow with 1-2 short sentences, giving debugging hints and guidance. This can include specific references to my code.
'''

PROMPT = {
"system_content": '''\
You explain programming error messages to introductory programming students.
Keep your response short, friendly, and without jargon.
Provide debugging guidance, but do not give the solution in code.
Address your response to the student directly, using the pronoun "you".
Follow the provided response structure.
''',
"compile_user_content": [
'''\
This is my ${language} program
```${language}
${source}
```
''', '''\
Help me understand this message from the C compiler:
```
${compiler_message}
''', '''\
${explanation}
''', '''\
```
''', 
RESPONSE_STRUCTURE
],

"runtime_user_content": [
'''\
This is my ${language} program
```${language}
${source}
```
''', '''\
Help me understand this error:
```
${explanation}
''', '''\
${variables}
''', '''\
${call_stack}
''', '''\
```
''', '''\
This was the command line:
```
${args}
```
''', '''\
It was given this input
```
${stdin}
```
''', 
RESPONSE_STRUCTURE
]
}

def main():
    try:
        main1()
    except KeyboardInterrupt:
        pass
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"can not provide help -  internal error - {e}", file=sys.stderr)
        sys.exit(1)

def main1():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    parser.add_argument("--dryrun", action="store_true", help="print prompt and exit")
    parser.add_argument("--temperature", default=DEFAULT_SAMPLE_CONFIG["temperature"], type=float)
    parser.add_argument("--top-k", default=DEFAULT_SAMPLE_CONFIG["top_k"], type=float)
    parser.add_argument("--top-p", default=DEFAULT_SAMPLE_CONFIG["top_p"], type=float)
    parser.add_argument("--min-p", default=DEFAULT_SAMPLE_CONFIG["min_p"], type=float)
    parser.add_argument("--repeat-penalty", default=DEFAULT_SAMPLE_CONFIG["repeat_penalty"], type=float)
    parser.add_argument("--model", default=DEFAULT_MODEL)

    args = parser.parse_args()

    gen_from_stdin(args)

def gen_from_stdin(args):
    try:
                info = json.loads(sys.stdin.read(MAX_JSON_BYTES))
    except json.decoder.JSONDecodeError:
        print("can not provide help - saved data is invalid", file=sys.stderr)
        sys.exit(1)

    user_content = get_user_content(info)
    prompt = PROMPT["system_content"] + user_content;
    if args.dryrun:
        print(prompt)
    else:
        try: 
            generate_explanation(prompt, args)
        except Exception:
            print("can not provide help - generation model may be unavailable", file=sys.stderr)
            sys.exit(1)


def get_user_content(info):
    implementation = info.get("implementation", "dcc")

    if implementation == "dcc-compile":
        return prompt_dcc_compile(info)
    else:
        return prompt_dcc_runtime(info)



def evaluate_template(template: list[str], data):

    def evaluate(s):
        templ = Template(s)
        assert(templ.is_valid())
        vars = templ.get_identifiers()
        mapping = { key: delimit(data[key]) for key in vars if key in data}

        return templ.substitute(mapping) if (len(mapping) == len(vars)) else ""

    return "".join([evaluate(s) for s in template])


def prompt_dcc_compile(info):
    if (not "compiler_message" in info):
        print("can not provide help - saved data is invalid", file=sys.stderr)
        exit(1)
    return evaluate_template(PROMPT["compile_user_content"], info)


def prompt_dcc_runtime(info):
    if (not "explanation" in info):
        print("can not provide help - saved data is invalid", file=sys.stderr)
        exit(1)
    argv = info.get("argv", "")
    data = {**info,"args": " ".join(argv)} if len(argv) > 1 else info
    return evaluate_template(PROMPT["runtime_user_content"], data)


def delimit(s):
    s = s.strip()

    s = re.sub(r"^\s*```[^\n]*\n", "", s, flags=re.M)

    return s


def generate_explanation(user_content, args):
    from ollama import chat

    response = chat(
        model=args.model,
        messages=[{"role": "system", "content": PROMPT["system_content"]},
            {"role": "user", "content": user_content},
        ],
        stream=True,
        options={
            'temperature': args.temperature,
            'top_k': args.top_k,
            'top_p': args.top_p,
            'min_p': args.min_p,
            'repeat_penalty': args.repeat_penalty,
        }
    )

    for chunk in response:
        print(chunk['message']['content'], end='', flush=True)


if __name__ == "__main__":
    main()
