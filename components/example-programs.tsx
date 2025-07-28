export const examplePrograms = {
    "hello-world": {
        name: "Hello World",
        code: `#include <stdio.h>
                    
int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
        stdin: "",
    },
    "input-example": {
        name: "Input Example",
        code: `#include <stdio.h>
                    
int main() {
    int number;
    printf("Enter a number: ");
    scanf("%d", &number);
    printf("\\nYou entered: %d\\n", number);
    return 0;
}`,
        stdin: "42",
    },
    "syntax-error": {
        name: "Syntax Error",
        code: `#include <stdio.h>
                    
int main() {
    printf("Hello, World!\\n"
    return 0;
}`,
        stdin: "",
    },
    "undeclared-variable": {
        name: "Uninitialized Variable",
        code: `#include <stdio.h>
                    
int main() {
    int x;
    printf("The value is: %d\\n", x);
    return 0;
}`,
        stdin: "",
    },
    "division-by-zero": {
        name: "Runtime Warning",
        code: `#include <stdio.h>
                    
int main() {
    int a = 10;
    int b = 0;
    printf("Result: %d\\n", a / b);
    return 0;
}`,
        stdin: "",
    },
    "missing-include": {
        name: "Missing Include Error",
        code: `int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
        stdin: "",
    },
}