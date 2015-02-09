### salsa20js

A fully unit tested, implementation of Daniel J. Bernstein's Salsa20 cryptographic algorithm in JavaScript.

* Full 20 rounds.
* The implementation accepts either 128 or 256 bit keys.
* It supports starting the encryption/decryption from random block positions by allowing the user to specify the start counter.
* A variety of input formats are accepted for the key, message and nonce. 
* It can also output the ciphertext as an array of bytes or hexadecimal string.
* It will run fine inside a web worker thread.

#### Usage
##### Running the unit tests

It is important to run the unit tests to make sure everything works on your system. Export the files to a directory. Then open tests.html in your browser (preferably Firefox or Chrome).

##### Importing the library

```HTML
<script type="text/javascript" src="salsa20.js"></script>
```

##### Generating a cryptographically secure key

```JavaScript
var key = new Uint8Array(16);			// 128 bit key in bytes
window.crypto.getRandomValues(key);		// Fill the typed array with random bytes from the Web Crypto API
```

Or preferably:

```JavaScript
var key = new Uint8Array(32);			// 256 bit key in bytes
window.crypto.getRandomValues(key);		// Fill the typed array with random bytes from the Web Crypto API
```

##### Encryption

```JavaScript
var ciphertext = Salsa20.encrypt(key, message, nonce, counter, options);
```

`key` The key can be a hexadecimal string e.g. 'ab0de1f2...' or array of bytes e.g. [0, 255, 22, ...] equal to 128 bits or 256 bits.

`message` The plaintext message. This can be an array of bytes, a ASCII/UTF-8 string or also a hexadecimal string e.g. 'ab0de1f2...' if { inputTextType: 'hex' } is passed in the options object.

`nonce` A 64-bit one time cryptographic nonce i.e. the message number. This can be input as a hexadecimal string of 16 symbols, a byte array of 8 bytes or an integer between 0 and 2^53 inclusive.

`counter` An integer specifying the block to start encrypting from. Normally a 0 should be passed. If encrypting part of a large file it is also possible to enter the block number and it will start encrypting from that point. The maximum integer allowed for JavaScript is 2^53 (9007199254740992).

`options` Optional object with additional options:
    `inputTextType: 'hex'` - The input message will be a hexadecimal string, otherwise by default it will parse it as an ASCII/UTF-8 string
    `returnType: 'hex'` - Returns the encrypted data as a hexadecimal string, otherwise by default it will return an array of bytes

##### Decryption

```JavaScript
var message = Salsa20.encrypt(key, ciphertext, nonce, counter, options);
```

`key` The key can be a hexadecimal string e.g. 'ab0de1f2...' or array of bytes e.g. [0, 255, 22, ...] equal to 128 bits or 256 bits.

`ciphertext` The ciphertext message. This can be an array of bytes or also a hexadecimal string e.g. 'ab0de1f2...' if { inputTextType: 'hex' } is passed in the options object. Otherwise a byte array is used as default.

`nonce` A 64-bit one time cryptographic nonce i.e. the message number. This can be input as a hexadecimal string of 16 symbols, a byte array of 8 bytes or an integer between 0 and 2^53 inclusive.

`counter` An integer specifying the block to start decrypting from. Normally a 0 should be passed. If decrypting part of a large file it is also possible to enter the block number and it will start decrypting from that point. The maximum integer allowed for JavaScript is 2^53 (9007199254740992).

`options` Optional object with additional options:
    `inputTextType: 'hex'` - The input ciphertext will be a hex string, otherwise by default it will parse it as an array of bytes
    `returnType: 'hex'` - Returns the decrypted data as a hexadecimal string, otherwise by default it will return an ASCII/UTF-8 string

##### Code examples

See towards the end of the unit tests in the tests/tests.js file.

##### Feedback

Please make a new issue on GitHub [for this project](https://github.com/salsa20js/salsa20js/issues).