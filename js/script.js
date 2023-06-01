class Calculator {
    operatorsArr = ['+', '-', '*', '/'];

    constructor() {
        this.string = '';
        this.expression = [];
        this.numberStr = '';
        this.result = 0;
        this.toClear = false;

        document.getElementById("result_area").innerText = '0';
    }

    appendNumber(number) {
        if (this.toClear) this.clear(); //очищение после предыдущего результата и вводом нового выражения
        this.toClear = false;

        //if (this.numberStr[0] == '0' && !(this.string.includes('.'))) return; //игнорирование чисел типа 01

        if (this.expression[this.expression.length - 1] == '-') { //замена -num на + -num
            this.expression.pop();
            this.expression.push('+');
            this.numberStr += '-';
        }

        this.string += number;
        document.getElementById("result_area").innerText = this.string;

        this.numberStr += number;
    }

    appendOperation(operator) {
        if (this.numberStr[this.numberStr.length - 1] == '.') this.return; //для случаев ввода чисел типа 1.
        if (this.numberStr != '') this.expression.push(this.numberStr);
        this.numberStr = '';

        if (this.result != 0) {
            document.getElementById("expression_string").innerText = document.getElementById("expression_string").textContent + ' ' + this.result;
            this.expression.push(this.result);
        }
        this.toClear = false;

        if (this.operatorsArr.includes(this.expression[this.expression.length - 1])) { //если оператор уже введен
            this.expression.pop();
            this.string = this.string.substring(0, this.string.length - 2);
            //this.string = this.expression.join(' ');
        }

        this.string += ' ' + operator + ' ';
        document.getElementById("result_area").innerText = this.string;

        this.expression.push(operator);

        console.log(this.expression);
    }

    appendPoint() {
        if (this.toClear) this.clear(); //очищение после предыдущего результата и вводом нового выражения
        this.toClear = false;
        console.log("num: "+this.numberStr);
        if (this.numberStr.includes('.')) return;

        if (this.numberStr == '') {
            this.string += '0';
            this.numberStr += '0';
        }
        this.numberStr += '.';
        this.string += '.';
        document.getElementById("result_area").innerText = this.string;

        console.log(this.expression);

    }

    appendEqual() {
        if (this.expression.length < 2) return; //проверка выражения на одно число
        
        if (this.numberStr == '') return; //проверка на выражение типа 5/
        
        this.expression.push(this.numberStr);

        console.log("expression: " + this.expression);
        
        if (this.expression[this.expression.length - 2] == '/') //деление на ноль
            if (this.expression[this.expression.length - 1] == 0) {
                this.expression.pop();
                return;
            }

        document.getElementById("expression_string").innerText = this.string + " =";
        this.updateResult();
        document.getElementById("result_area").innerText = this.result;
        this.toClear = true;
        this.expression = [];
    }

    clear() {
        this.expression = [];
        document.getElementById("result_area").innerText = '0';

        if (this.string == "") document.getElementById("expression_string").innerText = ""; //очищение истории
        else if (this.result != 0)
            document.getElementById("expression_string").innerText = document.getElementById("expression_string").textContent + ' ' + this.result;
        
        this.result = 0;
        this.string = "";
        this.numberStr = ""
    }

    updateResult() {
        if (!(this.expression.includes('+') || this.expression.includes('-')
            || (this.expression.includes('*') || this.expression.includes('/')))) return;
        
        let array = this.expression;
        let tempRes = parseFloat(array[0]);
        let operator = "";

        console.log(this.expression);

        while (this.expression.length != 1) {
            let indDiv = this.expression.indexOf("/");
            let indMult = this.expression.indexOf("*");

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
        }

        tempRes = this.expression[0];


        this.result = tempRes;
        this.string = tempRes;
        this.expression = [];
        this.numberStr = "";
        this.expression.push(tempRes);
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
        }
        this.expression.splice(startInd, endInd - startInd + 1, res);
    }

}

calculator = new Calculator();
