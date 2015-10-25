<?php
/**
 * The template for displaying pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages and that
 * other "pages" on your WordPress site will use a different template.
 *
 * Template Name: viewer
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
                <h1 class="entry-title">さすけろビューア</h1>
            </header><!-- .entry-header -->
            <div class="entry-content" style="padding: 0; margin: 0; width: 100%;">
                <div class="centerized">
                    <p>
                        <b>地域住民で作る「電話一本」「誰でも」出来る雪と災害の「見える化」ソリューション</b></br>
                        矢印キー→移動　スペースキー→ズームイン　マイナス/ハイフンキー→ズームアウト</br>
                    </p>

                    <div class="template-wrap clear">
                        <canvas class="emscripten" id="canvas" oncontextmenu="event.preventDefault()" height="" width=""></canvas>
                        <div class="logo"></div>
                        <div class="fullscreen"><img src="<?php bloginfo('stylesheet_directory'); ?>/unity/TemplateData/fullscreen.png" width="38" height="38" alt="Fullscreen" title="Fullscreen" onclick="SetFullscreen(1);" /></div>
                        <div class="title">sasukene</div>
                    </div>
                    <p class="footer">&laquo; created with <a href="http://unity3d.com/" title="Go to unity3d.com">Unity</a> &raquo;</p>
                </div>
                <script type='text/javascript'>
                    // connect to canvas
                        var Module = {
                            TOTAL_MEMORY: 268435456,
                            filePackagePrefixURL: "<?php bloginfo('stylesheet_directory'); ?>/unity/Release/",
                            memoryInitializerPrefixURL: "<?php bloginfo('stylesheet_directory'); ?>/unity/Release/",
                            preRun: [],
                            postRun: [],
                            print: (function() {
                                return function(text) {
                                    console.log (text);
                                };
                            })(),
                            printErr: function(text) {
                                console.error (text);
                            },
                            canvas: document.getElementById('canvas'),
                        progress: null,
                        setStatus: function(text) {
                            if (this.progress == null)
                            {
                                if (typeof UnityProgress != 'function')
                                    return;
                                this.progress = new UnityProgress (canvas);
                            }
                            if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: '' };
                            if (text === Module.setStatus.text) return;
                            this.progress.SetMessage (text);
                            var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
                            if (m)
                                this.progress.SetProgress (parseInt(m[2])/parseInt(m[4]));
                            if (text === "")
                                this.progress.Clear()
                        },
                        totalDependencies: 0,
                        monitorRunDependencies: function(left) {
                            this.totalDependencies = Math.max(this.totalDependencies, left);
                            Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
                        }
                    };
                    Module.setStatus('Downloading (0.0/1)');
                </script>
                <script src="<?php bloginfo('stylesheet_directory'); ?>/unity/Release/UnityConfig.js"></script>
                <script src="<?php bloginfo('stylesheet_directory'); ?>/unity/Release/fileloader.js"></script>
                <script>if (!(!Math.fround)) {
                        var script = document.createElement('script');
                        script.src = "<?php bloginfo('stylesheet_directory'); ?>/unity/Release/sasukene_unity_webgl_client.js";
                        document.body.appendChild(script);
                    } else {
                        var codeXHR = new XMLHttpRequest();
                        codeXHR.open('GET', '<?php bloginfo('stylesheet_directory'); ?>/unity/Release/sasukene_unity_webgl_client.js', true);
                        codeXHR.onload = function() {
                            var code = codeXHR.responseText;
                            if (!Math.fround) {
                                try {
                                    console.log('optimizing out Math.fround calls');
                                    var m = /var ([^=]+)=global\.Math\.fround;/.exec(code);
                                    var minified = m[1];
                                    if (!minified) throw 'fail';
                                    var startAsm = code.indexOf('// EMSCRIPTEN_START_FUNCS');
                                    var endAsm = code.indexOf('// EMSCRIPTEN_END_FUNCS');
                                    var asm = code.substring(startAsm, endAsm);
                                    do {
                                        var moar = false; // we need to re-do, as x(x( will not be fixed
                                        asm = asm.replace(new RegExp('[^a-zA-Z0-9\\$\\_]' + minified + '\\(', 'g'), function(s) { moar = true; return s[0] + '(' });
                                    } while (moar);
                                    code = code.substring(0, startAsm) + asm + code.substring(endAsm);
                                    code = code.replace("'use asm'", "'almost asm'");
                                } catch(e) { console.log('failed to optimize out Math.fround calls ' + e) }
                            }

                            var blob = new Blob([code], { type: 'text/javascript' });
                            codeXHR = null;
                            var src = URL.createObjectURL(blob);
                            var script = document.createElement('script');
                            script.src = URL.createObjectURL(blob);
                            script.onload = function() {
                                URL.revokeObjectURL(script.src);
                            };
                            document.body.appendChild(script);
                        };
                        codeXHR.send(null);
                    }
                </script>



            </div><!-- .entry-content -->
            <?php edit_post_link( __( 'Edit', 'twentyfifteen' ), '<footer class="entry-footer"><span class="edit-link">', '</span></footer><!-- .entry-footer -->' ); ?>

        </article><!-- #post-## -->
    </main><!-- .site-main -->
</div><!-- .content-area -->

<?php get_footer(); ?>
