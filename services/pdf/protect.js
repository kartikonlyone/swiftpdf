// pdf-lib does not implement PDF standard-security-handler encryption
// (RC4/AES password protection) natively. Real password protection needs a
// library that can write the PDF /Encrypt dictionary — e.g. `qpdf` as a
// server-side binary, or `pdf-lib` combined with `node-qpdf2`.
//
// This module defines the real contract for that operation and shells out to
// qpdf when it's installed, rather than pretending to protect the file.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, readFile, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { nanoid } from "nanoid";

const execFileAsync = promisify(execFile);

export class QpdfNotAvailableError extends Error {
  constructor() {
    super(
      "Password protection requires the `qpdf` binary on the server. Install qpdf and redeploy."
    );
    this.name = "QpdfNotAvailableError";
  }
}

export async function protectPdf(buffer, { userPassword, ownerPassword, permissions = {} }) {
  if (!userPassword) throw new Error("A password is required to protect this PDF.");

  const inPath = join(tmpdir(), `sp-protect-in-${nanoid(10)}.pdf`);
  const outPath = join(tmpdir(), `sp-protect-out-${nanoid(10)}.pdf`);
  await writeFile(inPath, buffer);

  const args = [
    "--encrypt",
    userPassword,
    ownerPassword || userPassword,
    "256",
    permissions.allowPrinting === false ? "--print=none" : "--print=full",
    permissions.allowCopying === false ? "--extract=n" : "--extract=y",
    permissions.allowEditing === false ? "--modify=none" : "--modify=all",
    "--",
    inPath,
    outPath
  ];

  try {
    await execFileAsync("qpdf", args);
    return await readFile(outPath);
  } catch (err) {
    if (err.code === "ENOENT") throw new QpdfNotAvailableError();
    throw err;
  } finally {
    await unlink(inPath).catch(() => {});
    await unlink(outPath).catch(() => {});
  }
}

export async function unlockPdf(buffer, { password }) {
  const inPath = join(tmpdir(), `sp-unlock-in-${nanoid(10)}.pdf`);
  const outPath = join(tmpdir(), `sp-unlock-out-${nanoid(10)}.pdf`);
  await writeFile(inPath, buffer);

  try {
    await execFileAsync("qpdf", [
      password ? `--password=${password}` : "--password=",
      "--decrypt",
      inPath,
      outPath
    ]);
    return await readFile(outPath);
  } catch (err) {
    if (err.code === "ENOENT") throw new QpdfNotAvailableError();
    throw err;
  } finally {
    await unlink(inPath).catch(() => {});
    await unlink(outPath).catch(() => {});
  }
}
