# aozora
[![Build Status](http://img.shields.io/travis/fand/aozora.svg?style=flat-square)](https://travis-ci.org/fand/aozora)
[![NPM Version](https://img.shields.io/npm/v/aozora.svg?style=flat-square)](https://www.npmjs.org/package/aozora)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://fand.mit-license.org/)
[![Coverage Status](https://img.shields.io/coveralls/fand/aozora.svg?style=flat-square)](https://coveralls.io/github/fand/aozora?branch=master)

CLI for [aozora-bunko(青空文庫)](http://www.aozora.gr.jp/).

## Installation

```
$ npm install -g aozora
```

## Usage

```
Usage:  aozora [-a author] [option] ...
```

### aozora -a author

Print author's info.

### aozora -w (work_id | work_title)

Print works that matches title.

### aozora -r [length]

Choose a work randomly and print first (length) characters.
If length is not specified, whole text will be printed.
