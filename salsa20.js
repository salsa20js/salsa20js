/**
 * Salsa20/20 implementation
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation in version 3 of the License.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see [http://www.gnu.org/licenses/].
 */


// Use ECMAScript 5's strict mode
'use strict';

var Salsa20 = {

	// The maximum integer size in JavaScript (9007199254740992)
	maxInteger: Math.pow(2, 53),
	
	// The core of Salsa20 is a hash function with 64-byte input and 64-byte output
	outputByteLength: 64,

	/**
	 * Converts a hex word e.g. 0xc0a8787e or 'c0a8787e' to decimal i.e. 3232266366
	 * @param {String} hexWord A hexadecimal word of 32 bits
	 * @returns {Number} Returns an integer
	 */
	hexWordToDecimal: function(hexWord)
	{
		return parseInt(hexWord, 16);
	},
	
	/**
	 * Converts a decimal or integer to a hexadecimal word of 32 bits e.g. 3232266366 becomes 'c0a8787e'
	 * @param {Number} decimalNum
	 * @returns {String} Returns a hexadecimal word of length 32 bits (8 hexadecimal chars)
	 */
	decimalToHexWord: function(decimalNum)
	{
		// Convert to hexadecimal and pad to 4 bytes (8 hexadecimal chars)
		var hexWord = decimalNum.toString(16);
		var paddedHexWord = this.leftPadding(hexWord, '0', 8);
		
		return paddedHexWord;
	},
	
	/**
	 * Left pad a string with a certain character to a total number of characters
	 * @param {string} inputString The string to be padded
	 * @param {string} padCharacter The character that the string should be padded with
	 * @param {number} totalCharacters The length of string that's required
	 * @returns {string} A string with characters appended to the front of it
	 */
	leftPadding: function(inputString, padCharacter, totalCharacters)
	{
		// Convert to string first, or it starts adding numbers instead of concatenating
		inputString = inputString.toString();
		
		// If the string is already the right length, just return it
		if (!inputString || !padCharacter || inputString.length >= totalCharacters)
		{
			return inputString;
		}
		
		// Work out how many extra characters we need to add to the string
		var charsToAdd = (totalCharacters - inputString.length)/padCharacter.length;
		
		// Add padding onto the string
		for (var i = 0; i < charsToAdd; i++)
		{
			inputString = padCharacter + inputString;
		}
		
		return inputString;
	},
	
	/**
	 * Adds two hexadecimal words of length 32 bits together
	 * @param {String} hexWordA A hexadecimal word of 32 bits
	 * @param {String} hexWordB A hexadecimal word of 32 bits
	 * @returns {String} Returns the resulting hexadecimal word of 32 bits
	 */
	sumHexWords: function(hexWordA, hexWordB)
	{
		// Convert words to decimal and store in 32 bit typed array
		var wordArray = new Uint32Array(3);
		wordArray[0] = this.hexWordToDecimal(hexWordA);
		wordArray[1] = this.hexWordToDecimal(hexWordB);
		
		// Add the two numbers
		wordArray[2] = wordArray[0] + wordArray[1];
		
		// Return as hex
		return this.decimalToHexWord(wordArray[2]);
	},
	
	/**
	 * Exclusive ORs two hex words together
	 * @param {String} hexWordA A hexadecimal word of 32 bits
	 * @param {String} hexWordB A hexadecimal word of 32 bits
	 * @returns {String} Returns the resulting hexadecimal word of 32 bits
	 */
	xorHexWords: function(hexWordA, hexWordB)
	{
		// Convert words to decimal and store in 32 bit typed array
		var wordArray = new Uint32Array(3);
		wordArray[0] = this.hexWordToDecimal(hexWordA);
		wordArray[1] = this.hexWordToDecimal(hexWordB);
		
		// XOR the two numbers
		wordArray[2] = wordArray[0] ^ wordArray[1];
		
		// Return as hex
		return this.decimalToHexWord(wordArray[2]);
	},
	
	/**
	 * Left rotates a hexadecimal word to the specified number of bits
	 * @param {String} hexWordA A hexadecimal word of 32 bits
	 * @param {Number} numBitsToRotate An integer of the number of bits to rotate
	 * @returns {String} Returns the resulting hexadecimal word of 32 bits
	 */
	leftRotate: function(hexWordA, numBitsToRotate)
	{
		// Convert word to decimal and store in 32 bit typed array
		var wordArray = new Uint32Array(2);
		wordArray[0] = this.hexWordToDecimal(hexWordA);
		
		// Left rotate the number by the number of bits
		wordArray[1] = (wordArray[0] << numBitsToRotate | (wordArray[0] >>> (32 - numBitsToRotate)));
		
		// Return as hex
		return this.decimalToHexWord(wordArray[1]);
	},
	
	/**
	 * The quarterround function from Section 3 of the spec
	 * @param {Array} yWords An array of four 32 bit hexadecimal words
	 * @returns {Array} zWords Returns a modified array of four 32 bit hexadecimal words
	 */
	quarterRound: function(yWords)
	{
		var sum = null;
		var leftRotation = null;
		var zWords = [];
		
		// z1 = y1 ⊕ ((y0 + y3) <<< 7)
		sum = this.sumHexWords(yWords[0], yWords[3]);
		leftRotation = this.leftRotate(sum, 7);
		zWords[1] = this.xorHexWords(yWords[1], leftRotation);
		
		// z2 = y2 ⊕ ((z1 + y0) <<< 9)
		sum = this.sumHexWords(zWords[1], yWords[0]);
		leftRotation = this.leftRotate(sum, 9);
		zWords[2] = this.xorHexWords(yWords[2], leftRotation);
		
		// z3 = y3 ⊕ ((z2 + z1) <<< 13)
		sum = this.sumHexWords(zWords[2], zWords[1]);
		leftRotation = this.leftRotate(sum, 13);
		zWords[3] = this.xorHexWords(yWords[3], leftRotation);
		
		// z0 = y0 ⊕ ((z3 + z2) <<< 18)
		sum = this.sumHexWords(zWords[3], zWords[2]);
		leftRotation = this.leftRotate(sum, 18);
		zWords[0] = this.xorHexWords(yWords[0], leftRotation);
		
		return zWords;
	},
	
	/**
	 * The rowround function from Section 4 of the spec
	 * @param {Array} yWords A 16-word array consisting of 32 bit hexadecimal words
	 * @returns {Array} zWords Returns a transformed 16-word array consisting of 32 bit hexadecimal words
	 */
	rowRound: function(yWords)
	{
		var zWords = [];
		var transformedWords = [];
		
		// (z0, z1, z2, z3) = quarterround(y0, y1, y2, y3)
		transformedWords = this.quarterRound([yWords[0], yWords[1], yWords[2], yWords[3]]);
		zWords[0] = transformedWords[0];
		zWords[1] = transformedWords[1];
		zWords[2] = transformedWords[2];
		zWords[3] = transformedWords[3];
		
		// (z5, z6, z7, z4) = quarterround(y5, y6, y7, y4)
		transformedWords = this.quarterRound([yWords[5], yWords[6], yWords[7], yWords[4]]);
		zWords[5] = transformedWords[0];
		zWords[6] = transformedWords[1];
		zWords[7] = transformedWords[2];
		zWords[4] = transformedWords[3];
		
		// (z10, z11, z8, z9) = quarterround(y10, y11, y8, y9)
		transformedWords = this.quarterRound([yWords[10], yWords[11], yWords[8], yWords[9]]);
		zWords[10] = transformedWords[0];
		zWords[11] = transformedWords[1];
		zWords[8] = transformedWords[2];
		zWords[9] = transformedWords[3];
		
		// (z15, z12, z13, z14) = quarterround(y15, y12, y13, y14)
		transformedWords = this.quarterRound([yWords[15], yWords[12], yWords[13], yWords[14]]);
		zWords[15] = transformedWords[0];
		zWords[12] = transformedWords[1];
		zWords[13] = transformedWords[2];
		zWords[14] = transformedWords[3];
		
		return zWords;
	},
	
	/**
	 * The columnround function from Section 5 of the spec
	 * @param {Array} xWords A 16-word array consisting of 32 bit hexadecimal words
	 * @returns {Array} yWords Returns a transformed 16-word array consisting of 32 bit hexadecimal words
	 */
	columnRound: function(xWords)
	{
		var yWords = [];
		var transformedWords = [];
		
		// (y0, y4, y8, y12) = quarterround(x0, x4, x8, x12)
		transformedWords = this.quarterRound([xWords[0], xWords[4], xWords[8], xWords[12]]);
		yWords[0] = transformedWords[0];
		yWords[4] = transformedWords[1];
		yWords[8] = transformedWords[2];
		yWords[12] = transformedWords[3];
		
		// (y5, y9, y13, y1) = quarterround(x5, x9, x13, x1)
		transformedWords = this.quarterRound([xWords[5], xWords[9], xWords[13], xWords[1]]);
		yWords[5] = transformedWords[0];
		yWords[9] = transformedWords[1];
		yWords[13] = transformedWords[2];
		yWords[1] = transformedWords[3];
		
		// (y10, y14, y2, y6) = quarterround(x10, x14, x2, x6)
		transformedWords = this.quarterRound([xWords[10], xWords[14], xWords[2], xWords[6]]);
		yWords[10] = transformedWords[0];
		yWords[14] = transformedWords[1];
		yWords[2] = transformedWords[2];
		yWords[6] = transformedWords[3];
		
		// (y15, y3, y7, y11) = quarterround(x15, x3, x7, x11)
		transformedWords = this.quarterRound([xWords[15], xWords[3], xWords[7], xWords[11]]);
		yWords[15] = transformedWords[0];
		yWords[3] = transformedWords[1];
		yWords[7] = transformedWords[2];
		yWords[11] = transformedWords[3];
		
		return yWords;
	},
	
	/**
	 * The doubleround function from Section 6 of the spec
	 * @param {Array} xWords A 16-word array consisting of 32 bit hexadecimal words
	 * @returns {Array} xWords Returns a transformed 16-word array consisting of 32 bit hexadecimal words
	 */
	doubleRound: function(xWords)
	{
		return this.rowRound(this.columnRound(xWords));
	},
	
	/**
	 * The littleendian function from Section 7 of the spec
	 * @param {Array} bytes A 4-byte sequence e.g. [6, 75, 30, 9]
	 * @returns {String} Returns a 32 bit hexadecimal word
	 */
	littleEndian: function(bytes)
	{
		var wordArray = new Uint32Array(1);
		
		// Calculate b0 + 2^8 * b1 + 2^16 * b2 + 2^24 * b3	
		wordArray[0] = bytes[0] + (Math.pow(2, 8) * bytes[1]) + (Math.pow(2, 16) * bytes[2]) + (Math.pow(2, 24) * bytes[3]);
		
		// Convert back to hexadecimal
		return this.decimalToHexWord(wordArray[0]);
	},
	
	/**
	 * The inverse of the littleendian function
	 * @param {String} word A 32 bit hexadecimal word
	 * @returns {Array} Returns a 4-byte sequence e.g. [6, 75, 30, 9]
	 */
	littleEndianInverse: function(word)
	{
		// Convert the word to bytes
		var bytes = this.hexToBytes(word);
		
		// Perform the littleEndian function on the bytes
		var inverseLittleEndianWord = this.littleEndian(bytes);
		
		// Return the word back as bytes
		return this.hexToBytes(inverseLittleEndianWord);
	},
	
	/**
	 * Converts a hexadecimal string to a byte array
	 * @param {String} hexString A string of hexadecimal symbols
	 * @returns {Array} Returns a byte array e.g. [34, 255, 0, 64]
	 */
	hexToBytes: function(hexString)
	{
		var byteArray = [];
		
		for (var i = 0, length = hexString.length; i < length; i += 2)
		{
			var byteHex = hexString.substring(i, i + 2);
			var byte = parseInt(byteHex, 16);
			
			byteArray.push(byte);
		}
		
		return byteArray;
	},
	
	/**
	 * Converts a byte array to a hexadecimal string
	 * @param {Array} byteArray A byte array e.g. [34, 255, 0, 64]
	 * @returns {String} Returns A string of hexadecimal symbols
	 */
	bytesToHex: function(byteArray)
	{
		var hexString = '';
		
		for (var i = 0, length = byteArray.length; i < length; i++)
		{
			// Convert the decimal to a byte, adding padding if necessary
			var hex = byteArray[i].toString(16);
			var hexPadded = this.leftPadding(hex, '0', 2);
			
			hexString += hexPadded;
		}
		
		return hexString;
	},
	
	/**
	 * The Salsa20 hash function from Section 8 of the spec
	 * @param {Array} xBytes A 64-byte sequence e.g. [211, 159, 13, 115, ...]
	 * @returns {Array} zBytes A modified 64-byte sequence
	 */
	hash: function(xBytes)
	{
		var xWords = [];
		var resultBytes = [];
		
		// Convert bytes to littleendian words
		// x0 = littleendian(x[0], x[1], x[2], x[3]),
		// x1 = littleendian(x[4], x[5], x[6], x[7]),
		// ...
		// x15 = littleendian(x[60], x[61], x[62], x[63]).
		for (var i = 0, j = 0; i < this.outputByteLength; i += 4, j++)
		{			
			xWords[j] = this.littleEndian([xBytes[i], xBytes[i + 1], xBytes[i + 2], xBytes[i + 3]]);
		}
		
		// Set to be input into doubleround multiple times
		var zWords = xWords;
		
		// Perform doubleround 10 times
		for (var i = 0; i < 10; i++)
		{
			zWords = this.doubleRound(zWords);
		}
		
		// Perform littleendian −1 (z0 + x0) through to littleendian −1 (z15 + x15)
		for (var i = 0; i < 16; i++)
		{
			// Add the z and x words in the brackets first then perform the inverse littleendian
			var sumWords = this.sumHexWords(zWords[i], xWords[i]);
			var inverseEndianBytes = this.littleEndianInverse(sumWords);
						
			// Concatenate the bytes to the end of the array
			resultBytes = resultBytes.concat(inverseEndianBytes);
		}
		
		return resultBytes;
	},
	
	/**
	 * Constants for the 16 byte (128 bit) key
	 * τ0 τ1 τ2 τ3 is "expand 16-byte k" in ASCII
	 */
	constants16: [
		[101, 120, 112, 97],	// τ0 "expa"
		[110, 100, 32, 49],		// τ1 "nd 1"
		[54, 45, 98, 121],		// τ2 "6-by"
		[116, 101, 32, 107]		// τ3 "te k"
	],
	
	/**
	 * Constants for the 32 byte (256 bit) key
	 * σ0 σ1 σ2 σ3 is "expand 32-byte k" in ASCII
	 */
	constants32: [
		[101, 120, 112, 97],	// σ0 "expa"
		[110, 100, 32, 51],		// σ1 "nd 3"
		[50, 45, 98, 121],		// σ2 "2-by"
		[116, 101, 32, 107]		// σ3 "te k"
	],
	
	/**
	 * The Salsa20 expansion function from Section 9 of the spec
	 * @param {Array} nonce A 16 byte sequence for the nonce and counter
	 * @param {Array} key0 A 16 byte (128 bit) sequence for the key
	 * @param {Array} key1 An optional additional 16 byte (128 bit) sequence to make up a full 256 bit key
	 * @returns {Array} Returns a 64 byte sequence which is the expansion of (k, n) into Salsa20 k(n)
	 */
	expansion: function(nonce, key0, key1)
	{
		var inputBytes = [];
		
		// If using a 32 byte (256 bit) key
		if ((key1) && (key1.length !== 0))
		{			
			// Salsa20 k0,k1(n) = Salsa20(σ0, k0, σ1, n, σ2, k1, σ3)
			inputBytes = inputBytes.concat(this.constants32[0], key0, this.constants32[1], nonce, this.constants32[2], key1, this.constants32[3]);
		}
		else {
			// Otherwise use the 16 byte (128 bit key)
			// Salsa20 k(n) = Salsa20(τ0, k, τ1, n, τ2, k, τ3)
			inputBytes = inputBytes.concat(this.constants16[0], key0, this.constants16[1], nonce, this.constants16[2], key0, this.constants16[3]);
		}
		
		// Perform the hash
		return this.hash(inputBytes);
	},
	
	/**
	 * Converts a nonce or counter to a fixed 8 byte (64 bit) array
	 * @param {Number} num An integer e.g. nonce or counter to be converted to fixed 8 byte array
	 * @returns {Array} Returns an array of bytes with a total size of 8 bytes
	 */
	numToByteArray: function(num)
	{
		// Convert to hex
		var counterHex = num.toString(16);
		
		// Add padding to make up 64 bits (4 bits per symbol x 16)
		var paddedCounterHex = this.leftPadding(counterHex, '0', 16);
				
		// Convert to bytes
		return this.hexToBytes(paddedCounterHex);
	},
	
	/**
	 * The Salsa20 encryption function from Section 10 of the spec
	 * @param {Array} key A 16-byte sequence for the 128 bit key or 32-byte sequence for the 256 bit key
	 * @param {Array} message An arbitrary length byte sequence (less than 2^70) for the plaintext message
	 * @param {Array} nonce An 8-byte nonce / unique message number (less than 2^53)
	 * @param {Number} counter An optional integer counter (less than 2^53) to start encryption/decryption from, default is usually 0
	 * @returns {Array} Returns an array of bytes (the ciphertext message)
	 */
	encryption: function(key, message, nonce, counter)
	{
		// Separate the key into two parts for input into the expansion function
		var key0 = key.slice(0, 16);
		var key1 = key.slice(16, 32);
								
		// Find number of 64 byte keystream blocks to create
		var numBlocksToGenerate = Math.ceil(message.length / this.outputByteLength);
		
		// Find the stop counter value to exit keystream generation
		var maxCounter = counter + numBlocksToGenerate;
		
		// Generate the keystream
		for (var keystreamBytes = []; counter < maxCounter; counter++)
		{
			// Add the nonce and counter to form the 16 bytes input into the expansion function
			var counterBytes = this.numToByteArray(counter);
			var counterAndNonceBytes = nonce.concat(counterBytes);
						
			// Generate 64 byte block keystream
			var expansionBytes = this.expansion(counterAndNonceBytes, key0, key1);
						
			// Build output			
			keystreamBytes = keystreamBytes.concat(expansionBytes);
		}
		
		// XOR each byte of the key with the corresponding plaintext byte
		for (var xoredBytes = [], i = 0, length = message.length; i < length; i++)
		{
			// XOR the two bytes together
			var byte = this.xorTwoBytes(keystreamBytes[i], message[i]);
									
			// Append to output
			xoredBytes.push(byte);
		}
		
		return xoredBytes;
	},
	
	/**
	 * Exclusive OR two bytes together
	 * @param {Number} byteA An integer from 0 - 255 inclusive
	 * @param {Number} byteB An integer from 0 - 255 inclusive
	 * @returns {Number} Returns an integer from 0 - 255 inclusive
	 */
	xorTwoBytes: function(byteA, byteB)
	{
		// Create a typed array which will clamp the result to a single byte within the range of 0 - 255
		var resultByte = new Uint8Array(1);
			
		// XOR the two bytes
		resultByte[0] = byteA ^ byteB;
		
		return resultByte[0];
	},
	
	/**
	 * Parses the key input by the user and normalises it to a byte array
	 * @param {String|Array|Uint8Array} key A hexadecimal string e.g. 'ab0de1f2...' or array of bytes e.g. [0, 255, 22, ...] equal to 128 bits or 256 bits
	 * @returns {Array} Returns an array of bytes
	 */
	parseKey: function(key)
	{
		try {			
			if ((key instanceof Uint8Array) || (key instanceof Array))
			{
				// Normalise the key to a regular array
				key = Array.prototype.slice.call(key);
			}
			else if (typeof key === 'string')
			{
				// Convert the key from hexadecimal string to byte array
				key = this.hexToBytes(key);
			}
			else {
				throw new Error('Incorrect parameter type for the key, it should be an array of bytes or hex string');
			}
			
			// Check key length is correct
			if (this.checkKeyLength(key.length))
			{
				// Key should be byte array now
				return key;
			}
			else {
				throw new Error('Incorrect key length, only 16 bytes (128 bits) or 32 bytes (256 bits) accepted');
			}
		}
		catch (exception)
		{
			console.error(exception);
		}
	},
	
	/**
	 * Checks the key is the correct size
	 * @param {Number} keyLength The size of the key in bytes
	 * @return {Boolean} Returns true if the key is the correct size, false if not
	 */
	checkKeyLength: function(keyLength)
	{
		// If key is 16 bytes (128 bits) or 32 bytes (256 bits)
		if ((keyLength === 16) || (keyLength === 32))
		{
			return true;
		}
		
		return false;
	},
	
	/**
	 * Converts a message from a hexadecimal string or UTF-8 to a byte array
	 * @param {String|Array|Uint8Array} message The message of an arbitrary length as a UTF-8 string, hexadecimal string, or array of bytes
	 * @param {Object} options Optional object with additional options:
	 *		inputTextType: 'hex' - The input message plaintext or ciphertext
	 * @returns {Array} Returns a byte array
	 */
	parseMessage: function(message, options)
	{
		try {
			var messageBytes = [];
			
			// If an array of bytes
			if ((message instanceof Uint8Array) || (message instanceof Array))
			{
				// Convert the typed array to a regular array
				messageBytes = Array.prototype.slice.call(message);
			}
			else if (typeof message === 'string')
			{
				// Check it is a hex string by checking the options property
				if ((typeof options !== 'undefined') && (options.hasOwnProperty('inputTextType')) && (options.inputTextType === 'hex'))
				{
					// Convert from hexadecimal string
					messageBytes = this.hexToBytes(message);
				}
				else {
					// Convert from UTF-8 string
					messageBytes = this.utf8StringToBytes(message);
				}
			}
			else {
				throw new Error('Incorrect parameter type for the message, it should be a string, hex string or array of bytes');
			}
			
			// The maximum counter in the spec is 2^64, but JavaScript can't go higher than 2^53 for an integer. Multiply 
			// this max counter by the output bytes of Salsa20 function (64 bytes) which gives 576460752303424000 bytes = 512 PiB
			if (messageBytes.length > (this.maxInteger * this.outputByteLength))
			{
				throw new Error('Should not encrypt more than 512 petabytes of data under a single nonce, try splitting the data and encrypting under separate nonces');
			}
			
			return messageBytes;
		}
		catch (exception)
		{
			console.error(exception);
		}
	},
	
	/**
	 * Encodes an ASCII/UTF-8 string into an array of bytes
	 * @param {String} unicodeString
	 * @returns {Array}
	 */
	utf8StringToBytes: function(unicodeString)
	{
		try {
			// Encode all Unicode chars
			var utf8ByteString = unescape(encodeURIComponent(unicodeString));
						
			for (var i = 0, utf8Bytes = [], length = utf8ByteString.length; i < length; i++)
			{
				// Get the decimal representation of each character
				var decimal = utf8ByteString.charCodeAt(i);
				
				// Build up the byte array
				utf8Bytes.push(decimal);
			}
			
			return utf8Bytes;
		}
		catch (exception)
		{
			// Catch exceptions for URIError: malformed URI sequence
			console.error(exception);
		}
	},
	
	/**
	 * Decodes an array of bytes to an ASCII/UTF-8 string
	 * @param {Array} bytes
	 * @returns {String}
	 */
	bytesToUtf8String: function(bytes)
	{		
		// Get the char code for each byte
		for (var i = 0, string = '', length = bytes.length; i < length; i++)
		{
			string += String.fromCharCode(bytes[i]);
		}
		
		// Decode string back to UTF-8
		return decodeURIComponent(escape(string));
	},
	
	/**
	 * Converts the nonce to a fixed size byte array
	 * @param {Array|Uint8Array|String|Number} nonce A byte array of 8 bytes, a hex string of 16 symbols, or an integer between 0 and 2^53 inclusive
	 * @returns {Array} Returns a byte array of 8 bytes
	 */
	parseNonce: function(nonce)
	{
		try {
			// If an array of bytes
			if (((nonce instanceof Uint8Array) || (nonce instanceof Array)) && (nonce.length === 8))
			{
				// Convert the typed array to a regular array
				return Array.prototype.slice.call(nonce);
			}
			
			// If a hexadecimal string with 16 hex digits in length
			else if ((typeof nonce === 'string') && (nonce.length === 16))
			{
				return this.hexToBytes(nonce);
			}
			
			// If a positive integer
			else if ((typeof nonce === 'number') && (nonce % 1 === 0) && (nonce >= 0))
			{
				// Check that it does not exceed integer limit in JavaScript (2^53)
				if (nonce <= this.maxInteger)
				{
					return this.numToByteArray(nonce);
				}
				else {
					throw new Error('The nonce size has exceeded the max integer limit of JavaScript (' + this.maxInteger + ')');
				}
			}
			else {
				throw new Error('Incorrect parameter for the nonce, it should be a hex string (16 symbols), array of bytes (8 bytes) or a positive integer');
			}
		}
		catch (exception)
		{			
			console.error(exception);
		}
	},
	
	/**
	 * Checks the counter is formulated correctly
	 * @param {Number} counter An integer from 0 to 2^53 (max integer allowed in JavaScript).
	 * @param {Number} messageLength The message length in number of bytes
	 * @returns {Number} Returns an integer
	 */
	parseCounter: function(counter, messageLength)
	{
		try {
			// Throw exception if not a positive integer
			if ((typeof counter !== 'number') || (counter % 1 !== 0) || (counter < 0))
			{
				throw new Error('The counter size should be an integer from 0 to ' + this.maxInteger);
			}
						
			// The maximum number of keystream bytes that can be created from this start counter
			var maxKeystreamBytes = ((this.maxInteger - counter) * this.outputByteLength) + this.outputByteLength;
						
			// Check that enough keystream bytes can be generated to encrypt the message from this counter position 
			// without overflowing JavaScript's maximum integer limit
			if (messageLength > maxKeystreamBytes)
			{
				throw new Error(
					'The message is longer than the number of keystream bytes that can be generated from this start ' +
					'counter position. Consider splitting the message into smaller parts. Start counter: ' + 
					counter + '. Max message bytes that can be ' + 'encrypted/decrypted from this counter position: ' + 
					maxKeystreamBytes + '. Num of message bytes: ' + messageLength
				);
			}
			else 
			{				
				return counter;
			}
		}
		catch (exception)
		{			
			console.error(exception);
		}
	},	
	
	/**
	 * A wrapper function for the Salsa20 encryption of a message 
	 * @param {String|Array|Uint8Array} key A hexadecimal string e.g. 'ab0de1f2...' or array of bytes e.g. [0, 255, 22, ...] equal to 128 bits or 256 bits
	 * @param {String|Array|Uint8Array} message The plaintext message. This can be an array of bytes, a ASCII/UTF-8 string or also a hexadecimal string e.g. 'ab0de1f2...' if { inputTextType: 'hex' } is passed in the options object.
	 * @param {String|Array|Uint8Array|Number} nonce A 64-bit one time cryptographic nonce i.e. the message number. This can be input as a hexadecimal string of 16 symbols, a byte array of 8 bytes or an integer between 0 and 2^53 inclusive.
	 * @param {Number} counter An integer specifying the block to start encrypting from. Normally a 0 should be passed. If encrypting part of a large file it is also possible to enter the block number and it will start encrypting from that point. The maximum integer allowed for JavaScript is 2^53 (9007199254740992).
	 * @param {Object} options Optional object with additional options:
	 *		inputTextType: 'hex' - The input message will be a hex string, otherwise by default it will parse it as an ASCII/UTF-8 string
	 *		returnType: 'hex' - Returns the encrypted data as a hex string, otherwise by default it will return an array of bytes
	 * @returns {Array|String} Returns an array of bytes or a hexadecimal string
	 */
	encrypt: function(key, message, nonce, counter, options)
	{
		// If the options are unset, set to a blank object
		if (typeof options === 'undefined')
		{
			options = {};
		}
		
		// Normalise the various input formats to what is required for the encryption function
		key = this.parseKey(key);
		message = this.parseMessage(message, options);
		nonce = this.parseNonce(nonce);
		counter = this.parseCounter(counter, message.length);
		
		// Encrypt starting from the specified counter
		var encryptedBytes = this.encryption(key, message, nonce, counter);
		
		// If the return type requested is hex, convert the bytes to hex
		if (options.hasOwnProperty('returnType') && (options.returnType === 'hex'))
		{
			return this.bytesToHex(encryptedBytes);
		}
		else {
			// By default return a byte array
			return encryptedBytes;
		}
	},
	
	/**
	 * A wrapper function for the Salsa20 encryption of a message
	 * @param {String|Array|Uint8Array} key A hexadecimal string e.g. 'ab0de1f2...' or array of bytes e.g. [0, 255, 22, ...] equal to 128 bits or 256 bits
	 * @param {String|Array|Uint8Array} ciphertext The ciphertext message. This can be an array of bytes or also a hexadecimal string e.g. 'ab0de1f2...' if { inputTextType: 'hex' } is passed in the options object. Otherwise a byte array is used as default.
	 * @param {String|Array|Uint8Array|Number} nonce A hex string of 16 symbols, a byte array of 8 bytes or an integer between 0 and 2^53 inclusive
	 * @param {Number} counter An integer specifying the block to start decrypting from. The default should be 0. If decrypting part of a large file it is also possible to enter the block number and it will start decrypting from that point. The maximum integer allowed for JavaScript is 2^53 (9007199254740992).
	 * @param {Object} options Optional object with additional options:
	 *		inputTextType: 'hex' - The input ciphertext will be a hex string, otherwise by default it will parse it as an array of bytes
	 *		returnType: 'hex' - Returns the encrypted data as a hex string, otherwise by default it will return an ASCII/UTF-8 string
	 * @returns {String} By default it will return an ASCII/UTF-8 string, unless the { returnType: 'hex' } option is passed
	 */
	decrypt: function(key, ciphertext, nonce, counter, options)
	{
		// If the options are unset, set to a blank object
		if (typeof options === 'undefined')
		{
			options = {};
		}
		
		// Normalise the various input formats to what is required for the encryption function
		key = this.parseKey(key);
		ciphertext = this.parseMessage(ciphertext, options);
		nonce = this.parseNonce(nonce);
		counter = this.parseCounter(counter, ciphertext.length);
		
		// Decrypt starting from the specified counter
		var decryptedBytes = this.encryption(key, ciphertext, nonce, counter);
		
		// If the return type requested is hex, convert the bytes to hex
		if (options.hasOwnProperty('returnType') && (options.returnType === 'hex'))
		{
			return this.bytesToHex(decryptedBytes);
		}
		else {
			// Decode from bytes to UTF-8 string
			return this.bytesToUtf8String(decryptedBytes);
		}
	}
};