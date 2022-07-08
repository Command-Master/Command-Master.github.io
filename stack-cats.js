var stacks = [];
var selected_stack = 0;
var code_element;
var code = '';
var hist = [];

function load() {
    code_element = document.getElementById('code');
    for (var i = 0; i < 5; i++) {
        stacks.push([]);
        selected_stack++;
    }
    stacks.push([-1].concat(Array.from('Hello, World!').reverse().map(x=>x.charCodeAt(0))));
    for (var i = 0; i < 5; i++) {
        stacks.push([]);
    }
    // stacks.push([-1].concat(Array.from('Apple').reverse().map(x=>x.charCodeAt(0))));
    // console.log(stacks);
    update();
}

function update() {
    hist.push([JSON.parse(JSON.stringify(stacks)), code, selected_stack]);
    var stacks_element = document.getElementById('stacks');
    stacks_element.innerHTML = '';
    for (var stack_ind in stacks) {
        var stack = stacks[stack_ind];
        var stack_element = document.createElement('div');
        stack_element.className = 'stack';
        if (stack_ind == selected_stack) stack_element.className += ' selected-stack';
        stacks_element.appendChild(stack_element);
        for (var elm of stack) {
            var sub_element = document.createElement('div');
            sub_element.className = 'element';
            sub_element.innerText = elm;
            stack_element.appendChild(sub_element);
        }
    }
    code_element.value = code;
}

function update_code() {
    // if (code == code_element.value) return;
    var mcode = code_element.value;
    code = '';
    stacks = []
    selected_stack = 0;
    for (var i = 0; i < 5; i++) {
        stacks.push([]);
        selected_stack++;
    }
    stacks.push([-1].concat(Array.from('Hello, World!').reverse().map(x=>x.charCodeAt(0))));
    for (var i = 0; i < 5; i++) {
        stacks.push([]);
    }
    update();
    // return;
    for (var i = 0; i < mcode.length; i++) {
        console.log('processing %s', mcode.charAt(i));
        switch(mcode.charAt(i)) {
            case '^': xor(); break;
            case '_': sub(); break;
            case '<': mup(); break;
            case '>': mdown(); break;
            case '\\': sup(); break;
            case '/': sdown(); break;
            case '[': dup(); break;
            case 'I': cmove(); break;
            case ']': ddown(); break;
            case ':': swap(); break;
            case '!': bnot(); break;
            case '-': neg(); break;
            case '+': lswap(); break;
            case '*': xor1(); break;
            case '|': reverse1(); break;
            case 'T': reverse2(); break;
        }
    }
}

var runupto = 0;
var lastrun = 0;

function slowrun() {
    var mcode = code;
    runupto = 0;
    code = '';
    stacks = []
    selected_stack = 0;
    for (var i = 0; i < 5; i++) {
        stacks.push([]);
        selected_stack++;
    }
    stacks.push([-1].concat(Array.from('Hello, World!').reverse().map(x=>x.charCodeAt(0))));
    for (var i = 0; i < 5; i++) {
        stacks.push([]);
    }
    var add_character = function() { 
        switch(mcode.charAt(runupto)) {
            case '^': xor(); break;
            case '_': sub(); break;
            case '<': mup(); break;
            case '>': mdown(); break;
            case '\\': sup(); break;
            case '/': sdown(); break;
            case '[': dup(); break;
            case 'I': cmove(); break;
            case ']': ddown(); break;
            case ':': swap(); break;
            case '!': bnot(); break;
            case '-': neg(); break;
            case '+': lswap(); break;
            case '*': xor1(); break;
            case '|': reverse1(); break;
            case 'T': reverse2(); break;
        }
        runupto++;
        update();
        if (runupto < mcode.length) lastrun = setTimeout(add_character, 1000);
    };
    clearTimeout(lastrun);
    lastrun = setTimeout(add_character, 1000);
}

function stoprun() {
    clearTimeout(lastrun);
}

function undo() {
    hist.pop(); // remove current
    var last = hist.pop();
    stacks = last[0];
    code = last[1];
    selected_stack = last[2];
    update();
}

function xor() {
    code += '^';
    var stack = stacks[selected_stack];
    stack[stack.length-1] ^= stack[stack.length-2];
    update();
}

function sub() {
    code += '_';
    var stack = stacks[selected_stack];
    stack[stack.length-1] = stack[stack.length-2] - stack[stack.length-1];
    update();
}

function neg() {
    code += '-';
    var stack = stacks[selected_stack];
    stack[stack.length-1] = -stack[stack.length-1];
    update();
}

function bnot() {
    code += '!';
    var stack = stacks[selected_stack];
    stack[stack.length-1] = ~stack[stack.length-1];
    update();
}

function xor1() {
    code += '*';
    var stack = stacks[selected_stack];
    stack[stack.length-1] ^= 1;
    update();
}


function mup() {
    code += '<';
    --selected_stack
    update();
}

function sup() {
    code += '\\';
    var stack = stacks[selected_stack];
    --selected_stack
    stacks[selected_stack + 1] = stacks[selected_stack];
    stacks[selected_stack] = stack;
    update();
}

function mdown() {
    code += '>';
    ++selected_stack
    update();
}

function sdown() {
    code += '/';
    var stack = stacks[selected_stack];
    ++selected_stack
    stacks[selected_stack - 1] = stacks[selected_stack];
    stacks[selected_stack] = stack;
    update();
}



function dup() {
    code += '[';
    var val = stacks[selected_stack].pop();
    stacks[--selected_stack].push(val);
    update();
}

function cmove() {
    code += 'I';
    var val = stacks[selected_stack].pop();
    if (val > 0) {
        stacks[++selected_stack].push(-val);
    } else if (val < 0) {
        stacks[--selected_stack].push(-val);
    } else {
        stacks[selected_stack].push(val);
    }
    update();
}

function ddown() {
    code += ']';
    var val = stacks[selected_stack].pop();
    stacks[++selected_stack].push(val);
    update();
}

function swap() {
    code += ':';
    var val = stacks[selected_stack].pop();
    var val2 = stacks[selected_stack].pop();
    stacks[selected_stack].push(val);
    stacks[selected_stack].push(val2);
    update();
}

function lswap() {
    code += '+';
    var stack = stacks[selected_stack];
    var val1 = stack[stack.length-1];
    var val2 = stack[stack.length-3];
    stack[stack.length-1] = val2;
    stack[stack.length-3] = val1;
    update();
}

function reverse1() {
    code += '|';
    var narr = [];
    var stack = stacks[selected_stack];
    while (stack.length && stack[stack.length - 1]) {
        narr.push(stack.pop());
    }
    stacks[selected_stack] = stack.concat(narr);
    update();
}

function reverse2() {
    code += 'T';
    var stack = stacks[selected_stack];
    stack.reverse();
    while (stack[stack.length - 1] == 0) stack.pop();
    update();
}