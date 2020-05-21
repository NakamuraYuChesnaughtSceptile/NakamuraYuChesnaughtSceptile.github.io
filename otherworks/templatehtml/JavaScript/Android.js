
//Button押下処理
class Button_Push{
    constructor(TextBox_Value,TextBox_Last,Result_Value){
        this.TextBox_Value = TextBox_Value;
        this.TextBox_Last = TextBox_Last;
        this.Result_Value = Result_Value;
    }

    //TextBox内値読み込み
    TextBox_Value_Read(){
        var TextBox_Value;
        TextBox_Value = Input_Result.value;
        return TextBox_Value;
    }
    //TextBoxがnullか
    TextBox_Null_Check(){
        var Null_TF;
        if(this.TextBox_Value_Read() != undefined || this.TextBox_Value_Read() != null){
            Null_TF = true;
        }
        else{
            Null_TF = false;
        }
        return Null_TF;
    }
    //TextBox最後尾の値を取得
    TextBox_Slice(){
        var TextBox_Last;
        TextBox_Last = this.TextBox_Value_Read();
        if(TextBox_Last != null){
            TextBox_Last = TextBox_Last.slice(-1);
        }
        return TextBox_Last;
    }
    //最後尾文字の種類判定
    TextBox_Last_Check(){
        var Last_Type;
        //小数点
        if(this.TextBox_Slice() == "."){
            Last_type = "Dec";
        //数値
        }else if(isNaN(this.TextBox_Slice()) == false){
            Last_Type = "Num";
        //演算子
        }else if(isNaN(this.TextBox_Slice())){
            Last_Type = "Ope";
        }
        return Last_Type;
    }
    //TextBox内の値が0のみか
    TextBox_Zero_Check(){
        var Zero_TF;
        if(this.TextBox_Value_Read() == "0"){
            Zero_TF = true;
        }
        else{
            Zero_TF = false;
        }
        return Zero_TF;
    }

    //小数点より前に値が存在しない場合0.に修正
    DecimalPoint_Fix(){
        if(this.TextBox_Value_Read() == "."){
            this.TextBox_Value = "0.";
            Hidden_Result.value = "0."; 
            return this.TextBox_Value;
        }
    }

}
//数値を入力した場合の処理
class Number_Click extends Button_Push{
    constructor(num){
        super();
        this.key = num;
    }
    Num_Push(){
        this.TextBox_Value_Read();
        if(this.TextBox_Null_Check() == false){
            //nullなので入力数値追加
            this.TextBox_Value = this.key;
            Hidden_Result.value = this.key;
            return this.key;
        }else{
            switch(this.TextBox_Last_Check()){
                //TextBox最後尾が数値
                case 'Num' : this.Switch_Number_Push_N();
                break;
                //TextBox最後尾が演算子
                case 'Ope' : this.Switch_Number_Push_O();
                break;
                //TextBox最後尾が小数点
                case 'Dec' : this.Switch_Number_Push_D();
                break;
            }
            return this.TextBox_Value;
        }
    }
    Switch_Number_Push_N(){
        if(this.TextBox_Zero_Check()){
                this.TextBox_Value = this.key;
                Hidden_Result.value = this.key;
        }else{
                this.TextBox_Value = this.TextBox_Value_Read() + this.key;
                Hidden_Result.value = this.key;
        }
    }
    Switch_Number_Push_O(){
        this.TextBox_Value = this.TextBox_Value_Read() + this.key;
        Hidden_Result.value.value += this.key;
    }
    Switch_Number_Push_D(){
        this.DecimalPoint_Fix();
        this.TextBox_Value = this.TextBox_Value_Read() + this.key;
        Hidden_Result.value += this.key;
    }
}
function Number_Function(number){
    var result = number;
    var Num = new Number_Click(result.value);
    Input_Result.value = Num.Num_Push();
    Hidden_Result.value += String(Input_Result.value).slice(-1);
    console.log(Input_Result.value);
    console.log(Hidden_Result.value);
    this.Result_Value = Input_Result.value;
}

