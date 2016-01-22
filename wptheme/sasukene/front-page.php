<?php
/**
 * Created by PhpStorm.
 * User: yousan
 * Date: 10/20/15
 * Time: 4:30 PM
 */

get_header('register'); ?>
<div id="primary" class="content-area">
  <main id="main" class="site-main" role="main">

    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
      <?php
// Post thumbnail.
      twentyfifteen_post_thumbnail();
      ?>
      <header class="entry-header">
        <h1 class="entry-title">さすけねってなぁに？</h1>
      </header><!-- .entry-header -->
      <div class="entry-content">

        <p>TEL：050-3131-8632</p>
        <h2>1. 電話で除雪してほしい場所を連絡！</h2>
        <p>　　案内が流れたら自分の電話番号をプッシュ！<br>
          ※電話番号が登録されていない場合は、郵便番号をプッシュしてね。</p>

        <h3>2. Webで積雪情報が見られるよ！</h3>
        <p>　　マップを拡大したりして見てね<br>
          　　通報した場所に注意がでるよ！</p>
        <p>&nbsp;</p>
        <h2>3. メールでお知らせ！</h2>
        <p>　除雪を協力してくれる人にメールでお知らせ。<br>
          　地域の人（白虎隊）が助けに来てくれるよ。</p>
        <p>&nbsp;</p>
        <h2>4. あなたも白虎隊に！</h2>
        <p>　　白虎隊登録をして地域の人を助けに行こう<br>
          　　戊辰戦争2.0の画面で地域ごとの功績が見られるよ！<br>
        </p>
          <div class="to_register"><a href="/register/">電話番号を登録!</a></div>
      </div><!-- .entry-content -->
    </article><!-- #post-## -->
  </main><!-- .site-main -->
</div><!-- .content-area -->

<?php get_footer(); ?>
