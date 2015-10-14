//
//  ViewController.swift
//  sasukene_aizu
//
//  Created by 市川 博之 on 2015/09/30.
//  Copyright (c) 2015年 市川 博之. All rights reserved.
//

import UIKit
import MapKit

class ViewController: UIViewController, MKMapViewDelegate, UITextFieldDelegate {
    // MapView.
    var myMapView : MKMapView!
    var snow_pos: CLLocationCoordinate2D!
    
    var g_count = 0

    // タイマー
    var timer = NSTimer()

    // 中心点の緯度経度.
    var llat: CLLocationDegrees = 37.487717
    var llon: CLLocationDegrees = 139.929786
    var snow_lat : [ CLLocationDegrees ] = []
    var snow_lon : [ CLLocationDegrees ] = []
    var icon_kind = 0
    
    // ホスト(必要なホスト名に変えてください)
    var HostName = "http://localhost:3000/"
    
    // 郵便番号リスト
    var zipcodeArray = [String]()   // zipcodeリスト
    
    // テキスト入力欄
    private var zipTextField: UITextField!
    // Labelを作成.
    var myLabel: UILabel = UILabel(frame: CGRectMake(0,0,200,50))
    
    /******************************/
    //
    /******************************/
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // 郵便番号リスト取り込み
        zipcodeArray = csvLoad("latlong")
        
        //
        snow_pos = CLLocationCoordinate2DMake(37.487717, 139.929786)
        
        // Do any additional setup after loading the view, typically from a nib.
        // MapViewの生成.
        myMapView = MKMapView(frame: CGRectMake(0, 100, self.view.frame.size.width, self.view.frame.size.height ))
        
        ////////////////////////////
        // UITextFieldを作成する.
        zipTextField = UITextField(frame: CGRectMake(0,0,200,50))
        // 表示する文字を代入する.
        zipTextField.text = "9650031"
        // Delegateを設定する.
        zipTextField.delegate = self
        // 枠を表示する.
        zipTextField.borderStyle = UITextBorderStyle.RoundedRect
        // UITextFieldの表示する位置を設定する.
        zipTextField.layer.position = CGPoint(x:250,y:50);
        // Viewに追加する.
        self.view.addSubview(zipTextField)
        
        /////////////////////////////
        // 背景をオレンジ色にする.
        myLabel.backgroundColor = UIColor.whiteColor()
        // 枠を丸くする.
        myLabel.layer.masksToBounds = true
        // コーナーの半径.
        myLabel.layer.cornerRadius = 20.0
        // Labelに文字を代入.
        myLabel.text = "移動"
        // 文字の色を白にする.
        myLabel.textColor = UIColor.blackColor()
        // 文字の影の色をグレーにする.
        myLabel.shadowColor = UIColor.grayColor()
        // Textを中央寄せにする.
        myLabel.textAlignment = NSTextAlignment.Center
        // 配置する座標を設定する.
        myLabel.layer.position = CGPoint(x:500,y:50)
        // Viewの背景色を青にする.
        self.view.backgroundColor = UIColor.cyanColor()
        // ViewにLabelを追加.
        self.view.addSubview(myLabel)
        
        
        // MapViewのサイズを画面全体に.
        //myMapView.frame = self.view.bounds
        
        // Delegateを設定.
        myMapView.delegate = self
        
        // MapViewをViewに追加.
        self.view.addSubview(myMapView)
        
        // 中心点の緯度経度.
        let myLat: CLLocationDegrees = 37.487717
        let myLon: CLLocationDegrees = 139.929786
        let myCoordinate: CLLocationCoordinate2D = CLLocationCoordinate2DMake(myLat, myLon)
        
        // 縮尺.
        let myLatDist : CLLocationDistance = 1200
        let myLonDist : CLLocationDistance = 1200
        
        // Regionを作成.
        let myRegion: MKCoordinateRegion = MKCoordinateRegionMakeWithDistance(myCoordinate, myLatDist, myLonDist);
        
