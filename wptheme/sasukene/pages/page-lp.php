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
            <div class="entry-content" style="padding: 0; margin: 0; width: 100%;">
                <img style="padding: 0; margin: 0; width: 100%;" src="https://cacoo.com/diagrams/UBq3jQRaLrULKGMP-5EA6E.png">

                <?php
                wp_link_pages( array(
                    'before'      => '<div class="page-links"><span class="page-links-title">' . __( 'Pages:', 'twentyfourteen' ) . '</span>',
                    'after'       => '</div>',
                    'link_before' => '<span>',
                    'link_after'  => '</span>',
                ) );

                edit_post_link( __( 'Edit', 'twentyfourteen' ), '<span class="edit-link">', '</span>' );
                ?>


                <input id="id_lat" type="text" readonly="readonly">
                <input id="id_lng" type="text" readonly="readonly">



            </div><!-- .entry-content -->
            <?php edit_post_link( __( 'Edit', 'twentyfifteen' ), '<footer class="entry-footer"><span class="edit-link">', '</span></footer><!-- .entry-footer -->' ); ?>

        </article><!-- #post-## -->
    </main><!-- .site-main -->
</div><!-- .content-area -->

<?php get_footer(); ?>
