document.write("表示する文字列clear");
var previousButton; //前に押下したボタンを保存するグローバル変数
var numArray = [];  //計算に使う数字の配列
var arithArray = [];//計算に使う演算子の配列

//  ↓呼び出す処理↓

//数字キー
function numberClick(num){
    $('.arithmetic').removeClass('active'); //押された後演算子ボタンの色を戻す

    var number = new NumberKey(num);
    var digit = new Digit();

    //画面に対応した桁数は超えていないか
    if(digit.DigitProcess()){
        number.NumberProcess();
    }
    
    previousButton　= "number";
}

//AC,Cキー
function clearClick(namae){
    var clear = new Clear(name.value);
    clear.ClearProcess();

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
    percent.PercentProcess();

    previousButton　= "percent";
}

//演算子キー
function arithClick(arith){
    $('.arithmetic').removeClass('active');
    $(arith).toggleClass('active');
    // 演算子が押された後色を変える

    var arithmetic = new Arithmetic(arith.name);
    arithmetic.arithmeticProcess();
    previousButton　= "arithmetic";
}

//=キー
function equalClick(){
    // $('.arithmetic').removeClass('active');
    var equal = new Calculation();
    equal.calculationProcess();

    previousButton　= "equal";
}
//  ↑呼び出す処理ここまで↑