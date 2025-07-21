#!/usr/bin/python3
#!/usr/bin/env python
# MAX_JSON_BYTES = 1000000

import argparse, json, re, sys
from string import Template
from ollama import chat

MODEL="hf.co/unsloth/gemma-3n-E2B-it-GGUF:Q4_K_M"
DEFAULT_TEMP = 1.0
# MAX_TOKENS = 250



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

# define strict response structure
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
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    parser.add_argument("--dryrun", action="store_true", help="print prompt and exit")
    parser.add_argument("--temperature", default=DEFAULT_TEMP, type=float)
    # parser.add_argument("--template", default="default", choices=Prompts.keys())
    parser.add_argument("--model", default=MODEL)
    # parser.add_argument("--max-tokens", default=MAX_TOKENS, type=int)

    args = parser.parse_args()

    gen_from_stdin(args)


def add_boolean_argument(parser, name, default=False, help=None, **kwargs):
    parser.add_argument(
        f"--{name}", action="store_true", default=default, help=help, **kwargs
    )
    parser.add_argument(
        f"--no-{name}", dest=f"{name.replace('-','_')}", action="store_false"
    )

def gen_from_stdin(args):

    try:
        info = json.load(sys.stdin)
    except json.decoder.JSONDecodeError:
        print("Json parse error:", file=sys.stderr)
        sys.exit(1)

    if "source" not in info and "query" in info:
        info = info["query"]

    # NOTE: some functions use a different version of `info`:
    user_content = get_user_content(info, args)
    query_chatgpt(user_content, info, args)


def get_user_content(info, args):
    implementation = info.get("implementation", "dcc")

    if implementation == "dcc-compile":
        return prompt_dcc_compile(info, args)
    else:
        # implementation == "dcc-runtime":
        return prompt_dcc_runtime(info, args)



def evaluate_template(template: list[str], data):

    def evaluate(s):
        templ = Template(s)
        assert(templ.is_valid())
        vars = templ.get_identifiers()
        mapping = { key: delimit(data[key]) for key in vars if key in data}

        return templ.substitute(mapping) if (len(mapping) == len(vars)) else ""

    return "".join([evaluate(s) for s in template])

# returns prefix + delimited compiler error + explanation (if it exists)
def prompt_dcc_compile(info, args):
    return evaluate_template(PROMPT["compile_user_content"], info)


def prompt_dcc_runtime(info, args):

    argv = info.get("argv", "")
    data = {**info,"args": " ".join(argv)} if len(argv) > 1 else info
    return evaluate_template(PROMPT["runtime_user_content"], data)

# removes triple backticks, and anything after them.
def delimit(s):
    # if s and not s.endswith("\n"):
    s = s.strip()

    s = re.sub(r"^\s*```[^\n]*\n", "", s, flags=re.M)

    return s

def query_chatgpt(user_content, info, args):

    response = chat(
        model=args.model,
        messages=[{"role": "system", "content": PROMPT["system_content"]},
            {"role": "user", "content": user_content},
        ],
        stream=True,
        options={"temperature": args.temperature}
    )
    # print(response.message.content)

    for chunk in response:
        print(chunk['message']['content'], end='', flush=True)

if __name__ == "__main__":
    main()
