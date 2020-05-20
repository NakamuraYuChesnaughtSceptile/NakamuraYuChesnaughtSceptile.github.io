
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
        TextBox_Value = document.getElementById("TextBox_Value");
        return TextBox_Value;
    }
    //TextBoxがnullか
    TextBox_Null_Check(){
        var Null_TF;
        if(this.TextBox_Value_Read() != "undefined"){
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
            Last_type = Dec;
        //数値
        }else if(isNaN(this.TextBox_Slice()) == false){
            Last_Type = "Num";
        //演算子
        }else if(isNaN(this.TextBox_Slice())){
            Last_Type = "Str";
        }
        return Last_Type;
    }
    //TextBox内の値が0のみか
    TextBox_Zero_Check(){
        var Zero_TF;
        if(this.TextBox_Value_Read() == 0){
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
            this.Result_Value = "0."; 
            return this.TextBox_Value,this.Result_Value;
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
        if(this.TextBox_Null_Check() == true){
            //nullなので入力数値追加
            this.TextBox_Value = Number.value;
            this.Result_Value = Number.value;
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
                this.TextBox_Value = Number.value;
                this.Result_Value = Number.value;
        }else{
                this.TextBox_Value = this.TextBox_Value_Read() + Number.value;
                this.Result_Value += Number.value;
        }
    }
    Switch_Number_Push_O(){
        this.TextBox_Value = this.TextBox_Value_Read() + Number.value;
        this.Result_Value += Number.value;
    }
    Switch_Number_Push_D(){
        this.DecimalPoint_Fix();
        this.TextBox_Value = this.TextBox_Value_Read() + Number.value;
        this.Result_Value += Number.value;
    }
}
function Number_Function(number){
    var result = number;
    var Num = new Number_Click(result.value);
    Input_Result.value += Num.Num_Push();
    this.Result_Value = Input_Result.value;
    console.log(this.Result_Value);
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
        if(this.TextBox_Null_Check() != false){
            switch(this.TextBox_Last_Check()){
                case 'Num' : this.Switch_Operator_Push_N();
                break;
                case 'Dec' : this.Switch_Operator_Push_D();
                break;
                case 'Ope' : this.Switch_Operator_Push_O();
                break;
            }
            return this.TextBox_Value;
        }else{
            return this.TextBox_Value;
        }   
    }
    /* 入力する値を負数として扱うかチェック */
    Number_Negative_Check(){
        var con = $(this);
        var operator = con[0].key;
        if(operator == "－" && this.TextBox_Null_Check() == true){
            this.TextBox_Value = "－";
            this.Result_Value = "-";
        }
    }
    Switch_Operator_Push_N(){
        var con = $(this);
        var operator = con[0].key;
        switch(operator){
            case '+' : this.TextBox_Value = operator;
                this.Result_Value += "+";
                console.log(this.TextBox_Value);
                console.log(this.Result_Value);
                
                break;
            case '-' : this.TextBox_Value = operator;
                this.Result_Value += "-";
                console.log(this.TextBox_Value);
                console.log(this.Result_Value);
                break;
            case '*' : this.TextBox_Value =  operator;
                this.Result_Value += "*";
                console.log(this.TextBox_Value);
                console.log(this.Result_Value);
                break;
            case '/' : this.TextBox_Value = operator;
                this.Result_Value += "/";
                console.log(this.TextBox_Value);
                console.log(this.Result_Value);
                break;
        }

    }
    Switch_Operator_Push_O(){
        var con = $(this);
        var operator = con[0].key;
        if(this.TextBox_Last_Check == "Ope"){
            switch(operator){
                case '+' : 
                    this.TextBox_Value = operator;
                    this.Result_Value += "+";
                    break;
                case '-' : this.TextBox_Value = operator;
                    this.Result_Value += "-";
                    break;
                case '*' : this.TextBox_Value =  operator;
                    this.Result_Value += "*";
                    break;
                case '/' : this.TextBox_Value = operator;
                    this.Result_Value += "/";
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
                    this.Text_Value = eval(Result_Value);
                    console.log(this.Text_Value);
                    this.Result_Value = this.Text_Value;
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
            console.log(this.Result_Value);
            return this.Result_Value;
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
            this.Result_Value += ".";
        }
        return this.TextBox_Value;
    }
    Delete_Click(){
        if(this.TextBox_Null_Check != true){
            this.TextBox_Value = this.TextBox.Value.slice(0,-1);
            this.Result_Value = this.Result_Value.slice(0,-1);
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
