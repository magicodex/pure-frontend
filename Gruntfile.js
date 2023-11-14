"use strict";

module.exports = function (grunt) {

  var jsSrc = [
    'src/global.js',
    'src/utils.js',
    'src/helper/sequence-generator.js',
    'src/helper/url-parser.js',
    'src/helper/browser-url.js',
    'src/helper/browser-title.js',
    'src/view/view.js',
    'src/view/view-info.js',
    'src/view/view-response.js',
    'src/view/view-holder.js',
    'src/view/view-loader.js',
    'src/view/view-manager.js',
    'src/view/view-mask.js',
    'src/ajax/ajax-result.js',
    'src/ajax/ajax-call-service.js',
    'src/ajax/ajax.js',
    'src/app/app-alert-messages.js',
    'src/app/app.js',
    'src/pure.js'
  ];

  var cssSrc = [
    'src/css/app.css',
    'src/css/view.css'
  ];

  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    buildJS: [{
      src: jsSrc,
      dest: 'dist/js/pure-frontend.js',
      minDest: 'dist/js/pure-frontend.min.js',
      destTemplate: 'build/templates/pure-frontend.dist.tmpl'
    },
    {
      src: jsSrc,
      dest: 'cjs/pure-frontend.js',
      destTemplate: 'build/templates/pure-frontend.cjs.tmpl'
    }],
    buildCSS: [{
      src: cssSrc,
      dest: 'dist/css/pure-frontend.css',
      minDest: 'dist/css/pure-frontend.min.css',
      destTemplate: 'build/templates/pure-frontend.css.tmpl'
    }]
  });

  // 加载任务
  grunt.loadTasks('build/tasks');
  // 注册默认任务
  grunt.registerTask('default', ['buildJS', 'buildCSS']);
};
