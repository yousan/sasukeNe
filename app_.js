$(function() {
    //var client_key = window.prompt("クライアントキーを入力してください", "");
    //if (cleint_key == '') {
    //alert("クライアントキーが入力されていませんので利用できません");
    //return false;
//}
    // ニフティクラウド mobile backendを初期化しています
    //var appKey = '13360fefc1897799bf3f72057c063d6e3f8dbfa8bf335108658477303acdb95b';
    //var client_key = "d14a9387e0c9fcc5e8e0e434efb368de38c338e5282b027999b10b59326b337f";

    //NCMB.initialize("APPLICATION_KEY", client_key);
    //NCMB.initialize(appKey, client_key);

    var appKey    = "13360fefc1897799bf3f72057c063d6e3f8dbfa8bf335108658477303acdb95b";
    var clientKey = "d14a9387e0c9fcc5e8e0e434efb368de38c338e5282b027999b10b59326b337f";

    ///// Called when app launch
    $(function() {
        NCMB.initialize(appKey, clientKey);
    });

    $("form--").on('submit', function(e) {
        var TestClass = NCMB.Object.extend("TestClass");
        var testClass = new TestClass();
        testClass.set("message", "Hello, NCMB!");
        testClass.save(null, {
            success: function (savedObject) {
                // 保存完了後に実行される
                alert("New object created with objectId: " + savedObject.id);
            },
            error: function (savedObject, error) {
                // エラー時に実行される
                alert("Failed to create new object, with error code: " + error.message);
            }
        });
    });

    // フォームの送信時のイベントを取得しています
    $("form").on("submit", function(e) {
        var message;
        e.preventDefault();
        message = $("#message").val();

        // ここからがプッシュ作成処理になります
        NCMB.Push.send({
            message: message,
            immediateDeliveryFlag: true,
            target: ['ios'], // 今回はiOS限定としています。Androidも追加する場合は 'android'を配列の要素に追加します
            searchCondition: {}
        }).then(function(e) {
            // 処理がうまくいった場合はこちら
            $(".message").addClass("alert alert-success").html("作成されました");
            setTimeout(function(e) {
                $(".message").removeClass("alert alert-success").html("");
            }, 3000);
        }, function(e) {
            // エラーだった場合はこちら
            console.error("error", e);
        });
    });
});
