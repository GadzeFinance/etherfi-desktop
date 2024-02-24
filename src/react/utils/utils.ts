import forge from "node-forge";
import { Buffer } from 'buffer';

export function decrypt(encryptedJSONStr: string, password: string) {
  const encryptedJSON = JSON.parse(encryptedJSONStr)
  const iv = Buffer.from(encryptedJSON.iv, "hex").toString('binary');
  const salt = Buffer.from(encryptedJSON.salt, "hex").toString('binary');
  const encryptedData = Buffer.from(encryptedJSON.data, "hex");
  const key = forge.pkcs5.pbkdf2(password, salt, 100000, 32, "sha256");
  var decipher = forge.cipher.createDecipher('AES-CBC', key);
  decipher.start({iv: iv});
  decipher.update(forge.util.createBuffer(encryptedData));
  var result = decipher.finish(); // check 'result' for true/false
  // outputs decrypted hex
  console.log(decipher.output.toString());
  return decipher.output.toString();
};