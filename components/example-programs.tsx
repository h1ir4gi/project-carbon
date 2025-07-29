export const examplePrograms = {
    "use-after-free": {
        name: "Use After Free",
        code: `#include <stdio.h>
#include <stdlib.h>

struct node {
    int val;
    struct node *next;
};

int main() {
    struct node *head = malloc(sizeof(struct node));
    head->val = 5; 
    head->next = NULL;
    free(head);

    printf("Value: %d\\n", head->val);
    return 0;
}`,
        stdin: "",
    },
    "null-pointer-access": {
        name: "NULL Pointer",
        code: `#include <stdio.h>
#include <stdlib.h>

struct node {
    int val;
    struct node *next;
};

int main() {
    struct node *head = NULL;
    head->val = 5; 
    head->next = NULL;

    printf("Value: %d\\n", head->val);
    return 0;
}`,
        stdin: "",
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
    "uninitialized-variable": {
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
        name: "Divide by Zero",
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
        name: "Missing Include",
        code: `int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
        stdin: "",
    },
}