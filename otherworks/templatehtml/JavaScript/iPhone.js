//↓グローバル変数ここから↓
var previousButton = []; //前に押下したボタンを保存する配列
var numArray = [];  //計算に使う数字の配列
var arithArray = [];//計算に使う演算子の配列
//↑グローバル変数ここまで↑



//  ↓呼び出す処理↓

//数字キー
function numberClick(num){
    $('.arithmetic').removeClass('active');//押された後演算子ボタンの色を戻す

    var number = new NumberKey(num);
    var digit = new Digit();
    var main = new Main();

    //画面に対応した桁数は超えていないか
    if(digit.digitProcess(formulaText.value,0)){
        number.number_Push();
    }else if(main.getPreviousLast()=="arithmetic"||main.getPreviousLast()=="equal"){
        number.number_Push();
    }
    
    main.setPrevious("number");
}

//AC,Cキー
function clearClick(){
    var clear = new Clear();
    clear.clearProcess();

    new Main().setPrevious("clear");
}

//±キー
function pmClick(){
    var pmProcess = new PlusMinus();
    pmProcess.plusMinusProcess();

    new Main().setPrevious("plusminus");
}

//%キー
function percentClick(){
    var percent = new Percent();    
    percent.percentProcess();

    new Main().setPrevious("percent");
}

//演算子キー
function arithClick(arith){
    $('.arithmetic').removeClass('active');
    $(arith).toggleClass('active');//演算子が押された後色を変える

    var arithmetic = new Arithmetic(arith.name);
    arithmetic.arithmeticProcess();

    new Main().setPrevious("arithmetic");
}

//=キー
function equalClick(){
    $('.arithmetic').removeClass('active');
    var equal = new Calculation();
    equal.calculationProcess();

    new Main().setPrevious("equal");
}
//  ↑呼び出す処理ここまで↑




//↓全体の処理,格納ここから↓
class Main{
    //配列に数字を追加
    setNumber(num){
        numArray.push(" " + num.replace(/[^-0-9.]/g, ''));
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
        previousButton = [];
    }

    //押下したキーを追加
    setPrevious(previous){
        previousButton.push(previous);
    }

    //今まで押下したキー内での検索
    searchPrevious(search){
        return previousButton.indexOf(search);
    }

    //最後に押下したキーの取得
    getPreviousLast(){
        return previousButton[previousButton.length-1];
    }

    //コンマ区切り
    commaSeparated(result){
        return Number(result).toLocaleString(undefined, { maximumFractionDigits: 20 });
    }
}
//↑全体の処理、格納ここまで↑



//↓数字キー処理ここから↓
class NumberKey{
    constructor(keynum){
        this.keyNumber = keynum.value;
    }
    number_Push(){
        var window = new displayWindow();
        var clear = new Clear();
        var main = new Main();
        var digit = new Digit();
        
        var result = window.getFormulaText();

        //押下されたのが0以外の数字か判定
        if(this.keyNumber!=="0"){
            clear.setC();
        }else if(result.indexOf(".") >= 1){
            window.setResult(result+"0");
            window.setFormulaText(result+"0");
            return;
        }

        //押されたキーが小数点の時の処理
        if(this.keyNumber == "."){
            digit.fontSizeRemove();
            var pointNum = this.pointProcess(result);
            window.setResult(pointNum);
            window.setFormulaText(pointNum);

        //表示されているのが-0かの判定
        }else if(result == "-0"){
            digit.fontSizeRemove();
            window.setResult(`-${this.keyNumber}`);
            window.setFormulaText(`-${this.keyNumber}`);

        //↓表示されているのが0または、前に押されたのが演算子か=か％かを判定↓
        }else if(result == "0"　||main.getPreviousLast() == "percent"||main.getPreviousLast()=="equal"||main.getPreviousLast()=="arithmetic"){
            digit.fontSizeRemove();
            window.setResult(this.keyNumber);
            window.setFormulaText(this.keyNumber);
        }else{
            var resultMolding = result.replace(/[^-0-9.]/g, '');
            result = main.commaSeparated(resultMolding+this.keyNumber);
            window.setFormulaText(result);
            result = new Calculation().resultExponentiation(result,1);
            window.setResult(result);
        }
    }

