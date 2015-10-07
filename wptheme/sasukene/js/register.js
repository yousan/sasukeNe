function initialize() {
    var Marker;
    var map;
    //var latlng = new google.maps.LatLng(35.658704,139.745408);
    var latlng = new google.maps.LatLng(37.487833244023825, 139.92966413497925);
    // 鶴ヶ城　37.487833244023825, 139.92966413497925
    var opts = {
        zoom: 15,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map
    (document.getElementById("map_canvas"),opts);

//地図クリックイベントの登録
    google.maps.event.addListener(map, 'click',
        function(event) {
            if (Marker){Marker.setMap(null)}
            Marker = new google.maps.Marker({
                position: event.latLng,
                draggable: true,
                map: map
            });
            infotable(Marker.getPosition().lat(),
                Marker.getPosition().lng(),map.getZoom());
            geocode();
            //マーカードラッグイベントの登録
            google.maps.event.addListener(Marker,'dragend',
                function(event) {
                    infotable(Marker.getPosition().lat(),
                        Marker.getPosition().lng(),map.getZoom());
                    geocode();
                });
            //地図ズームチェンジイベントの登録
            google.maps.event.addListener(map, 'zoom_changed',
                function(event) {
                    infotable(Marker.getPosition().lat(),
                        Marker.getPosition().lng(),map.getZoom());
                })
        });
//ジオコーディング
    function geocode(){  var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'location': Marker.getPosition()},
            function(results, status) {
                if (status == google.maps.GeocoderStatus.OK && results[0]){
                    //document.getElementById('id_address').innerHTML =
                    //results[0].formatted_address.replace(/^日本, /, '');
                }else{
                    //document.getElementById('id_address').innerHTML =
                    //"Geocode 取得に失敗しました";
                    //alert("Geocode 取得に失敗しました reason: "
                    //+ status);
                }
            });
    }

//HTMLtagを更新
    function infotable(ido,keido,level){
        document.getElementById('id_lat').value = ido;
        document.getElementById('id_lng').value = keido;
        //document.getElementById('id_level').innerHTML = level;
        updateLatLng();
    }
}
function updateLatLng() {
    (function($){
        // do something
        console.log($('#id_lat').val());
        console.log($('#id_lng').val());
        var latlng = $('#id_lat').val() + ',' + $('#id_lng').val();
        $('#geocode').val(latlng);
    })(jQuery);
}

(function($){
    $(document).ready(function(){
        (function() { // ユーザ名、メールアドレスをかくしてメールアドレスを自動で埋める
            (function() {
                $('label[for=username]').hide(); // ユーザー名のラベル
                $('#log').hide(); // ユーザー名のinput なぜlog...?

                $('label[for=user_email]').hide(); // ユーザー名のラベル
                $('#user_email').hide(); // ユーザー名のinput なぜlog...?
            })();

            $('#phone1').on('change', function(ele) {
                var target_id = $(ele.target).prop('id');
                var target = $('#'+target_id);

                toHankaku(target);
                removeHyphen(target);
                checkPhone(target);

                (function() { // 自動で埋める
                    var phone = this.value;
                    var email = this.value + '@sasukene.info';
                    $('#log').val(phone);
                    $('#user_email').val(email); // ユーザー名のinput なぜlog...?
                    //console.log(ele);
                })();
            });
        })();



        (function() { // 地図の初期化関連
            $('#geocode').attr('readonly', true);
            $('#geocode').parent().attr('id', 'geocode_parent'); // 地図と連動させるためにgeocode_parentで包む
            $('#geocode').hide();
            jQuery('#map_canvas').appendTo('#geocode_parent');
            initialize();
        })();

        (function() { // 地図の初期化関連
            $('#geocode').attr('readonly', true);
            $('#geocode').parent().attr('id', 'geocode_parent'); // 地図と連動させるためにgeocode_parentで包む
            $('#geocode').hide();
            jQuery('#map_canvas').appendTo('#geocode_parent');
            initialize();
        })();

        $('#phone1').val('０１２３４').trigger('change');

    });

    (function() {
            //jQuery('input[type=text]').each(function(i){
        jQuery('input[type=text]').each(function(i){
            var ele;
            if (ele = $(this).attr('id').match(/^phone/)) {
                console.log(ele.input); // phone1など
                var parent_id = ele.input + '_parent';
                var bad = $('<div>')
                    .attr('id', ele.input+'_bad')
                    .attr('class', 'badvalue')
                    .html('電話番号の形式が間違っているようです。ハイフン無しの数字で入力してください。');
                $(this).parent().attr('id', parent_id);
                bad.appendTo('#'+parent_id);
                bad.hide();
                console.log(ele);
            }
            //$(this);
        });

        //for(var i=1; i<10; i++){
        //    var ele = $('#phone'+ i);
        //    console.log(ele);
        //    if (ele) {
        //        var parent_id = 'phone'+i+'_parent';
        //        var bad = $('<div>').attr('class', 'badvalue').html('電話番号の形式が間違っているようです。ハイフン無しの数字で入力してください。');
        //        ele.parent().attr('id', parent_id);
        //        bad.appendTo('#'+parent_id);
        //    }
        //}
        //var bad = $('<div>').attr('class', 'badvalue').html('電話番号の形式が間違っているようです。ハイフン無しの数字で入力してください。');
        //$('#phone1').parent().attr('id', 'phone1_parent');
        //bad.appendTo('#phone1_parent');

    })();

})(jQuery);


function toHankaku(target) {
    // zenkaku -> hankaku
    // thanks! http://qiita.com/konweb/items/bdff25e7994f8014adcf
    var han = target.val().replace(/[Ａ-Ｚａ-ｚ０-９]/g,function(s){return String.fromCharCode(s.charCodeAt(0)-0xFEE0)});
    if(target.val().match(/[Ａ-Ｚａ-ｚ０-９]/g)){
        console.log(target.val());
        console.log(han);
        target.val(han);
    }
}

function removeHyphen(ele) {
    ele.val(ele.val().replace(/-/g, '')); // ハイフンを取り除く
}

function checkPhone(ele) {
    (function ($){
        if(ele.val().match(/^[0-9]+$/)) { // 電話番号形式だった
            return true;
        } else { // 形式が間違っていた
        }
    })(jQuery);
}