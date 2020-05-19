
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
        if(this.TextBox_Value_Read() != null){
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
            TextBox_Value = "0.";
            return TextBox_Value;
        }
    }

}
//数値を入力した場合の処理
class Number_Click extends Button_Push{
    constructor(){
        super();
    }
    Num_Push(){
        this.TextBox_Value_Read();
        if(this.TextBox_Null_Check()){
            //nullなので入力数値追加
            super.TextBox_Value += Number.value;
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
            return super.TextBox_Value;
        }
    }
    Switch_Number_Push_N(){
        if(this.TextBox_Zero_Check()){
                super.TextBox_Value = document.getElementsByName('Number');
        }else{
                super.TextBox_Value = this.TextBox_Value_Read() + document.getElementsByName('Number');
        }
    }
    Switch_Number_Push_O(){
        this.TextBox_Value = TextBox_Value_Read() + document.getElementsByName('Number');
    }
    Switch_Number_Push_D(){
        DecimalPoint_Fix();
        this.TextBox_Value = TextBox_Value_Read() + document.getElementsByName('Number');
    }
}
function Number_Function(number){
    var result = number;
    var Num = new Number_Click();
    Input_Result.value = Num.Num_Push();
}

//演算子を入力した場合の処理
class Operator_Push extends Button_Push{
    constructor(){
        super();
    }
    Ope_Push(){
        //TextBox取得
        this.TextBox_Value_Read();
        //負数処理
        Number_Negative_Check();
        if(this.TextBox_Null_Check() != false){
            switch(this.TextBox_Last_Check()){
                case 'Num' : Switch_Operator_Push_N();
                break;
                case 'Dec' : Switch_Operator_Push_D();
                break;
                case 'Ope' : Switch_Operator_Push_O();
                break;
            }
            return this.TextBox_Value;
        }   
    }
    /* 入力する値を負数として扱うかチェック */
    Number_Negative_Check(){
        if(document.getElementsByName('oprator') == "-" && this.TextBox_Null_Check()){
            this.TextBox_Value = "-";
        }
    }
    Switch_Operator_Push_N(){
        this.TextBox_Value = this.TextBox_Value += document.getElementsByName('operator');
    }
    Switch_Operator_Push_O(){
        if(TextBox_Value_Read() != "-"){
            this.TextBox_Value = this.TextBox_Value.slice(0,-1) + document.getElementsByName('operator');
        }
    }
    Switch_Operator_Push_D(){
        this.DecimalPoint_Fix();
        this.TextBox_Value = "不正な式です";
    }
    
}

function Operator_Function(){
    var Ope = new Operator_Push();
    TextBox_Value.value = Ope.Ope_Push();
}

class Calculation extends Button_Push{
    constructor(){
        super();
    }
    calc(){
        //TextBox内値読み込み
        this.TextBox_Value_Read();
        Check = TextBox_Null_Check();
        //TextBoxがnull以外で演算処理移行
        if(this.Check != true){
            switch(this.TextBox_Last_Check()){
                //TextBox最後尾が数値の場合演算処理
                case 'Num': super.Result_Value = eval(this.TextBox_Value_Read());
                break;
                //TextBox最後尾が小数点の場合
                case 'Dec' : 
                break;
                //TextBox最後尾が文字列の場合
                case 'Str' :
                break;
            }
            return this.Result_Value;
        }
    }
}

function Equal_Function(){
    var Cal = new Calculation();
    TextBox_Value.value = Cal.calc();
}
function Point_Click(){
    TextBox_Value.value += ".";
}