var http = require('http');
var url  = require('url');
var qs   = require('querystring');
var csv  = require('csv');
var fs   = require('fs');

var zip_path = 'latlong.csv';
var zipcode = [];

// NCMB ライブラリ
NCMB = require('./ncmb-latest.min.js').NCMB;
NCMB.initialize("ca1f3967db5fda719243b9ad9b53790fc14c106b7736b99c71ecccb774039e40", 
    "9418db7625f655dcfd5c7df625d8adeee48d6f9d7d565138f227c2632c85c6bb");


// 郵便番号を入手
fs.readFile( zip_path, function(err, sjisBuf) {
    //var buf = sjisBuf;
//    console.log( zip_path + '================');
//    csv.parse(sjisBuf.toString(),{comment:'#'}, function(err, data) {
    csv.parse( sjisBuf.toString(),{comment:'#'}, function(err, data) {
        console.log(err);       
        console.log(data.length);
        zipcode = data;

//        for( var jx = 0; jx < data.length; jx++ ){
//            console.log( data[jx][0], data[jx][1], data[jx][2]); 
//        }
    });
});


/**************************************/
// 適宜テーブル名は変更数
/**************************************/
var SpotClass = NCMB.Object.extend("snow_location");

var query = new NCMB.Query(SpotClass);
var addData = new SpotClass();


/**************************************/
//mobile backend上のデータ検索を実行する
/**************************************/
var server=http.createServer();

