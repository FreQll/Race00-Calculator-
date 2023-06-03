class Calculator {
    operatorsArr = ['+', '-', '*', '/', '^'];

    constructor() {
        this.string = '0';
        this.expression = [0];
        this.result = 0;
        this.toClear = false;
        this.menuOpen = false;

        document.getElementById("result_area").innerText = '0';
        document.getElementById("expression_string").innerText = '';
    }

    appendNumber(number) {
        if (this.toClear) {
            this.clear(); //очищение после предыдущего результата и вводом нового выражения
            this.expression = [];
        }
        this.toClear = false;
        console.log(this.expression);

        if (this.expression.length == 1 && (this.expression[0] == '0')) this.expression.pop();

        if (this.expression.length > 0 && !this.operatorsArr.includes(this.expression[this.expression.length - 1])) {
            number = this.expression[this.expression.length - 1].toString() + number.toString();
            this.expression.pop();
        }

        this.expression.push(number.toString());

        this.expressionToString()
    }

    appendOperation(operator) {
        this.toClear = false;
        if (this.operatorsArr.includes(this.expression[this.expression.length - 1])) { //если оператор уже введен
            this.expression.pop();
            this.string = this.string.substring(0, this.string.length - 2);
        }

        this.expression.push(operator);
        this.expressionToString()
    }

    appendPoint() {
        if (this.toClear) this.clear(); //очищение после предыдущего результата и вводом нового выражения
        this.toClear = false;
        
        if (this.expression.length == 0) this.expression.push(this.result.toString())
        if (this.expression[this.expression.length - 1].toString().includes('.')) return;

        let number = '';
        if (this.expression.length > 0 && !this.operatorsArr.includes(this.expression[this.expression.length - 1])) {
            number = this.expression[this.expression.length - 1].toString() + '.';
            this.expression.pop();
        }

        document.getElementById("result_area").innerText = this.string;
        this.expression.push(number.toString());
        this.expressionToString();
    }

    appendPercent() {
        if (this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        let num = this.expression[this.expression.length - 1];
        let res = num / 100;

        this.expression.pop();
        this.expression.push(res);
        this.expressionToString();

        document.getElementById("result_div").scrollTop = document.getElementById("result_div").scrollHeight;
    }

    appendSign() {
        if (this.expression.length == 1) {
            if (this.expression[0] == 0) return;
            else {
                let temp = this.expression[0];
                this.expression.pop();
                this.expression.push('0');
                this.expression.push('-')
                this.expression.push(temp.toString());
            }
        }
        else if (this.expression[this.expression.length - 2] == '-') {
            this.expression[this.expression.length - 2] = '+'
        }
        else if (this.expression[this.expression.length - 2] == '+') {
            this.expression[this.expression.length - 2] = '-'
        }

        this.expressionToString();
    }

    appendEqual() {
        console.log(this.expression);
        
        if (this.expression.length < 3) return; //проверка выражения на одно число
        
        if (this.expression[this.expression.length - 2] == '/') //деление на ноль
            if (this.expression[this.expression.length - 1] == 0) {
                return;
            }

        document.getElementById("expression_string").innerText = this.string + " =";
        this.updateResult();
        document.getElementById("result_area").innerText = this.result;

        if (document.getElementById("expression_string").innerText.length > 13) document.getElementById("expression_string").style.fontSize = '20px';
        else document.getElementById("expression_string").style.fontSize = '30px';

        this.toClear = true;

        document.getElementById("result_div").scrollTop = document.getElementById("result_div").scrollHeight;
    }

    appendDelete() {
        console.log(this.expression);
        if (this.expression.length == 1) {
            if (this.expression[0] == '0') return;
            else if (this.expression[0].length == 1) {
                this.expression[0] = '0';
                this.expressionToString();
                return;
            }
        }

        if (this.operatorsArr.includes(this.expression[this.expression.length - 1])) {
            this.expression.pop();
        }
        else {
            let lastNum = this.expression[this.expression.length - 1];
            let newNum = lastNum.toString().substring(0, lastNum.length - 1);

            this.expression.pop();
            if (newNum != '') this.expression.push(newNum.toString());
        }

        this.expressionToString();
    }

    clear() {
        document.getElementById("result_area").innerText = '0';

        if (this.string == "0") document.getElementById("expression_string").innerText = ""; //очищение истории
        else if (this.result != 0)
            document.getElementById("expression_string").innerText = document.getElementById("expression_string").textContent + ' ' + this.result;
        
        document.getElementById("result_area").style.fontSize = '30px';
        document.getElementById("result_div").scrollTop = document.getElementById("result_div").scrollHeight;
        
        this.result = 0;
        this.string = "0";
        this.numberStr = "0"
        this.expression = [];
        this.expression.push('0');
    }

    updateResult() {
        if (!(this.expression.includes('+') || this.expression.includes('-')
            || this.expression.includes('*') || this.expression.includes('/')
            || this.expression.includes('^'))) return;
        
        let array = this.expression;
        let tempRes = parseFloat(array[0]);

        console.log(this.expression);

        while (this.expression.length != 1) {
            let indDiv = this.expression.indexOf("/");
            let indMult = this.expression.indexOf("*");

            if (this.expression.indexOf("^") != -1) {
                this.calculate("^");
                console.log(this.expression);
            }

            if ((indDiv < indMult && indDiv != -1) || (indDiv != -1 && indMult == -1)) {
                this.calculate("/");
                console.log(this.expression);
                continue;
            }

            if ((indMult < indDiv && indMult != -1) || (indMult != -1 && indDiv == -1)) {
                this.calculate("*");
                console.log(this.expression);
                continue;
            }

            if (this.expression.indexOf("+") != -1) {
                this.calculate("+");
                console.log(this.expression);
            }

            if (this.expression.indexOf("-") != -1) {
                this.calculate("-");
                console.log(this.expression);
            }
        }

        tempRes = this.expression[0];


        this.result = tempRes;
        this.string = tempRes.toString();
        this.expression = [];
        this.numberStr = "";
        this.expression.push(tempRes.toString());
    }

    calculate(operator) {

        let startInd = this.expression.indexOf(operator) - 1;
        let endInd = this.expression.indexOf(operator) + 1;
        let res;
        
        switch (operator) {
            case ("+"): 
                res = parseFloat(this.expression[startInd]) + parseFloat(this.expression[endInd]);
                break;
            case ("-"): 
                res = parseFloat(this.expression[startInd]) - parseFloat(this.expression[endInd]);
                break;
            case ("*"): 
                res = parseFloat(this.expression[startInd]) * parseFloat(this.expression[endInd]);
                break;
            case ("/"): 
                res = parseFloat(this.expression[startInd]) / parseFloat(this.expression[endInd]);
                break;
            case ("^"):
                res = parseFloat(this.expression[startInd]) ** parseFloat(this.expression[endInd]);
                break;
        }
        this.expression.splice(startInd, endInd - startInd + 1, res);
    }

    expressionToString() {
        this.string = '';
        for (let i = 0; i < this.expression.length; i++) {
            const element = this.expression[i].toString();
            this.string += element;
        }
        document.getElementById("result_area").innerText = this.string;

        if (this.string.length > 13) {
            document.getElementById("result_area").style.fontSize = '20px';
        }
        else document.getElementById("result_area").style.fontSize = '30px';

        document.getElementById("result_div").scrollTop = document.getElementById("result_div").scrollHeight;
    }

    showMessage(message) {
        document.getElementById("result_area").innerText = message;
    }

    //////////////CREATIVE

    factorial() {
        if (this.expression[this.expression.length - 1] < 0
            || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;
        
        let res = 1;
        let num = parseFloat(this.expression[this.expression.length - 1]);

        if (Math.floor(num) - num != 0) {
            document.getElementById("result_area").innerText = "Number must be integer!";
            return;
        }

        for (let i = 1; i <= num; i++) {
            res *= i;
        }
        
        this.expression.pop();
        this.expression.push(res.toString());

        this.expressionToString();
    }


    squareRoot() {
        if (this.expression[this.expression.length - 1] <= 0
            || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        let res = Math.sqrt(this.expression[this.expression.length - 1]);

        this.expression.pop();
        this.expression.push(res.toString());
        
        this.expressionToString();
    }

    exponentiation() {
        this.expression.push("^");
        this.expressionToString();
        this.toClear = false;
    }

    exponentiation2() {
        let res = this.expression[this.expression.length - 1] ** 2;
        this.expression.pop();
        this.expression.push(res.toString());
        this.expressionToString();
        this.toClear = false;
    }

    lg() {
        if (this.expression[this.expression.length - 1] <= 0
        || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        let res = Math.log10(this.expression[this.expression.length - 1]);

        this.expression.pop();
        this.expression.push(res.toString());
        
        this.expressionToString();
    }

    ln() {
        if (this.expression[this.expression.length - 1] <= 0
        || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        let res = Math.log(this.expression[this.expression.length - 1]);

        this.expression.pop();
        this.expression.push(res.toString());
        
        this.expressionToString();
    }

    ///////////LENGHT

    lenghtSm() {
        if (this.expression[this.expression.length - 1] <= 0
            || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        let res = this.expression[this.expression.length - 1] * 100
        
        this.expression.pop();
        this.expression.push(res.toString());
        this.expressionToString();
    }

    squareSm() {
        if (this.expression[this.expression.length - 1] <= 0
            || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        let res = this.expression[this.expression.length - 1] * 100
        res *= res;
        
        this.expression.pop();
        this.expression.push(res.toString());
        this.expressionToString();
    }

    lenghtKm() {
        if (this.expression[this.expression.length - 1] <= 0
            || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        let res = this.expression[this.expression.length - 1] / 1000
        
        this.expression.pop();
        this.expression.push(res.toString());
        this.expressionToString();
    }

    squareKm() {
        if (this.expression[this.expression.length - 1] <= 0
            || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        let res = this.expression[this.expression.length - 1] / 1000
        res *= res;
        
        this.expression.pop();
        this.expression.push(res.toString());
        this.expressionToString();
    }

    hectare() {
        if (this.expression[this.expression.length - 1] <= 0
            || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        let res = this.expression[this.expression.length - 1] / 10000
        
        this.expression.pop();
        this.expression.push(res.toString());
        this.expressionToString();
    }

    //////////WEIGHT

    weightMg() {
        if (this.expression[this.expression.length - 1] <= 0
            || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        let res = this.expression[this.expression.length - 1] * 1000
        
        this.expression.pop();
        this.expression.push(res);
        this.expressionToString();
    }

    weightKg() {
        if (this.expression[this.expression.length - 1] <= 0
            || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        let res = this.expression[this.expression.length - 1] / 1000
        
        this.expression.pop();
        this.expression.push(res);
        this.expressionToString();
    }

    weightT() {
        if (this.expression[this.expression.length - 1] <= 0
            || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        let res = this.expression[this.expression.length - 1] / 1000000
        
        this.expression.pop();
        this.expression.push(res);
        this.expressionToString();
    }

    /////////PROGRAMMER 

    hex() {
        if (this.expression[this.expression.length - 1] <= 0
            || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        if (! parseInt(this.expression[this.expression.length - 1])) {
            document.getElementById("result_area").innerText = "Number must be integer!";
            return;
        }

        let num = parseInt(this.expression[this.expression.length - 1]);
        let hex = num.toString(16);

        this.expression.pop();
        this.expression.push(hex);
        this.expressionToString();
    }

    dec() {

        let num = this.expression[this.expression.length - 1];
        let dec = parseInt(num, 16);

        this.expression.pop();
        this.expression.push(dec.toString());
        this.expressionToString();
    }

    bin() {
        if (this.expression[this.expression.length - 1] <= 0
            || this.operatorsArr.includes(this.expression[this.expression.length - 1])) return;

        if (! parseInt(this.expression[this.expression.length - 1])) {
            document.getElementById("result_area").innerText = "Number must be integer!";
            return;
        }

        let num = parseInt(this.expression[this.expression.length - 1]);
        let bin = num.toString(2);

        this.expression.pop();
        this.expression.push(bin);
        this.expressionToString();
    }

    openMetrics() {
        let metrics_div = document.getElementById("metrics");
        let buttons = document.querySelectorAll(".metrics");

        if (!this.menuOpen) {
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].style.visibility = "visible";
            }
            this.menuOpen = true;
            metrics_div.classList.add('show');
        }
        else {
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].style.visibility = "hidden";
            }
            this.menuOpen = false;
            metrics_div.classList.remove('show');
        }
    }
}

calculator = new Calculator();