        // MapViewに反映.
        myMapView.setRegion(myRegion, animated: true)

/****
        // centerを指すアノテーションを生成.
        let myPointAnnotation: MKPointAnnotation = MKPointAnnotation()
        myPointAnnotation.title = "title"
        myPointAnnotation.subtitle = "subtitle"
        myPointAnnotation.coordinate = snow_pos
        
        // mapViewにアノテーションを追加.
        myMapView.addAnnotation(myPointAnnotation)

        let myPointAnnotation2: MKPointAnnotation = MKPointAnnotation()
        myPointAnnotation2.title = "title"
        myPointAnnotation2.subtitle = "subtitle"
        snow_pos = CLLocationCoordinate2DMake(37.486437, 139.929776)
        myPointAnnotation2.coordinate = snow_pos
        myMapView.addAnnotation(myPointAnnotation2)
****/
        // ピンを全部消す
        if let ex = myMapView.annotations {
            myMapView.removeAnnotations(ex)
        }
//        myMapView.removeAnnotation(myMapView.annotations)
        

        // タイマー処理開始
        timer.invalidate()
        timer = NSTimer.scheduledTimerWithTimeInterval( 1, target: self, selector: Selector("update"), userInfo: nil, repeats: true)

    }

    
    //////////////////////////
    // csvデータの取り込み
    //////////////////////////
    func csvLoad(filename :String)->[String]{
        let csvBundle = NSBundle.mainBundle().pathForResource( filename, ofType:"csv")
        
        var encodingError:NSError? = nil
        
        let cvsData = NSString(contentsOfFile: csvBundle!, encoding: NSUTF8StringEncoding, error: &encodingError)!
        
        let lineChange = cvsData.stringByReplacingOccurrencesOfString("\r", withString: "\n")
        let lineChange2 = lineChange.stringByReplacingOccurrencesOfString("\n\n", withString: "\n")
        
        let csvArray:Array = lineChange2.componentsSeparatedByString("\n")
        
        return csvArray
        
    }
    
    
    /*******************************/
    // データの更新
    /*******************************/
    func update(){
        if( g_count % 10 == 0 ){
            // ここでNode.jsを叩く
            var val = self.myMapView.centerCoordinate
            var lat = String(stringInterpolationSegment: val.latitude)      //緯度
            var lon = String(stringInterpolationSegment: val.longitude)     //経度
            
            
            let urlString = HostName + "search?lat=" + lat + "&long=" + lon
            var request = NSMutableURLRequest(URL: NSURL(string: urlString)!)
            
            request.HTTPMethod = "GET"
            
            //println( params )
            var task = NSURLSession.sharedSession().dataTaskWithRequest(request, completionHandler: { data, response, error in
                if (error == nil) {
                    // 返却値の確認
                    var result = NSString(data: data, encoding: NSUTF8StringEncoding)!
                    println(result)
                    var jsondata = result.dataUsingEncoding(NSUTF8StringEncoding)
                    // 配列データに変換
                    let jsonArray = NSJSONSerialization.JSONObjectWithData(jsondata!, options: nil, error: nil) as! NSArray
                    
                    self.snow_lat.removeAll()
                    self.snow_lon.removeAll()
                    
                    for dat in jsonArray {
                        let res:NSDictionary = dat.objectForKey("geo") as! NSDictionary
                        //let kind:NSDictionary = dat.objectForKey("kind") as! NSDictionary
                        var res2: Dictionary = res as Dictionary
                        //lat.append( res2[ "latitude" ] as! CGFloat )
                        //lng.append( res2[ "longitude" ] as! CGFloat )
                        
                        self.snow_lat.append( res2[ "latitude" ] as! CLLocationDegrees )
                        self.snow_lon.append( res2[ "longitude" ] as! CLLocationDegrees )
                        
                        self.icon_kind = dat.objectForKey("kind") as! Int
                        
                        let myPointAnnotation2: MKPointAnnotation = MKPointAnnotation()
                        
                        // kindによりセリフを変える
                        if( self.icon_kind == 1 ){
                            myPointAnnotation2.title = "雪の情報"
                            myPointAnnotation2.subtitle = "雪がたくさんあるよ！"
                        }else{
                            myPointAnnotation2.title = "危険情報"
                            myPointAnnotation2.subtitle = "何か危険があるよ！"
                        }
                        self.snow_pos = CLLocationCoordinate2DMake( res2[ "latitude" ] as! CLLocationDegrees, res2[ "longitude" ] as! CLLocationDegrees )
                        myPointAnnotation2.coordinate = self.snow_pos
                        self.myMapView.addAnnotation(myPointAnnotation2)
                        
                    }
                    
                    println( "nil" )
                } else {
                    println(error)
                    println( "err" )
                }})
            task.resume()
        }
        
        // カウント
        g_count++

    }
    
    /*****************************************/
    // didReceiveMemoryWarning()
    /*****************************************/
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    ////////////////////
    // touch
    ////////////////////
    override func touchesBegan(touches: Set<NSObject>, withEvent event: UIEvent) {
        var drawview = self.view as AnyObject as! DrawView
        //var drawview = self.view as AnyObject
        let touch = touches.first as! UITouch
        var point = touch.locationInView(drawview as! UIView)
        
        // ボタン代わり
        if( ( point.x > 410 ) && ( point.x < 600 ) && ( point.y > 35 ) && ( point.y < 70 ) ){
            print( zipTextField.text )
            
            var ix : Int
            
            for( ix = 0 ; ix < zipcodeArray.count; ix++ ){
                let csvArray:Array = zipcodeArray[ ix ].componentsSeparatedByString(",")

                // 同じ郵便番号があれば移動
                if( csvArray[ 0 ] == zipTextField.text ){
                    // 中心点の緯度経度を再設定

                    var myLat: CLLocationDegrees = ( csvArray[ 1 ] as NSString).doubleValue
                    var myLon: CLLocationDegrees = ( csvArray[ 2 ] as NSString).doubleValue
                    var myCoordinate: CLLocationCoordinate2D = CLLocationCoordinate2DMake(myLat, myLon)
                    
                    myMapView.setCenterCoordinate(myCoordinate, animated: true)
                }
            }
            
        }
    }

    
    /*****************************************/
    // addAnnotation後に実行される.
    /*****************************************/
    func mapView(mapView: MKMapView!, viewForAnnotation annotation: MKAnnotation!) -> MKAnnotationView! {
        
        let myAnnotationIdentifier: NSString = "雪注意"
        let myIdentifier = "雪が積もっているよ"
        
        var myAnnotation: MKAnnotationView!
        
        // annotationが見つからなかったら新しくannotationを生成.
        if myAnnotation == nil {
            //myAnnotation = MKAnnotationView(annotation: annotation, reuseIdentifier: myIdentifier)
            myAnnotation = MKAnnotationView(annotation: annotation, reuseIdentifier: myAnnotationIdentifier as String)
            
            // アノテーションに画像を追加.
            myAnnotation.leftCalloutAccessoryView = UIImageView(image: UIImage(named: "saru-mae"))
            
            // アノテーションのコールアウトを許可.
            myAnnotation.canShowCallout = true
        }
        
        // 画像を選択.
        if( annotation.title == "雪の情報" ){
            // ゆきぼぼ
            myAnnotation.image = UIImage(named: "icon75-yuki.PNG")!
            myAnnotation.annotation = annotation
        }else{
            // 危険
            myAnnotation.image = UIImage(named: "excramethion.PNG")!
            myAnnotation.annotation = annotation
        }
        return myAnnotation
    }
    
    /******************************************/
    // Regionが変更された時に呼び出されるメソッド.
    /******************************************/
    func mapView(mapView: MKMapView!, regionDidChangeAnimated animated: Bool) {
        println("regionDidChangeAnimated")
    }

}

