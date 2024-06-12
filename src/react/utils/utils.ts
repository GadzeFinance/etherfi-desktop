export function decrypt(text: string, dbPassword: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Setup the receiveDecrypt listener
    window.encryptionApi.receiveDecrypt(
      (event: Electron.IpcMainEvent, result: number, decrypted: string, errorMessage: string) => {
        if (result === 0) {
          resolve(decrypted);
        } else {
          console.error("Error during decryption");
          reject(new Error(errorMessage));
        }
      }
    );
    // Trigger the decryption request
    window.encryptionApi.reqDecrypt(text, dbPassword);
  });
}