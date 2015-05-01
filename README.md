### Salsa20js

A trustworthy, fully unit tested, implementation of Daniel J. Bernstein's Salsa20 cryptographic algorithm in JavaScript. 
This stream cipher algorithm was selected as a winner in the eSTREAM competition. A reduced 12 round variant (Salsa20/12) 
was selected for the eSTREAM software portfolio.

This implementation:

* Uses the full 20 rounds (Salsa20/20), not the weaker/reduced round variants (Salsa20/8 and Salsa20/12).
* Supports 128 bit and 256 bit keys.
* Was developed from the Salsa20 specification document, not a port of the C reference implementation.
* Is written with clean coding principles, is well commented and easily matches back to the specification.
* Has a provably correct implementation by passing all test vectors in the Salsa20 specification and more.
* Supports starting encryption and decryption from desired block positions by allowing the user to specify the start counter.
* Accepts a variety of input formats for the key, message and nonce. 
* Encodes and decodes text from ASCII/UTF-8.
* Supports ciphertext output as a typed array of bytes or hexadecimal string.
* Runs inside HTML5 web worker threads if required.

### Author

This library is written and maintained by Joshua M. David. The author has absolutely no affiliation with any government, 
spy agency or surveillance organisation. This library is certified by the author to be free of intentional backdoors or weaknesses.

### License

