var previousButton; //前に押下したボタンを保存するグローバル変数
var numArray = [];  //計算に使う数字の配列
var arithArray = [];//計算に使う演算子の配列

//  ↓呼び出す処理↓

//数字キー
function numberClick(num){
    $('.arithmetic').removeClass('active');//押された後演算子ボタンの色を戻す

    var number = new NumberKey(num);
    var digit = new Digit();

    //画面に対応した桁数は超えていないか
    if(digit.digitProcess()){
        number.number_Pushpush();
    }else if(previousButton=="arithmetic"||previousButton=="equal"){
        number.number_Pushpush();
    }
    
    previousButton　= "number";
}

//AC,Cキー
function clearClick(){
    var clear = new Clear();
    clear.clearProcess();

    previousButton　= "clear";
}

//±キー
function pmClick(){
    var pmProcess = new PlusMinus();
    pmProcess.plusMinusProcess();

    previousButton　= "plusminus";
}

//%キー
function percentClick(){
    var percent = new Percent();    
    percent.percentProcess();

    previousButton　= "percent";
}

//演算子キー
function arithClick(arith){
    $('.arithmetic').removeClass('active');
    $(arith).toggleClass('active');//演算子が押された後色を変える

    var arithmetic = new Arithmetic(arith.name);
    arithmetic.arithmeticProcess();
    previousButton　= "arithmetic";
}

//=キー
function equalClick(){
    $('.arithmetic').removeClass('active');
    var equal = new Calculation();
    equal.calculationProcess();

    previousButton　= "equal";
}
//  ↑呼び出す処理ここまで↑

//全体の処理,格納
class Main{
    //配列に数字を追加
    setNumber(num){
        numArray.push(num.replace(/[^-0-9.]/g, ''));
    }
    
    //配列に演算子を追加
    setArithmetic(arith){
        arithArray.push(arith);
    }

    //数字の配列の最後尾を取得
    getNumberLast(){
        return numArray[numArray.length - 1];
    }

    //演算子の配列の最後尾を取得
    getArithmeticLast(){
        return arithArray[arithArray.length - 1];
    }

    //数字の配列の長さを返す
    getNumberLength(){
        return numArray.length;
    }
    //演算子の配列の長さを返す
    getArithmeticLength(){
        return arithArray.length;
    }

    //配列の初期化
    resetArray(){
        numArray = [];
        arithArray = [];
    }

    //コンマ区切り
    commaSeparated(result){
        return Number(result).toLocaleString(undefined, { maximumFractionDigits: 20 });
    }
}

//数字キー処理
class NumberKey{
    constructor(keynum){
        this.keyNumber = keynum.value;
    }
    number_Pushpush(){
        var window = new displayWindow();
        var clear = new Clear();
        var main = new Main();
        
        var result = window.getResult();

        //押下されたのが0以外の数字か判定
        if(this.keyNumber!=="0"){
            clear.setC();
        }

        //押されたキーが小数点の時の処理
        if(this.keyNumber == "."){
            var pointNum = this.pointProcess(result);
            window.setResult(pointNum);
        }else if(result == "-0"){
            window.setResult(`-${this.keyNumber}`);
        //↓表示されているのが0または、前に押されたのが演算子か=か％かを判定↓
        }else if(result == "0"　||previousButton == "percent"||previousButton=="equal"||previousButton=="arithmetic"){
            window.setResult(this.keyNumber);
        }else{
            var resultMolding = result.replace(/[^0-9.]/g, '');
            result = main.commaSeparated(resultMolding+this.keyNumber);
            window.setResult(result);
        }
    }

    //小数点が連続で打たれない、%,=,演算子を押した後に小数点を押すと0.にする処理
    pointProcess(result){
        var pointNum = result;
        if(previousButton == "percent"||previousButton=="equal"||previousButton=="arithmetic"){
            pointNum = "0.";
        }else if(result.indexOf(".") == -1){
            pointNum = result+".";
        }
        return pointNum;
    }
}

