"use strict";

var sourceCodeUtils = require('./source-code-utils');
var minify = require('uglify-js').minify;
var uglifycss = require('uglifycss');

var buildFileUtils = {};
module.exports = buildFileUtils;

// 先截取 "/* SOURCE-CODE-START */" 与
// "/* SOURCE-CODE-END */" 这两个字符串之间的内容，
// 然后把截取的内容拼起来输出到目标文件中。

buildFileUtils.buildFiles = function (grunt, config) {
  if (grunt === null || grunt === undefined) {
    throw new Error('argument#0 "grunt" is null/undefined');
  }

  if (config === null || config === undefined) {
    throw new Error('argument#1 "config" is null/undefined');
  }

  var sourceFilePaths = config.src;
  var destFilePath = config.dest;
  var minDestFilePath = config.minDest;
  var destTemplatePath = config.destTemplate;
  var pkgVersion = grunt.config('pkg.version');
  var contents = [];

  for (var pathIndex = 0; pathIndex < sourceFilePaths.length; pathIndex++) {
    var sourceFilePath = sourceFilePaths[pathIndex];

    if (!grunt.file.exists(sourceFilePath)) {
      throw new Error('Failed to find file "' + sourceFilePath + '".');
    }

    // 读取来源文件内容
    var content = grunt.file.read(sourceFilePath);
    // 计算源代码的开始和结束索引
    var startIndex = sourceCodeUtils.getSourceStartIndex(content);
    var endIndex = sourceCodeUtils.getSourceEndIndex(content);

    var newContent = content.substring(startIndex, endIndex);
    contents.push(newContent);
  }

  if (!grunt.file.exists(destTemplatePath)) {
    throw new Error('Failed to find file "' + destTemplatePath + '".');
  }

  var destFileTemplate = grunt.file.read(destTemplatePath);
  var contentStr = contents.join('\n');
  // 生成目标文件内容
  var destFileContent = destFileTemplate.replace(/\{\{version\}\}/, 'v'.concat(pkgVersion));
  destFileContent = destFileContent.replace(/\{\{source\}\}/, contentStr);

  // 输出到目标文件
  grunt.file.write(destFilePath, destFileContent);
  grunt.log.write('Success to write file "' + destFilePath + '".\n');

  if (minDestFilePath) {
    var minDestFileContent;

    if (minDestFilePath.endsWith('.js')) {
      var minifyResult = minify(destFileContent);
      minDestFileContent = minifyResult.code;
    } else if (minDestFilePath.endsWith('.css')) {
      minDestFileContent = uglifycss.processString(destFileContent);
    } else {
      minDestFileContent = '';
    }

    // 输出到目标文件
    grunt.file.write(minDestFilePath, minDestFileContent);
    grunt.log.write('Success to write file "' + minDestFilePath + '".\n');
  }
};
