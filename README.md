# aozora

![ao](https://cloud.githubusercontent.com/assets/1403842/13048632/90487684-d42a-11e5-8a89-e0a3b1cb05a2.gif)

> CLI for [Aozora Bunko(青空文庫)](http://www.aozora.gr.jp/)

[![NPM Version](https://img.shields.io/npm/v/aozora.svg?style=flat-square)](https://www.npmjs.org/package/aozora)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://fand.mit-license.org/)

## Installation

```
$ npm install -g aozora
```

## Usage

```
Usage:
  aozora [-a authorId|authorName] [-w workId|workTitle] [-r length]
```

### aozora

Search text via interactive UI like shown above.

### aozora -a authorId|authorName

Print authors' info.

### aozora -w workId|workTitle

Print works that matches title.

### aozora -r length

Print random text from Aozora Bunko.
If length is specified, first (length) characters of the text will be printed.
