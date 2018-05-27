const fs = require('fs')
const path = require('path')
const promisify = require('util').promisify
const gulp = require('gulp')
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const del = require('del')

const webpackConfigBuild = require('./webpack.config.build')
const webpackConfigWatch = require('./webpack.config.watch')

const dist = path.join(__dirname, 'dist')
const staticFiles = ['index.html']

async function clean() {
  try {
    await promisify(fs.stat)(dist)
  } catch (e) {
    await promisify(fs.mkdir)(dist)
  }
  await del([`${dist}/**`, `!${dist}`])
}

async function copyStaticFiles() {
  for (let file of staticFiles) {
    await promisify(fs.copyFile)(
      path.join(__dirname, './src/', file),
      path.join(dist, file)
    )
  }
}

async function build() {
  await new Promise((resolve, reject) => {
    webpackStream(webpackConfigBuild, webpack)
      .pipe(gulp.dest(dist))
      .on('end', resolve)
      .on('error', reject)
  })
}

async function watch() {
  await new Promise((resolve, reject) => {
    webpackStream(webpackConfigWatch, webpack)
      .pipe(gulp.dest(dist))
      .on('end', resolve)
      .on('error', reject)
  })
}

gulp.task('build', async () => {
  await clean()
  await copyStaticFiles()
  await build()
})

gulp.task('watch', async () => {
  await clean()
  await copyStaticFiles()
  await watch()
})
