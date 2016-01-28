// This is a JavaScript file

$(function(){
    //起動時にmobile backend APIキーを設定
    NCMB.initialize('13360fefc1897799bf3f72057c063d6e3f8dbfa8bf335108658477303acdb95b',
        'd14a9387e0c9fcc5e8e0e434efb368de38c338e5282b027999b10b59326b337f');
});

$('.btn').on('submit', function(e){
    console.log('hoge');
    var current = new CurrentPoint();
    current.geopoint.latitude  = 37.50484175;
    current.geopoint.longitude = 139.9230243;
    current.distance = 5;
    search(current);
});
$('.btn').on('click', function(e){
    console.log('hoge');
    search();
});

//位置情報取得に成功した場合のコールバック
var onSuccess = function(position){
    var current = new CurrentPoint();
    current.distance = CurrentPoint.distance;   //検索範囲の半径を保持する    
    current.geopoint = position.coords;         //位置情報を保存する
    search(current);
};

//位置情報取得に失敗した場合のコールバック
var onError = function(error){
    console.log("現在位置を取得できませんでした");
};

//位置情報取得時に設定するオプション
var option = {
    timeout: 6000   //タイムアウト値(ミリ秒)
};

//現在地を取得する
function find(){
    CurrentPoint.distance = 5; //検索距離を5kmに設定
    navigator.geolocation.getCurrentPosition(onSuccess, onError, option);
}

//現在地を保持するクラスを作成
function CurrentPoint(){
    geopoint=null;  //端末の位置情報を保持する
    distance=0;     //位置情報検索に利用するための検索距離を指定する
}

//mobile backendから位置情報を検索するメソッド
function search(current){
    //var current.geopoint = new NCMB.GeoPoint(35.707438,139.774632);
    //位置情報を検索するクラスのNCMB.Objectを作成する
    var SasukeneClass = NCMB.Object.extend("sasukene");

    //NCMB.Queryを作成
    var query = new NCMB.Query(SasukeneClass);
    //位置情報をもとに検索する条件を設定
    //var geoPoint = new NCMB.GeoPoint(current.geopoint.latitude,current.geopoint.longitude);
    //var geoPoint = new NCMB.GeoPoint(current.geopoint.latitude,current.geopoint.longitude);
    //var geoPoint = new NCMB.GeoPoint('35.70743','139.774632');
    var geoPoint = new NCMB.GeoPoint(35.70743,139.774632);
    query.withinKilometers("geo", geoPoint, 5);

    //mobile backend上のデータ検索を実行する
    query.find({
        success: function(points) {
            $("#result").html("");
            // 検索が成功した場合の処理
            for (var i = 0; i < points.length; i++){
                var point = points[i];
                $("#result").append("<p>スポット名：" + point.get("name") + "</p>");
            }
        },
        error: function(error) {
            // 検索に失敗した場合の処理
            console.log(error.message);
        }
    });
}

//スポットを登録する
function saveSpot(){
    //位置情報が取得できたときの処理
    var onSuccess = function (location){
        
        //記事内容を取得
        var title = $("#name").val();
        
        //位置情報オブジェクトを作成
        var geoPoint = new NCMB.GeoPoint(location.coords.latitude, location.coords.longitude);
        
        //Spotクラスのインスタンスを作成★
        
        //値を設定★
        
        //保存を実行★
        
        //前のページに戻る
        myNavigator.popPage();
    }
    
    //位置情報取得に失敗した場合の処理
    var onError = function(error){
        console.log("error:" + error.message);
    }
    
    var option = {
        timeout: 6000   //タイムアウト値(ミリ秒)
    };
    
    //位置情報を取得
    navigator.geolocation.getCurrentPosition(onSuccess, onError, option);
}
