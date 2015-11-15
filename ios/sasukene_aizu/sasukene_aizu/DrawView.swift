//
//  DrawView.swift
//  spajam-test2
//
//  Created by 市川 博之 on 2015/07/02.
//  Copyright (c) 2015年 市川 博之. All rights reserved.
//

import Foundation
import UIKit

class DrawView: UIView {    
    let b_title = UIImage(named: "title_box.png")
    
    
    /////////////////
    // 再描画用
    /////////////////
    override func drawRect(rect: CGRect) {
        // バナーの表示
        b_title?.drawInRect(CGRectMake( 0, 0, 768, 100 ))
    }
}