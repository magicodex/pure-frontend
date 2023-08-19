"use strict";

var buildFileUtils = require('../utils/build-file-utils');

module.exports = function (grunt) {

  // 注册 grunt 任务
  grunt.registerTask('buildJS', function () {
    // 获取配置
    var configs = grunt.config('buildJS');

    if (configs == null) {
      return;
    }

    for (var configIndex = 0; configIndex < configs.length; configIndex++) {
      var config = configs[configIndex];

      // 创建文件
      buildFileUtils.buildFiles(grunt, config);
    }
  });

};