    //小数点が連続で打たれない、%,=,演算子を押した後に小数点を押すと0.にする処理
    pointProcess(result){
        var pointNum = result;
        var main = new Main();
        if(main.getPreviousLast() == "percent"||main.getPreviousLast()=="equal"||main.getPreviousLast()=="arithmetic"){
            pointNum = "0.";
        }else if(result.indexOf(".") == -1){
            pointNum = result+".";
        }
        return pointNum;
    }
}
//↑数字キー処理ここまで↑



//↓桁数判定処理ここから↓
class Digit{
    constructor(){
        this.windowHeight = window.innerHeight;//画面の縦を取得
        this.windowWidth = window.innerWidth;//画面の横を取得
    }

    digitProcess(result,flg){
        var portrait,landscape;
        var resultMolding = result.replace(/[^0-9]/g, '');//－や小数点を排除し、数字のみに置き換える
        
        switch(flg){
            case 0: portrait = 9 ;landscape = 16;break;
            case 1: portrait = 9 ;landscape = 17;break;
        }

        //画面サイズの判定
        if(this.windowSize()&&flg==0){

            //縦画面時の桁数判定
            if(resultMolding.length < portrait){
                this.fontSizeProcess(resultMolding.length);
                return true;
            }else{
                return false;
            }
            
        }else{
            //横画面時の桁数判定
            if(resultMolding.length < landscape){
                return true;
            }else{
                return false;
            }
            
        }
    }

    //縦画面か横画面かを判定
    windowSize(){
        if(this.windowHeight > this.windowWidth){
            return true;
        }else{
            return false;
        }
    }

    //文字数が増えたときにフォントサイズを変える処理
    fontSizeProcess(length){
        this.fontSizeRemove();
                switch (length){
                    case 6: $('.output').toggleClass('resultText1');
                            break;
                    case 7: $('.output').toggleClass('resultText2');
                            break;
                    case 8: $('.output').toggleClass('resultText3');
                            break;
                }
    }

    //上記メソッドで追加したクラスの削除
    fontSizeRemove(){
        $('.output').removeClass('resultText1');
        $('.output').removeClass('resultText2');
        $('.output').removeClass('resultText3');
    }
}
//↑桁数判定処理ここまで↑



//↓演算子キー処理ここから↓
class Arithmetic{
    constructor(keyArith){
        this.keyArithmetic = keyArith;
    }
    arithmeticProcess(){
        var window = new displayWindow();
        var main = new Main();
        var calculation = new Calculation();

        var result = window.getFormulaText();
        var lastArith = main.getArithmeticLast();

        
        this.calculaterReset();
        if(main.getPreviousLast() == "arithmetic"){
            main.setNumber(result);
            arithArray.pop();
            main.setArithmetic(this.keyArithmetic);
        }else{ 
            if(this.keyArithmetic == "*"||this.keyArithmetic == "/"){
                if(lastArith == "*" || lastArith == "/"){
                    calculation.calculationProcess();
                }else{
                    main.setNumber(result);
                }
            }else if(main.getArithmeticLength() >= "1"&&main.getPreviousLast() !== "equal"){
                calculation.calculationProcess();
            }else{
                main.setNumber(result);
            }
            
            main.setArithmetic(this.keyArithmetic);
        }
    }

    //計算がこれ以上続かないもしくは、すでに計算が終わっているか判定
    calculaterReset(){
        var main = new Main();
        if(main.getPreviousLast() !== "equal" && main.searchPrevious("equal") !== -1){
            main.resetArray();
        }
    }
}
//↑演算子キー処理ここまで↑



//↓±キー処理ここから↓
class PlusMinus{
    plusMinusProcess(){
        var window = new displayWindow();
        var result = window.getFormulaText();
        var main = new Main();

        if(main.getPreviousLast() == "arithmetic"){
            window.setResult("-0");
            window.setFormulaText("-0");
        }else if(result.indexOf("-") !== -1){
            window.setResult(result.replace("-",""));
            window.setFormulaText(result.replace("-",""));
        }else{
            window.setResult(`-${result}`);
            window.setFormulaText(`-${result}`);
        }
    }
}
//↑±キー処理ここまで↑



