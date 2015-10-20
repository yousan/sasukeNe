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
				<h1 class="entry-title">「さすけね」電話番号登録ページ</h1>
			</header><!-- .entry-header -->
			<div class="entry-content">
				<p>ユーザー登録を行います。<br />
					電話番号を登録しておけば「さすけねシステム」に電話するだけで除雪要請が行えます。
				</p>
				<?php $form = do_shortcode('[wpmem_form register]');
				$arr = array( '[wpmem_txt]', '[/wpmem_txt]' );
				$form = str_replace( $arr, '', $form );
				echo $form;
				?>
				<div id="map_canvas" style="margin: 10px; width:100%; height:500px"></div>

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