//桁数判定処理
class Digit{
    constructor(){
        this.windowHeight = window.innerHeight;//画面の縦を取得
        this.windowWidth = window.innerWidth;//画面の横を取得
    }
    digitProcess(){
        var window = new displayWindow();
        var result = window.getResult();
        var resultMolding = result.replace(/[^0-9]/g, '');//－や小数点を排除し、数字のみに置き換える
        

        //画面サイズの判定
        if(this.windowHeight > this.windowWidth){
            //縦画面時の桁数判定
            if(resultMolding.length < 9){
                this.fontSizeProcess(resultMolding.length);
                return true;
            }else{
                return false;
            }
            
        }else{
            //横画面時の桁数判定
            if(resultMolding.length < 16){
                return true;
            }else{
                return false;
            }
            
        }
    }

    //文字数が増えたときにフォントサイズを変える処理
    fontSizeProcess(length){
                $('.output').removeClass('resultText1');
                $('.output').removeClass('resultText2');
                $('.output').removeClass('resultText3');
                switch (length){
                    case 6: $('.output').toggleClass('resultText1');
                            break;
                    case 7: $('.output').toggleClass('resultText2');
                            break;
                    case 8: $('.output').toggleClass('resultText3');
                            break;
                }
    }
}

//演算子キー処理
class Arithmetic{
    constructor(keyArith){
        this.keyArithmetic = keyArith;
    }
    arithmeticProcess(){
        var window = new displayWindow();
        var main = new Main();
        var calculation = new Calculation();

        var result = window.getResult();
        var lastArith = main.getArithmeticLast();

        main.setNumber(result);
        if(previousButton == "arithmetic"){
            arithArray.pop();
            main.setArithmetic(this.keyArithmetic);
        }else{ 
            if(this.keyArithmetic == "*"||this.keyArithmetic == "/"){
                if(lastArith == "*" || lastArith == "/"){
                    calculation.calculationProcess();
                }
            }else if(main.getArithmeticLength() >= 2&&previousButton !== "equal"){
                calculation.calculationProcess();
            }
        //配列にセット
            main.setArithmetic(this.keyArithmetic);
        }
    }
}

//±キー処理
class PlusMinus{
    plusMinusProcess(){
        var window = new displayWindow();
        var result = window.getResult();

        if(previousButton == "arithmetic"){
            window.setResult("-0");
        }else if(result.indexOf("-") !== -1){
            window.setResult(result.replace("-",""));
        }else{
            window.setResult(`-${result}`);
        }
    }
}

//%キー処理
class Percent{
    percentProcess(){
        var window = new displayWindow();
        var result = window.getResult();

        var percentNum = result/100;
        window.setResult(percentNum);
    }
}

//AC・Cキー処理
class Clear{
    constructor(){
        var clearData = document.getElementById( "clear" );
        this.clear = clearData.value;
    }
    clearProcess(){
        var main = new Main();
        //ボタンの字の判定
        if(this.clear == "AC"){
            $('.arithmetic').removeClass('active');//ACの時のみ演算子の色をもとに戻す
            main.resetArray();
            result.value = 0;//表示窓の初期化
        }else{
            result.value = 0;
            this.setAC();
        }
    }
    //文字をCに変更
    setC(){
        $('#clear').val('C');
    }
    //文字をACに変更
    setAC(){
        $('#clear').val('AC');
    }
}

//計算処理
class Calculation{
    
    calculationProcess(){
        var main = new Main();
        var window = new displayWindow();
        var lastNum = window.getResult();
        var formula = "";
        var answer = "";

        if(main.getNumberLength() <= 0){
            //何もしない
        }else if(previousButton == "equal"){
            var arrayNumLast = main.getNumberLast();
            var arrayArithLast = main.getArithmeticLast();

            main.resetArray();
            main.setNumber(lastNum);

            main.setNumber(arrayNumLast);
            main.setArithmetic(arrayArithLast);

            formula = this.caluculationRoop(formula);

            answer = eval(formula+main.getNumberLast());
            answer = main.commaSeparated(answer);
            window.setResult(answer);
        }else{
            main.setNumber(lastNum);
            formula = this.caluculationRoop(formula);
            answer = eval(formula+main.getNumberLast());
            answer = main.commaSeparated(answer);
            window.setResult(answer);
        }
    }
    //計算式を作るループ処理
    caluculationRoop(formula){
        for(var i=0;i < arithArray.length;i++){
            formula = formula + numArray[i] + arithArray[i];
        }
        return formula;
    }
}



//表示窓の値取得
class displayWindow{
    constructor(){
        this.displayResult = result.value;
    }
    //表示されている値を返す
    getResult(){
        return this.displayResult;
    }

    //値を設定
    setResult(num){
        result.value = num;
    }
}
