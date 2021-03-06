import { Cache } from "https://deno.land/x/local_cache@1.0/mod.ts";
import * as Drash from "https://deno.land/x/drash@v2.5.4/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v3.4.0/mod.ts";
import * as jose from "https://deno.land/x/jose@v4.8.1/index.ts";
import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";
import { qrcode } from "https://deno.land/x/qrcode@v2.0.0/mod.ts";

// @deno-types="https://deno.land/x/otpauth@v7.1.3/dist/otpauth.d.ts"
import * as OTPAuth from "https://deno.land/x/otpauth@v7.1.3/dist/otpauth.esm.js";

import { crypto } from "https://deno.land/std@0.140.0/crypto/mod.ts";
import { Buffer } from "https://deno.land/std@0.140.0/node/buffer.ts";
import * as iobuf from "https://deno.land/std@0.140.0/io/buffer.ts";

// templates
import { TengineService } from "https://deno.land/x/drash@v2.5.4/src/services/tengine/tengine.ts";

const tengine = new TengineService({
  views_path: "./views/",
});

import { DexterService } from "https://deno.land/x/drash@v2.5.4/src/services/dexter/dexter.ts";

const dexter = new DexterService({
  enabled: true,
  method: true,
  url: true,
  response_time: true,
});

export {
  Buffer,
  Cache,
  crypto,
  DB,
  dexter,
  Drash,
  iobuf,
  jose,
  Marked,
  OTPAuth,
  qrcode,
  tengine,
};