server.on('request',function(req,res){
    console.log(req.url);

    var urlInfo = url.parse(req.url);
    var pathname = urlInfo.pathname;

    switch(pathname){
        case '/search':
            ////////////////////
            // 検索用API
            ////////////////////
            var  lat = 37.5288585;      // 設定がなかった時の代表ポイント
            var  lng = 139.8990551;     // 

            if( req.method=='POST' ) {
                console.log( "POST" );
                // POSTの場合
               var body = '';
               req.on('data', function (data) {
                   body +=data;
               });
               req.on('end',function(){
                   
                   var POST =  qs.parse(body);
                   console.log(POST);
               });
            }else if(req.method=='GET'){
                // GETの場合
                console.log( "GET" );

                var url_parts = url.parse(req.url,true);
                console.log(url_parts.query);

                // 緯度経度型であれば登録
                if( ( url_parts.query['lat'] != null ) && ( url_parts.query['long'] != null ) ){
                    lat = Number( url_parts.query['lat'] );
                    lng = Number( url_parts.query['long'] );
                    console.log( "idokeido", lat, lng );
                }else{
                // 郵便番号の場合
                    var localzipcode = 9650000;

                    if( url_parts.query['zipcode'] != null ){
                        console.log( url_parts.query['zipcode'] );
                        localzipcode = url_parts.query['zipcode'];

                        for( var jx = 0; jx < zipcode.length; jx++ ){
                            if( url_parts.query['zipcode'] == zipcode[ jx ][ 0 ]){
                                lat = zipcode[ jx ][ 1 ];
                                lng = zipcode[ jx ][ 2 ];
                                console.log( lat, lng );
                                break;
                            }
                        }
                    }
                }
            }

            /******************/
            // 返却部分
            /******************/
            res.writeHead(200, { 'Content-Type': 'application/json' });
            //位置情報をもとに検索する条件を設
            var geoPoint = new NCMB.GeoPoint(lat,lng);
            // クエリーの条件を決める
            query.withinKilometers("geo", geoPoint, 5);
            //query.equalTo("status", 0 );
            query.greaterThan("Date", retDateValue( -12 ) );
            
            query.find({
                success: function(points) {
                    //$("#result").html("");
                    // 検索が成功した場合の処理
                    var data = [];

                    console.log( points.length );
                    for (var i = 0; i < points.length; i++){
                        var point = points[i];
                        //console.log( "スポット名：" + point.get("name") );

                        data.push({
                            objectId: point.get("objectId"),
                            geo     : point.get("geo"),
                            type    : point.get("type"),
                            status  : point.get("status")
                        });

                    }
                    console.log( JSON.stringify(data) );
                    res.end( JSON.stringify(data) );
                },
                error: function(error) {
                    // 検索に失敗した場合の処理
                    console.log(error.message);
                    res.end(JSON.stringify({ 'err': 'err' }));

                }
            });
            break;
        case '/add':
            /////////////////////
            // 追加登録
            /////////////////////
            console.log( "add" );
            console.log( req.method );
            var addData = new SpotClass();
            
            if(req.method=='GET'){
                // GETの場合
                console.log( "GET" );

                var url_parts = url.parse(req.url,true);
                console.log(url_parts.query);

                if( ( url_parts.query['lat'] != null ) && ( url_parts.query['long'] != null ) &&
                    ( url_parts.query['kind'] != null ) ){
                    ////////////////////////
                    // 緯度経度による登録
                    ////////////////////////
                    var lat = Number( url_parts.query['lat'] );
                    var lng = Number( url_parts.query['long'] );
                    var geo_str = new NCMB.GeoPoint({latitude: lat, longitude: lng})
                    var status  = 0;
                    addData.set("geo", geo_str );
                    addData.set("status", status );
                    addData.set("Date", retDateValue( 0 ) );
                    addData.set("kind", Number(url_parts.query['kind']));
                    addData.save(null, {
                        success: function(addData) {
                            // 保存完了後に実行される
                            console.log("New object created with objectId: " + addData.id);
                        },
                        error: function(addData, error) {
                            // エラー時に実行される
                            console.log("Failed to create new object, with error code: " + error.message);
                        }
                    });


                    console.log( url_parts.query['lat'], url_parts.query['long'], url_parts.query['kind'] );
                }else　if( ( url_parts.query['zipcode'] != null ) && ( url_parts.query['kind'] != null ) ){
                    console.log( url_parts.query['zipcode'], url_parts.query['kind'] );
                    //////////////////////////
                    // 郵便番号の場合
                    //////////////////////////
                    var localzipcode = 9650000;

                    if( url_parts.query['zipcode'] != null ){
                        console.log( url_parts.query['zipcode'] );
                        localzipcode = url_parts.query['zipcode'];

                        var  jx;
                        for( jx = 0; jx < zipcode.length; jx++ ){
                            if( url_parts.query['zipcode'] == zipcode[ jx ][ 0 ]){
                                lat = zipcode[ jx ][ 1 ];
                                lng = zipcode[ jx ][ 2 ];
                                console.log( lat, lng );
                                break;
                            }
                        }

                        // 見つかれば登録する
                        if( jx != zipcode.length ){
                            var lat = Number( lat　);
                            var lng = Number( lng );
                            var geo_str = new NCMB.GeoPoint({latitude: lat, longitude: lng})
                            var status  = 0;
                            addData.set("geo", geo_str );
                            addData.set("status", status );
                            addData.set("Date", retDateValue( 0 ) );
                            addData.set("kind", Number(url_parts.query['kind']));
                            addData.save(null, {
                                success: function(addData) {
                                    // 保存完了後に実行される
                                    console.log("New object created with objectId: " + addData.id);
                                },
                                error: function(addData, error) {
                                    // エラー時に実行される
                                    console.log("Failed to create new object, with error code: " + error.message);
                                }
                            });
                        }
                    }

                }else{
                    // 足りないので、デーア出力しない
                    console.log( "add error" )
                }


            }else if(req.method=='POST'){
                console.log( 'post' );
                var url_parts = url.parse(req.url,true);
                console.log(url_parts.query);

                /////////////////
                // post
                /////////////////
                var body = '';
                req.on('data', function (data) {
                   body +=data;
                });
                req.on('end',function(){
                   var POST =  qs.parse(body);
                   console.log(POST);
                });

            }

            res.end(JSON.stringify({ 'add': '' }));
            break;
        case '/update':
            /////////////////////
            // 追加登録
            /////////////////////
            console.log( "test" );
            var addData = new SpotClass();
            
            if(req.method=='GET'){
                // GETの場合
                console.log( "GET" );

                var url_parts = url.parse(req.url,true);
                console.log(url_parts.query);

                if( ( url_parts.query['lat'] != null ) && ( url_parts.query['long'] != null )  && ( url_parts.query['kind'] != null ) ){
                    ////////////////////////
                    // 緯度経度による登録
                    ////////////////////////
                    var lat = Number( url_parts.query['lat'] );
                    var lng = Number( url_parts.query['long'] );
                    var geo_str = new NCMB.GeoPoint({latitude: lat, longitude: lng})
                    var status  = 1;
                    addData.set("geo", geo_str );
                    addData.set("status", status );
                    addData.set("Date", retDateValue( 0 ) );
                    addData.set("kind", Number(url_parts.query['kind']));
                    addData.save(null, {
                        success: function(addData) {
                            // 保存完了後に実行される
                               console.log("update with objectId: " + addData.id);
                        },
                        error: function(addData, error) {
                            // エラー時に実行される
                            console.log("Failed to update, with error code: " + error.message);
                        }
                    });


                    console.log( url_parts.query['lat'], url_parts.query['long'], url_parts.query['kind'] );
                }else　if( ( url_parts.query['zipcode'] != null ) &6 ( url_parts.query['kind'] != null )  ){
                    console.log( url_parts.query['zipcode'] );
                    //////////////////////////
                    // 郵便番号の場合
                    //////////////////////////
                    var localzipcode = 9650000;

                    if( url_parts.query['zipcode'] != null ){
                        console.log( url_parts.query['zipcode'] );
                        localzipcode = url_parts.query['zipcode'];

                        var  jx;
                        for( jx = 0; jx < zipcode.length; jx++ ){
                            if( url_parts.query['zipcode'] == zipcode[ jx ][ 0 ]){
                                lat = zipcode[ jx ][ 1 ];
                                lng = zipcode[ jx ][ 2 ];
                                console.log( lat, lng );
                                break;
                            }
                        }

                        // 見つかれば登録する
                        if( jx != zipcode.length ){
                            var lat = Number( lat　);
                            var lng = Number( lng );
                            var geo_str = new NCMB.GeoPoint({latitude: lat, longitude: lng})
                            var status  = 1;
                            addData.set("geo", geo_str );
                            addData.set("status", status );
                            addData.set("Date", retDateValue( 0 ) );
                            addData.set("kind", Number(url_parts.query['kind']));
                            addData.save(null, {
                                success: function(addData) {
                                    // 保存完了後に実行される
                                    console.log("update with objectId: " + addData.id);
                                },
                                error: function(addData, error) {
                                    // エラー時に実行される
                                    console.log("Failed to update object, with error code: " + error.message);
                                }
                            });
                        }
                    }

                }else{
                    // 足りないので、デーア出力しない
                    console.log( "update error" )
                }


            }
            break;
    }
}).listen(3000);
console.log('Server is starting');

/**************************************/
// 時間を返す関数
/**************************************/
function retDateValue( sabun ){
    var dateObj = new Date(); //現在の日付と時間のdateObj生成
    var mm = dateObj.getMonth(); 
    var dd = dateObj.getDate();
    var hh = dateObj.getHours();
    var x = sabun; // 26時間後 
    dateObj.setTime(dateObj.getTime() + (x * 3600 * 1000));
    var mm_x = dateObj.getMonth() + 1; 
    var dd_x = dateObj.getDate();
    var hh_x = dateObj.getHours();

    var timestr = dateObj.getYear() + 1900 + ("0" + mm_x ).slice(-2) + ("0" + dd_x ).slice(-2)
                + ("0" + hh_x ).slice(-2) + ("0" + dateObj.getMinutes() ).slice(-2)
                + ("0" + dateObj.getSeconds() ).slice(-2);

    return Number( timestr );
}

