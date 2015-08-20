
<?php
/**
 * The template for displaying pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that
 * other "pages" on your WordPress site will use a different template.
 *
 * Template Name: registration
 */

get_header(); ?>

<div id="primary" class="content-area">
    <main id="main" class="site-main" role="main">

        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <?php
            // Post thumbnail.
            twentyfifteen_post_thumbnail();
            ?>

            <header class="entry-header">
                <?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
            </header><!-- .entry-header -->

            <div class="entry-content">
                <p>ユーザー登録を行います。<br />
                    電話番号を登録しておけば「さすけねシステム」に電話するだけで除雪要請が行えます。
                </p>
                <?php the_content(); ?>
                <div id="map_canvas" style="margin: 10px; width:100%; height:500px"></div>



                <?php
                wp_link_pages( array(
                    'before'      => '<div class="page-links"><span class="page-links-title">' . __( 'Pages:', 'twentyfifteen' ) . '</span>',
                    'after'       => '</div>',
                    'link_before' => '<span>',
                    'link_after'  => '</span>',
                    'pagelink'    => '<span class="screen-reader-text">' . __( 'Page', 'twentyfifteen' ) . ' </span>%',
                    'separator'   => '<span class="screen-reader-text">, </span>',
                ) );
                ?>
                <input id="id_lat" type="text" readonly="readonly">
                <input id="id_lng" type="text" readonly="readonly">

            </div><!-- .entry-content -->

            <?php edit_post_link( __( 'Edit', 'twentyfifteen' ), '<footer class="entry-footer"><span class="edit-link">', '</span><span>thanks! http://www.google-mapi.com/googlemaps/geocoding-candidate.html</span></footer><!-- .entry-footer -->' ); ?>

        </article><!-- #post-## -->

        </main><!-- .site-main -->
</div><!-- .content-area -->
<script type="text/javascript">
</script>

<?php get_footer(); ?>