//↓%キー処理ここから↓
class Percent{
    percentProcess(){
        var window = new displayWindow();
        var main = new Main();
        var result = window.getFormulaText();

        if(main.getPreviousLast() == "arithmetic" && (main.getArithmeticLast() == "+"||main.getArithmeticLast() == "-")){
            var percentNum = result*result/100;
            window.setResult(percentNum);
            window.setFormulaText(percentNum);
        }else{
            var percentNum = result/100;
            window.setResult(percentNum);
            window.setFormulaText(percentNum);
        }
    }
}
//↑%キー処理ここまで↑



//↓AC・Cキー処理ここから↓
class Clear{
    constructor(){
        var clearData = document.getElementById( "clear" );
        this.clear = clearData.value;
    }
    clearProcess(){
        var main = new Main();
        var digit = new Digit();
        digit.fontSizeRemove();

        //ボタンの字の判定
        if(this.clear == "AC"){
            $('.arithmetic').removeClass('active');//ACの時のみ演算子の色をもとに戻す
            main.resetArray();
            formulaText.value = 0;
            result.value = 0;//表示窓の初期化
        }else{
            formulaText.value = 0;
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
//↑AC・Cキー処理ここまで↑



//↓計算処理ここから↓
class Calculation{
    calculationProcess(){
        var main = new Main();
        var window = new displayWindow();
        var lastNum = window.getFormulaText();
        var formula = "";
        var answer = "";

        if(main.getNumberLength() <= 0　|| main.getArithmeticLength() <= 0){
            //何もしない
            return;
        }

        if(main.getPreviousLast() == "equal"){
            var arrayNumLast = main.getNumberLast();
            var arrayArithLast = main.getArithmeticLast();

            main.resetArray();
            main.setNumber(lastNum);
            main.setNumber(arrayNumLast);
            main.setArithmetic(arrayArithLast);
        }else{
            main.setNumber(lastNum);
        }

        if(main.getNumberLength() !== main.getArithmeticLength()+1){
            numArray.shift();
            numArray.splice(0,2,numArray[1],numArray[0]);
        }

        formula = this.caluculationRoop(formula);
        answer = eval(formula+main.getNumberLast());
        window.setFormulaText(answer);
        answer = main.commaSeparated(answer);
        answer = this.resultExponentiation(answer,0);
        window.setResult(answer);
            
    }

    //計算式を作るループ処理
    caluculationRoop(formula){
        for(var i=0;i < arithArray.length;i++){
            formula = formula + numArray[i] + arithArray[i];
        }
        return formula;
    }

    //桁数を超えたとき10の何乗かを表示
    resultExponentiation(answer,flg){
        var digit = new Digit();
        if(digit.digitProcess(answer,flg)){
            return answer;
        }else{
            var cnt = 0;
            answer = answer.replace(/[^-0-9.]/g, '');
            for(var i = 0;Math.abs(Math.floor(answer)) >= 9;i++){
                answer = answer/10;
                cnt++;
            }

            //四捨五入する桁数の指定
            if(digit.windowSize()){
                var aaa = Math.pow(10, 5);
            }else{
                var aaa = Math.pow(10, 12);
            }

            //丸め誤差対策
            if(cnt == 0){
                answer = (Math.round(answer*aaa)/aaa);
                return answer;
            }else{
                answer = (Math.round(answer*aaa)/aaa);
                return answer+"e"+cnt;
            }
        }
    }
}
//↑計算処理ここまで↑



//↓表示窓の値取得ここから↓
class displayWindow{
    constructor(){
        this.displayResult = result.value;
        this.hiddenFormula = formulaText.value;
    }

    //値を設定
    setResult(num){
        result.value = num;
    }

    //表示されている値を返す
    getResult(){
        return this.displayResult;
    }

    setFormulaText(num){
        formulaText.value = num;
    }

    getFormulaText(){
        return this.hiddenFormula;
    }
}
//↑表示窓の値取得ここまで↑