// Understand the problem:
// The task is to create a functioning calculator.
// The final product should have a usable user interface
// and should be able to perform the following functions:
// Do basic calculations between two operands (display the
// current number clicked, the operator with a different 
// background color upon button click, display the next
// number clicked, and display the result of the calculation
// in the output box upon 'equals' button click), perform 
// calculations across results (ex. if the 'equals' button
// is not pressed after one number, an operator, and then
// another number is clicked and another operator is clicked
// after, the result of the two operands and operator that was
// clicked before should appear in the output box as the current 
// number), clear the output box upon 'clear' button click, and
// delete numbers off the output box upon 'delete' button click.
// All of the number calculations should be done without the 
// assistance of functions like eval() and all element changes
// that occur on screen should be the product of event listeners
// and DOM manipulation.

// My pseudocode
// 1. Write a function 'writeToOutput' that takes in an event
//    type argument 'event' and uses it to write a value to the
//    the output. The function should be called every time a number
//    button is clicked and for operators, it should change the
//    background color of the button to be darker, indicating
//    that the operator has been selected for the calculation.
//    The function itself should also be writing the different
//    components of the calculation to some form of storage as it
//    is happening (ex. if a user types '2 + 2', the first operand (2),
//    the operator (+), and the second operand (2) should be recorded
//    somewhere in the form of a string or array declared outside of the
//    function's scope (or return the string/array after function call) so
//    that it can be used in another function that will evaluate it).
// 2. Write a function 'getEvaluatedExpression' that takes in a string/array
//    type argument 'expression' and returns the value that comes from
//    evaluating the expression. The function should be called every time the
//    'equals' button is clicked or when an operator button is clicked when two operands
//    and an operator exist in the variable 'expression' (or whatever will record the
//    values the user inputs) (the clicking of the operator button should evaluate the expression
//    and write the resulting value as the first operand of a new calculation). The function 
//    should only return the value and must not be written to the output box from the function call alone
//    (if the function call to 'getEvaluatedExpression' happens as the 'equals'
//    button is pressed, the function 'writeToOutput' should be written such that
//    it displays the value; in other words, the function 'getEvaluatedExpression'
//    will likely be called from within the function 'writeToOutput').
// 3. Write a function 'clearOutput' that takes in no arguments and clears
//    the output of any numbers or decimals, unselects/changes background color 
//    of the buttons back to a uniform color, and resets the variable 'expression'
//    (or whatever will record the values the user inputs). The function should be 
//    called every time the 'Clear' button is clicked.
// 4. Write a function 'deleteFromOutput' that takes in no arguments and deletes the
//    last entered digit from the output, unselects/changes background color of the
//    buttons back to a uniform color, and removes the last number that was appended to
//    the variable 'expression' (or whatever will record the values that the user inputs).
//    The function should be called every time the 'Delete' button is clicked. If the user
//    clicks the 'Delete' button while still typing the first operand, the last entered digit
//    will be removed from the output and the same from the variable 'expression'. If the user
//    clicks the 'Delete' button after typing the first operand and clicking one of the operator
//    buttons, the last entered digit will be removed from the output, the background color of the 
//    operator button that was clicked will return to the uniform button color, and both the digit
//    and the operator will be removed from the variable 'expression' (or whatever will record the
//    values the user inputs). 
// 5. Add keyboard support to the calculator. Every time a 'keypress' event
//    is fired, check if the key was any of the ones that exist on the keyboard
//    (Ctrl+C should be for the 'Clear' button and Ctrl+D for the 'Delete' button)
//    and call the appropriate function for that key press as the program would for
//    its corresponding button click.

const buttons = document.querySelectorAll('button');
const clearButton = document.querySelector('.clear-button');
const deleteButton = document.querySelector('.delete-button');
const equalsButton = document.querySelector('.equals-button')
const output = document.querySelector('.output');
let isAResult = false;
let expression = ['', '', ''];
let operators = ['+', '-', '*', '/']

function writeToOutput(event) {
    const key = event.target;
    const isOperatorAllowed = !Number.isInteger(key.textContent) && key.textContent != '.' && key.textContent != 'Clear' && key.textContent != 'Delete' && key.textContent != '=' && operators.includes(key.textContent) && expression[1].length == 0;
    const isADigit = key.textContent != '=' && key.textContent != 'Clear' && key.textContent != 'Delete' && !operators.includes(key.textContent);
    if (isOperatorAllowed) {
        expression[1] = key.textContent;
        key.style.cssText = 'background-color: rgba(128, 128, 128, 0.5);'
    } else {
        if (isADigit && expression[1]) {
            expression[2] += key.textContent;
            output.textContent = expression[2];
        }
        else if (isADigit && isAResult) {
            isAResult = false;
            expression[0] = '';
            expression[0] += key.textContent;
            output.textContent = expression[0];
        }
        else if (isADigit) {
            expression[0] += key.textContent;
            output.textContent = expression[0];
        }
    }  
    console.log(expression);
}

buttons.forEach((button) => {
    button.addEventListener('click', writeToOutput)
})

function getEvaluatedExpression(expression) {
    let firstOperand = expression[0];
    let operator = expression[1];
    let secondOperand = expression[2];
    let result;
    if (operator == '+') {
        result = +firstOperand + +secondOperand;
    } else if (operator == '-') {
        result = +firstOperand - +secondOperand;
    } else if (operator == '*') {
        result = +firstOperand * +secondOperand;
    } else {
        result = +firstOperand / +secondOperand;
    }
    return result;
}

function clearOutput() {
    output.textContent = '';
    expression = expression.map((item) => '');
    buttons.forEach((button) => {
        button.style.backgroundColor = ''; 
    });
    isAResult = false;
}

clearButton.addEventListener('click', clearOutput);

function deleteFromOutput() {
    let newOutput = output.textContent.slice(0, output.textContent.length-1);
    output.textContent = newOutput;
    if (expression[0] && expression[1] && expression[2]) {
        expression[2] = output.textContent;
    } else if (expression[0] && expression[1]) {
        expression[0] = output.textContent;
        expression[1] = '';
        buttons.forEach((button) => {
            button.style.backgroundColor = ''; 
        });
    } else if (expression[0]) {
        expression[0] = output.textContent;
    }
}

deleteButton.addEventListener('click', deleteFromOutput);

function evaluateToOutput() {
    let result = getEvaluatedExpression(expression);
    output.textContent = result;
    expression = expression.map((item) => '');
    expression[0] = result;
    buttons.forEach((button) => {
        button.style.backgroundColor = ''; 
    });
    isAResult = true;
}

