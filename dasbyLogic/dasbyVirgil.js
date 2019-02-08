const vCrypto = require('virgil-crypto')

const VirgilCrypto = vCrypto.VirgilCrypto

const virgilCrypto = new VirgilCrypto();

// const dasbyPrivateKeyFromDb = "MIGhMF0GCSqGSIb3DQEFDTBQMC8GCSqGSIb3DQEFDDAiBBCmqMbFgKqanmT/LhOegMk5AgIMKjAKBggqhkiG9w0CCjAdBglghkgBZQMEASoEEL/KWJqPg84jaEJ3QcBDAygEQPDLt8DN8bvbWTXL5cMLOENCQLp1Q5G9rdFpSjU330//PEs+A0zNL45ErcELymT55zy8SFIFyvUtWz0geK6j8iQ="


const decryptMessage = (channel, encryptedMessage, dasbyPrivateKeyFromDb, dasbyUpi) => {
    dasbyPrivateKey = virgilCrypto.importPrivateKey(dasbyPrivateKeyFromDb, dasbyUpi)
    const channelPrivateKeyBytes = channel.attributes.privateKey;
    const decryptedChannelPrivateKeyBytes = virgilCrypto.decrypt(channelPrivateKeyBytes, dasbyPrivateKey)
    const channelPrivateKey = virgilCrypto.importPrivateKey(decryptedChannelPrivateKeyBytes);
    const decryptedMessage = virgilCrypto.decrypt(encryptedMessage, channelPrivateKey).toString('utf8')
    return decryptedMessage
}

const encryptMessage = (channel, text) => {
    const importedPublicKey = virgilCrypto.importPublicKey(channel.attributes.publicKey)
    const encryptedMessage = virgilCrypto.encrypt(text, importedPublicKey)
    return encryptedMessage.toString('base64')
}

module.exports = {
    decryptMessage: decryptMessage,
    encryptMessage: encryptMessage
}