//演算子を入力した場合の処理
class Operator_Push extends Button_Push{
    constructor(ope){
        super();
        this.key = ope;
    }
    Ope_Push(){
        //TextBox取得
        this.TextBox_Value_Read();
        //負数処理
        this.Number_Negative_Check();
        if(this.TextBox_Null_Check() == true){
            switch(this.TextBox_Last_Check()){
                case 'Num' : this.Switch_Operator_Push_N();
                break;
                case 'Dec' : this.Switch_Operator_Push_D();
                break;
                case 'Ope' : this.Switch_Operator_Push_O();
                break;
            }
            console.log(this.TextBox_Last_Check());
            return this.TextBox_Value;
        }else{
            this.TextBox_Value = null;
            return this.TextBox_Value;
        }  
    }
    /* 入力する値を負数として扱うかチェック */
    Number_Negative_Check(){
        var con = $(this);
        var operator = con[0].key;
        if(operator == "－" && this.TextBox_Null_Check() == true){
            this.TextBox_Value = "－";
            Hidden_Result.value = "-";
        }
    }
    Switch_Operator_Push_N(){
        var con = $(this);
        var operator = con[0].key;
        switch(operator){
            case '+' : this.TextBox_Value = operator;
                Hidden_Result.value = "+";
                console.log(this.TextBox_Value);
                console.log(Hidden_Result.value);
                
                break;
            case '-' : this.TextBox_Value = operator;
                Hidden_Result.value += "-";
                console.log(this.TextBox_Value);
                console.log(Hidden_Result.value);
                break;
            case '*' : this.TextBox_Value =  "×";//operatorに変えれば演算できる
                Hidden_Result.value += "*";
                console.log(this.TextBox_Value);
                console.log(Hidden_Result.value);
                break;
            case '/' : this.TextBox_Value = "÷";
                Hidden_Result.value += "/";
                console.log(this.TextBox_Value);
                console.log(Hidden_Result.value);
                break;
        }

    }
    Switch_Operator_Push_O(){
        var con = $(this);
        var operator = con[0].key;
        if(this.TextBox_Last_Check == "Ope"){
            switch(operator){
                case '+' : 
                    this.TextBox_Value = String(this.TextBox_Value).slice(0,-1) + operator;
                    Hidden_Result.value = String(Hidden_Result.value).slice(0,-1) + "+";
                    break;
                case '-' : 
                    this.TextBox_Value = String(this.TextBox_Value).slice(0,-1) + operator;
                    Hidden_Result.value = String(Hidden_Result.value).slice(0,-1) + "-";
                    break;
                case '*' : 
                    this.TextBox_Value = String(this.TextBox_Value).slice(0,-1) + "×";
                    Hidden_Result.value = String(Hidden_Result.value).slice(0,-1) + "*";
                    break;
                case '/' : 
                    this.TextBox_Value = String(this.TextBox_Value).slice(0,-1) + "÷";
                    Hidden_Result.value = String(Hidden_Result.value).slice(0,-1) + "/";
                    break;
                }
        }
    }
    Switch_Operator_Push_D(){
        this.DecimalPoint_Fix();
        this.TextBox_Value = "不正な式です";
    }
    
}

function Operator_Function(operator){
    var OpeResult = operator;
    var Ope = new Operator_Push(OpeResult.value);
    Input_Result.value += Ope.Ope_Push();
}

class Calculation extends Button_Push{
    constructor(){
        super();
    }
    calc(){
        //TextBox内値読み込み
        this.TextBox_Value_Read();
        var Check = this.TextBox_Null_Check();
        console.log(Check);
        //TextBoxがnull以外で演算処理移行
        if(Check == true){
            switch(this.TextBox_Last_Check()){
                //TextBox最後尾が数値の場合演算処理
                case 'Num':
                    console.log("11");
                    console.log(Result_Value);
                    console.log(Hidden_Result.value);
                    this.Text_Value = eval(Result_Value);
                    console.log(this.Text_Value);
                    Hidden_Result.value = this.Text_Value;
                    break;
                //TextBox最後尾が小数点の場合
                case 'Dec' :
                    console.log("22");
                    break;
                //TextBox最後尾が文字列の場合
                case 'Str' :
                    console.log("33");
                    break;
            }
            console.log(Hidden_Result.value);
            return Hidden_Result.value;
        }
    }
}

class Ex_Button extends Button_Push{
    constructor(){
        super();
    }
    DecimalPoint_Click(){
        if(this.TextBox_Last_Check() != "Dec"){
            this.TextBox_Value += ".";
            Hidden_Result.value += ".";
        }
        return this.TextBox_Value;
    }
    Delete_Click(){
        if(this.TextBox_Null_Check != true){
            this.TextBox_Value = Input_Result.value.slice(0,-1);
            Hidden_Result.value = String(Hidden_Result.value).slice(0,-1);
        }
        return this.TextBox_Value;
    }
}


function Point_Click(){
   var Point = new Ex_Button();
   Input_Result.value = Point.DecimalPoint_Click(); 
}

function DELETEClick(){
    var Delete = new Ex_Button();
    Input_Result.value = Delete.Delete_Click();
}

function Equal_Function(){
    console.log(Input_Result.value);
    var Cal = new Calculation();
    Input_Result.value = Cal.calc();
    console.log(Input_Result.value);
}
