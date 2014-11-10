module.exports = function(grunt) {

    // 1. Вся настройка находится здесь
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            mainjs:{
                src: [
                    'js/jquery-1.10.2.js',
                    'js/sticky.full.js',
                    'js/jquery.slimscroll.js',
                    ],
                    dest: 'js/prod/main.js',
            },
            enterjs:{

                src: [
                    'js/jquery.backstretch.min.js',
                    'js/enter.js',
                ],
                dest: 'js/prod/enter.js',

            },
            jqgridjs:{

                src: [
                    'js/jquery-ui-1.9.2.custom.js',
                    'js/jqgrid/js/jquery.jqGrid.js',
                    'js/jqgrid/js/grid.locale-ru.js'
                    ],
                    dest: 'js/prod/jqgrid.js',

            },
            paneladminjs:{

                src: [
                    'js/jqgrid/tables/admin_panel_jqgrid.js',
                    'js/panel.js',
                ],
                dest: 'js/prod/paneladmin.js',

            },
            paneluserjs:{

                src: [
                    'js/jqgrid/tables/user_panel_jqgrid.js',
                    'js/panel.js',
                ],
                dest: 'js/prod/paneluser.js',

            },
            journaljs:{

                src: [
                    'js/jqgrid/tables/admin_journal_jqgrid.js',
                    'js/panel.js',
                ],
                dest: 'js/prod/journal.js',

            },
            statsjs:{

                src: [
                    'js/chart.js',
                    'js/legend.js',
                    'js/panel.js',
                    'js/stats.js',
                    ],
                    dest: 'js/prod/stats.js',

            },
            helpjs:{

                src: [
                    'js/jquery-ui-1.9.2.custom.js',
                    'js/panel.js',
                ],
                dest: 'js/prod/help.js',

            },
            maincss:{

                src: [
                    'css/*.css',
                ],
                dest: 'css/production.css',

            },
        },
        uglify: {
            build: {
                files: [{
                    expand: true,
                    src: ['*.js', '!*.min.js'],
                    dest: 'js/min',
                    cwd: 'js/prod',
                    ext: '.min.js'
                }]
              }
        }

    });

    // 3. Тут мы указываем Grunt, что хотим использовать этот плагин
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 4. Указываем, какие задачи выполняются, когда мы вводим «grunt» в терминале
    grunt.registerTask('default', ['concat', 'uglify']);

};