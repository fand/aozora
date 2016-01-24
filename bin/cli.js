#!/usr/bin/env node
const Aozora = require('../lib');

Aozora.findWorkById(process.argv[2])
  .then(function (work) {
    console.log(work);
  });
