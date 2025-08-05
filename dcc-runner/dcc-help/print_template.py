#!/usr/bin/python3

import json, re, sys
from string import Template

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
    gen_from_stdin()

def gen_from_stdin():

    info = json.load(sys.stdin)

    user_content = get_user_content(info)
    print(PROMPT["system_content"] + user_content)


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

# returns prefix + delimited compiler error + explanation (if it exists)
def prompt_dcc_compile(info):
    return evaluate_template(PROMPT["compile_user_content"], info)


def prompt_dcc_runtime(info):

    argv = info.get("argv", "")
    data = {**info,"args": " ".join(argv)} if len(argv) > 1 else info
    return evaluate_template(PROMPT["runtime_user_content"], data)

# removes triple backticks, and anything after them.
def delimit(s):
    s = s.strip()

    s = re.sub(r"^\s*```[^\n]*\n", "", s, flags=re.M)

    return s
if __name__ == "__main__":
    main()