This project is licensed under the [MIT License](http://opensource.org/licenses/MIT).

### Usage
#### Requirements

A modern browser such as Firefox, Google Chrome or Chromium which has JavaScript typed array support. Ideally it will 
also support `window.crypto.getRandomValues()` to run the unit tests.

#### Running the unit tests

It is important to run the unit tests to make sure everything works on your system. Export the files to a directory then open `tests.html` in your browser.

#### Importing the library

```HTML
<script type="text/javascript" src="salsa20.js"></script>
```

#### Generating a cryptographically secure key

Using the Web Crypto API it is possible to generate a reasonably secure key. However you can use any method you like.

```JavaScript
var key = new Uint8Array(16);          // 128 bit key in bytes
window.crypto.getRandomValues(key);    // Fill the typed array with random bytes from the Web Crypto API
```

Or preferably:

```JavaScript
var key = new Uint8Array(32);          // 256 bit key in bytes
window.crypto.getRandomValues(key);    // Fill the typed array with random bytes from the Web Crypto API
```

#### Encryption

```JavaScript
var ciphertext = Salsa20.encrypt(key, message, nonce, counter, options);
```

* `key` The key can be a hexadecimal string e.g. `ab0de1f2...` or typed array of bytes (Uint8Array) e.g. `[255, 0, 22, ...]` equal to 128 bits or 256 bits.
* `message` The plaintext message. This can be a typed array of bytes (Uint8Array), a ASCII/UTF-8 string or also a hexadecimal string e.g. `ab0de1f2` if `inputTextType: 'hex'` is passed in the options object.
* `nonce` A 64-bit one-time cryptographic nonce i.e. the message number. This can be input as a hexadecimal string of 16 symbols e.g. `cd23ef45ab670189`, a Uint8Array array of 8 bytes e.g. `new Uint8Array([23, 255, 0, 214, 129, 78, 33, 21])` or an integer between `0` and `9007199254740991` inclusive.
* `counter` An integer specifying the block to start encrypting from. Normally a `0` should be passed in. If encrypting part of a large file it is also possible to enter the block number and it will start encrypting from that point. The maximum integer allowed for JavaScript is `9007199254740991` (2<sup>53</sup> - 1).
* `options` Optional object with properties:
    * `inputTextType: 'hex'` - The input message will be a hexadecimal string, otherwise by default it will parse it as an ASCII/UTF-8 string
    * `returnType: 'hex'` - Returns the encrypted data as a hexadecimal string, otherwise by default it will return a typed array of bytes (Uint8Array)

#### Decryption

```JavaScript
var message = Salsa20.decrypt(key, ciphertext, nonce, counter, options);
```

* `key` The key can be a hexadecimal string e.g. `ab0de1f2...` or typed array of bytes (Uint8Array) e.g. `[255, 0, 22, ...]` equal to 128 bits or 256 bits.
* `ciphertext` The ciphertext message. This can be a typed array of bytes (Uint8Array) or also a hexadecimal string e.g. `ab0de1f2...` if `inputTextType: 'hex'` is passed in the options object. Otherwise a byte array is used as default.
* `nonce` A 64-bit one-time cryptographic nonce i.e. the message number. This can be input as a hexadecimal string of 16 symbols e.g. `cd23ef45ab670189`, a Uint8Array array of 8 bytes e.g. `new Uint8Array([23, 255, 0, 214, 129, 78, 33, 21])` or an integer between `0` and `9007199254740991` inclusive.
* `counter` An integer specifying the block to start decrypting from. Normally a `0` should be passed in. If decrypting part of a large file it is also possible to enter the block number and it will start decrypting from that point. The maximum integer allowed for JavaScript is `9007199254740991` (2<sup>53</sup> - 1).
* `options` Optional object with additional options:
	* `inputTextType: 'hex'` - The input ciphertext will be a hex string, otherwise by default it will parse it as a typed array of bytes (Uint8Array)
    * `returnType: 'hex'` - Returns the decrypted data as a hexadecimal string, otherwise by default it will return an ASCII/UTF-8 string

#### Keystream generation

Generates a Salsa20 keystream based on a key, nonce and start counter. This can be used if you just want the raw keystream bytes, for example, to use in a cascaded stream cipher. The keystream will be at least the length of the `length` parameter entered and the number of random bytes returned will be the first multiple of the Salsa20 block size (64 bytes) after that. For example: length `53`, returns 64 bytes and length `77`, returns 128 bytes. It is your responsibility to truncate the produced keystream to the exact length you need.

```JavaScript
var options = { returnType: 'hex' };
var keystream = Salsa20.generateKeystream(key, length, nonce, counter, options);
```

* `key` The key can be a hexadecimal string e.g. `ab0de1f2...` or typed array of bytes (Uint8Array) e.g. `[255, 0, 22, ...]` equal to 128 bits or 256 bits.
* `length` An integer representing the minimum length of the keystream required.
* `nonce` A 64-bit one-time cryptographic nonce i.e. the message number. This can be input as a hexadecimal string of 16 symbols e.g. `cd23ef45ab670189`, a Uint8Array array of 8 bytes e.g. `new Uint8Array([23, 255, 0, 214, 129, 78, 33, 21])` or an integer between `0` and `9007199254740991` inclusive.
* `counter` An integer specifying the block to start keystream generation from. Normally a `0` should be passed in. The maximum integer allowed for JavaScript is `9007199254740991` (2<sup>53</sup> - 1).
* `options` Optional object with additional options:
    * `returnType: 'hex'` - Returns the keystream as a hexadecimal string, otherwise by default it will return a typed array of bytes (Uint8Array)

### Extra code examples

See towards the end of the unit tests in the `tests/tests.js` file.

### Code review

Thanks to [ferada](https://codereview.stackexchange.com/users/54571/ferada) for some excellent recommendations on improving the library on [StackExchange Code Review](https://codereview.stackexchange.com/q/80017). Anyone is welcome to review the code and provide further analysis or suggestions for improvement.

### Code signing

Tagged releases in the source code repository are signed with GnuPG Key ID: `DC768471C467B6D0`. Fingerprint: `CF3F 79EE 0114 59BA 0A59 9E9C DC76 8471 C467 B6D0`.

### Feedback 

If you find any bugs or have some suggestions for improvement, please create a new issue or Pull Request on GitHub [for the project](https://github.com/salsa20js/salsa20js/issues).

### Donate

If you found the library useful in your project, donations are welcome at:

* Bitcoin: `16h8K8sXCobL5u7wKRPG95F8XAc735P8TM`
* Litecoin: `Ld2X3Uyknq87GktF38q2ZQopyevRwC4hji`