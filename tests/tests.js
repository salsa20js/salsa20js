/**
 * Salsa20js - Salsa20/20 JavaScript implementation - unit tests
 * https://github.com/salsa20js/salsa20js
 * 
 * Copyright (c) 2015 Joshua M. David
 * Released under the MIT License
 * https://github.com/salsa20js/salsa20js/blob/master/LICENSE.md
 */

// Use ECMAScript 5's strict mode
'use strict';

/**
 * Reimplement the join operator for testing if the browsers support for the new typed arrays is limited
 */
if (!Uint32Array.prototype.join)
{
	Uint32Array.prototype.join = function(separator)
	{
		var output = '';

		for (var i = 0, length = this.length, lastItem = length - 1; i < length; i++)
		{
			if (i === lastItem)
			{
				output += this[i].toString();
			}
			else {
				output += this[i].toString() + separator;
			}
		}

		return output;
	};
}

/**
 * Reimplement the join operator for testing if the browsers support for the new typed arrays is limited
 */
if (!Uint8Array.prototype.join)
{
	Uint8Array.prototype.join = function(separator)
	{
		var output = '';

		for (var i = 0, length = this.length, lastItem = length - 1; i < length; i++)
		{
			if (i === lastItem)
			{
				output += this[i].toString();
			}
			else {
				output += this[i].toString() + separator;
			}
		}

		return output;
	};
}

/**
 * Bytes to hex and hex to bytes conversion
 */

// Convert hex to bytes
var hexA = '00112233445566778899aabbccddeeff';
var hexB = 'a0b1c2d3e4f5a6b7c8d9';

var bytesA = Salsa20.core.util.hexToBytes(hexA);
var bytesB = Salsa20.core.util.hexToBytes(hexB);

var expectedBytesA = new Uint8Array([0, 17, 34, 51, 68, 85, 102, 119, 136, 153, 170, 187, 204, 221, 238, 255]);
var expectedBytesB = new Uint8Array([160, 177, 194, 211, 228, 245, 166, 183, 200, 217]);

// Convert back to hex
var conversionBackToHexA = Salsa20.core.util.bytesToHex(expectedBytesA);
var conversionBackToHexB = Salsa20.core.util.bytesToHex(expectedBytesB);

QUnit.test('Bytes to hex and hex to bytes conversion', function(assert) {
	assert.deepEqual(bytesA, expectedBytesA, '[' + bytesA.join(', ') + '] should equal [' + expectedBytesA.join(', ') + ']');
	assert.deepEqual(bytesB, expectedBytesB, '[' + bytesB.join(', ') + '] should equal [' + expectedBytesB.join(', ') + ']');
	
	assert.ok(conversionBackToHexA === hexA, conversionBackToHexA + ' should equal ' + hexA);
	assert.ok(conversionBackToHexB === hexB, conversionBackToHexB + ' should equal ' + hexB);	
});


/**
 * Tests from Section 2: Words
 */

// A word is written in hexadecimal 0xc0a8787e = 3232266366
var hexToDecimalWordConversion = Salsa20.core.util.hexToDec('c0a8787e');

// Convert decimal back to hexadecimal word of 4 bytes
var decimalWordToHexConversion = Salsa20.core.util.decToHex(3232266366);

// Test adding two words together
var wordA = Salsa20.core.util.hexToDec('c0a8787e');
var wordB = Salsa20.core.util.hexToDec('9fd1161d');
var sumWords = Salsa20.core.util.sumWords(wordA, wordB);
var sumWordsHex = Salsa20.core.util.decToHex(sumWords);

// Test XORing two hex words together
var xorWords = Salsa20.core.util.xorWords(wordA, wordB);
var xorWordsHex = Salsa20.core.util.decToHex(xorWords);

// Test left rotation of a word by x bits
var leftRotatedWord = Salsa20.core.util.leftRotate(wordA, 5);
var leftRotatedWordHex = Salsa20.core.util.decToHex(leftRotatedWord);

QUnit.test('Section 2: Words', function(assert) {
	assert.ok(hexToDecimalWordConversion === 3232266366, 'A word is written in hexadecimal 0xc0a8787e = 3232266366. Result: ' + hexToDecimalWordConversion);
	assert.ok(decimalWordToHexConversion === 'c0a8787e', 'Convert decimal back to hexadecimal word of 4 bytes. Result: ' + decimalWordToHexConversion);
	assert.ok(sumWordsHex === '60798e9b', 'The sum of two words 0xc0a8787e + 0x9fd1161d = 0x60798e9b. Result: ' + sumWordsHex);
	assert.ok(xorWordsHex === '5f796e63', 'The exclusive-or of two words 0xc0a8787e ⊕ 0x9fd1161d = 0x5f796e63. Result: ' + xorWordsHex);
	assert.ok(leftRotatedWordHex === '150f0fd8', 'The c-bit left rotation of a word 0xc0a8787e <<< 5 = 0x150f0fd8. Result: ' + leftRotatedWordHex);
});



/**
 * Tests from Section 3: The quarterround function
 */

// Test inputs
var qrInput1 = Salsa20.core.util.hexWordsToDecWords(['00000000', '00000000', '00000000', '00000000']);
var qrInput2 = Salsa20.core.util.hexWordsToDecWords(['00000001', '00000000', '00000000', '00000000']);
var qrInput3 = Salsa20.core.util.hexWordsToDecWords(['00000000', '00000001', '00000000', '00000000']);
var qrInput4 = Salsa20.core.util.hexWordsToDecWords(['00000000', '00000000', '00000001', '00000000']);
var qrInput5 = Salsa20.core.util.hexWordsToDecWords(['00000000', '00000000', '00000000', '00000001']);
var qrInput6 = Salsa20.core.util.hexWordsToDecWords(['e7e8c006', 'c4f9417d', '6479b4b2', '68c67137']);
var qrInput7 = Salsa20.core.util.hexWordsToDecWords(['d3917c5b', '55f1c407', '52a58a7a', '8f887a3b']);

var qrTest1 = Salsa20.core.quarterRound(qrInput1[0], qrInput1[1], qrInput1[2], qrInput1[3]);
var qrTest2 = Salsa20.core.quarterRound(qrInput2[0], qrInput2[1], qrInput2[2], qrInput2[3]);
var qrTest3 = Salsa20.core.quarterRound(qrInput3[0], qrInput3[1], qrInput3[2], qrInput3[3]);
var qrTest4 = Salsa20.core.quarterRound(qrInput4[0], qrInput4[1], qrInput4[2], qrInput4[3]);
var qrTest5 = Salsa20.core.quarterRound(qrInput5[0], qrInput5[1], qrInput5[2], qrInput5[3]);
var qrTest6 = Salsa20.core.quarterRound(qrInput6[0], qrInput6[1], qrInput6[2], qrInput6[3]);
var qrTest7 = Salsa20.core.quarterRound(qrInput7[0], qrInput7[1], qrInput7[2], qrInput7[3]);

// Expected results
var qrExpectedResult1 = Salsa20.core.util.hexWordsToDecWords(['00000000', '00000000', '00000000', '00000000']);
var qrExpectedResult2 = Salsa20.core.util.hexWordsToDecWords(['08008145', '00000080', '00010200', '20500000']);
var qrExpectedResult3 = Salsa20.core.util.hexWordsToDecWords(['88000100', '00000001', '00000200', '00402000']);
var qrExpectedResult4 = Salsa20.core.util.hexWordsToDecWords(['80040000', '00000000', '00000001', '00002000']);
var qrExpectedResult5 = Salsa20.core.util.hexWordsToDecWords(['00048044', '00000080', '00010000', '20100001']);
var qrExpectedResult6 = Salsa20.core.util.hexWordsToDecWords(['e876d72b', '9361dfd5', 'f1460244', '948541a3']);
var qrExpectedResult7 = Salsa20.core.util.hexWordsToDecWords(['3e2f308c', 'd90a8f36', '6ab2a923', '2883524c']);

QUnit.test('Section 3: The quarterround function', function(assert) {
	assert.deepEqual(qrTest1, qrExpectedResult1, '[' + qrTest1.join(', ') + '] should equal [' + qrExpectedResult1.join(', ') + ']');
	assert.deepEqual(qrTest2, qrExpectedResult2, '[' + qrTest2.join(', ') + '] should equal [' + qrExpectedResult2.join(', ') + ']');
	assert.deepEqual(qrTest3, qrExpectedResult3, '[' + qrTest3.join(', ') + '] should equal [' + qrExpectedResult3.join(', ') + ']');
	assert.deepEqual(qrTest4, qrExpectedResult4, '[' + qrTest4.join(', ') + '] should equal [' + qrExpectedResult4.join(', ') + ']');
	assert.deepEqual(qrTest5, qrExpectedResult5, '[' + qrTest5.join(', ') + '] should equal [' + qrExpectedResult5.join(', ') + ']');
	assert.deepEqual(qrTest6, qrExpectedResult6, '[' + qrTest6.join(', ') + '] should equal [' + qrExpectedResult6.join(', ') + ']');
	assert.deepEqual(qrTest7, qrExpectedResult7, '[' + qrTest7.join(', ') + '] should equal [' + qrExpectedResult7.join(', ') + ']');
});


/**
 * Tests from Section 4: The rowround function
 */

// Test inputs
var rrTestInput1 = Salsa20.core.util.hexWordsToDecWords([
	'00000001', '00000000', '00000000', '00000000',
	'00000001', '00000000', '00000000', '00000000',
	'00000001', '00000000', '00000000', '00000000',
	'00000001', '00000000', '00000000', '00000000'
]);
var rrTestInput2 = Salsa20.core.util.hexWordsToDecWords([
	'08521bd6', '1fe88837', 'bb2aa576', '3aa26365',
	'c54c6a5b', '2fc74c2f', '6dd39cc3', 'da0a64f6',
	'90a2f23d', '067f95a6', '06b35f61', '41e4732e',
	'e859c100', 'ea4d84b7', '0f619bff', 'bc6e965a'
]);

// Perform the rowround function
var rrTest1 = Salsa20.core.rowRound(rrTestInput1);
var rrTest2 = Salsa20.core.rowRound(rrTestInput2);

// Expected results
var rrExpectedResult1 = Salsa20.core.util.hexWordsToDecWords([
	'08008145', '00000080', '00010200', '20500000',
	'20100001', '00048044', '00000080', '00010000',
	'00000001', '00002000', '80040000', '00000000',
	'00000001', '00000200', '00402000', '88000100'
]);
var rrExpectedResult2 = Salsa20.core.util.hexWordsToDecWords([
	'a890d39d', '65d71596', 'e9487daa', 'c8ca6a86',
	'949d2192', '764b7754', 'e408d9b9', '7a41b4d1',
	'3402e183', '3c3af432', '50669f96', 'd89ef0a8',
	'0040ede5', 'b545fbce', 'd257ed4f', '1818882d'
]);

QUnit.test('Section 4: The rowround function', function(assert) {
	assert.deepEqual(rrTest1, rrExpectedResult1, '[' + rrTest1.join(', ') + '] should equal [' + rrExpectedResult1.join(', ') + ']');
	assert.deepEqual(rrTest2, rrExpectedResult2, '[' + rrTest2.join(', ') + '] should equal [' + rrExpectedResult2.join(', ') + ']');
});


/**
 * Tests from Section 5: The columnround function
 */

// Test inputs
var crTestInput1 = Salsa20.core.util.hexWordsToDecWords([
	'00000001', '00000000', '00000000', '00000000',
	'00000001', '00000000', '00000000', '00000000',
	'00000001', '00000000', '00000000', '00000000',
	'00000001', '00000000', '00000000', '00000000'
]);
var crTestInput2 = Salsa20.core.util.hexWordsToDecWords([
	'08521bd6', '1fe88837', 'bb2aa576', '3aa26365',
	'c54c6a5b', '2fc74c2f', '6dd39cc3', 'da0a64f6',
	'90a2f23d', '067f95a6', '06b35f61', '41e4732e',
	'e859c100', 'ea4d84b7', '0f619bff', 'bc6e965a'
]);

// Perform the columnround function
var crTest1 = Salsa20.core.columnRound(crTestInput1);
var crTest2 = Salsa20.core.columnRound(crTestInput2);

// Expected results
var crExpectedResult1 = Salsa20.core.util.hexWordsToDecWords([
	'10090288', '00000000', '00000000', '00000000',
	'00000101', '00000000', '00000000', '00000000',
	'00020401', '00000000', '00000000', '00000000',
	'40a04001', '00000000', '00000000', '00000000'
]);
var crExpectedResult2 = Salsa20.core.util.hexWordsToDecWords([
	'8c9d190a', 'ce8e4c90', '1ef8e9d3', '1326a71a',
	'90a20123', 'ead3c4f3', '63a091a0', 'f0708d69',
	'789b010c', 'd195a681', 'eb7d5504', 'a774135c',
	'481c2027', '53a8e4b5', '4c1f89c5', '3f78c9c8'
]);

QUnit.test('Section 5: The columnround function', function(assert) {
	assert.deepEqual(crTest1, crExpectedResult1, '[' + crTest1.join(', ') + '] should equal [' + crExpectedResult1.join(', ') + ']');
	assert.deepEqual(crTest2, crExpectedResult2, '[' + crTest2.join(', ') + '] should equal [' + crExpectedResult2.join(', ') + ']');
});


/**
 * Tests from Section 6: The doubleround function
 */

// Test inputs
var crTestInput1 = Salsa20.core.util.hexWordsToDecWords([
	'00000001', '00000000', '00000000', '00000000',
	'00000000', '00000000', '00000000', '00000000',
	'00000000', '00000000', '00000000', '00000000',
	'00000000', '00000000', '00000000', '00000000'
]);
var crTestInput2 = Salsa20.core.util.hexWordsToDecWords([
	'de501066', '6f9eb8f7', 'e4fbbd9b', '454e3f57',
	'b75540d3', '43e93a4c', '3a6f2aa0', '726d6b36',
	'9243f484', '9145d1e8', '4fa9d247', 'dc8dee11',
	'054bf545', '254dd653', 'd9421b6d', '67b276c1'
]);

// Perform the doubleround function
var drTest1 = Salsa20.core.doubleRound(crTestInput1);
var drTest2 = Salsa20.core.doubleRound(crTestInput2);

// Expected results
var drExpectedResult1 = Salsa20.core.util.hexWordsToDecWords([
	'8186a22d', '0040a284', '82479210', '06929051',
	'08000090', '02402200', '00004000', '00800000',
	'00010200', '20400000', '08008104', '00000000',
	'20500000', 'a0000040', '0008180a', '612a8020'
]);
var drExpectedResult2 = Salsa20.core.util.hexWordsToDecWords([
	'ccaaf672', '23d960f7', '9153e63a', 'cd9a60d0',
	'50440492', 'f07cad19', 'ae344aa0', 'df4cfdfc',
	'ca531c29', '8e7943db', 'ac1680cd', 'd503ca00',
	'a74b2ad6', 'bc331c5c', '1dda24c7', 'ee928277'
]);

QUnit.test('Section 6: The doubleround function', function(assert) {
	assert.deepEqual(drTest1, drExpectedResult1, '[' + drTest1.join(', ') + '] should equal [' + drExpectedResult1.join(', ') + ']');
	assert.deepEqual(drTest2, drExpectedResult2, '[' + drTest2.join(', ') + '] should equal [' + drExpectedResult2.join(', ') + ']');
});


/**
 * Tests from Section 7: The littleendian function
 */

// Run littleendian tests
var leTest1 = Salsa20.core.littleEndian(0, 0, 0, 0);
var leTest2 = Salsa20.core.littleEndian(86, 75, 30, 9);
var leTest3 = Salsa20.core.littleEndian(255, 255, 255, 250);

// Expected results
var leExpectedResult1 = Salsa20.core.util.hexToDec('00000000');
var leExpectedResult2 = Salsa20.core.util.hexToDec('091e4b56');
var leExpectedResult3 = Salsa20.core.util.hexToDec('faffffff');


// Run inverse littleendian tests
var leInverseTest1 = Salsa20.core.littleEndianInverse(leExpectedResult1);
var leInverseTest2 = Salsa20.core.littleEndianInverse(leExpectedResult2);
var leInverseTest3 = Salsa20.core.littleEndianInverse(leExpectedResult3);

// Expected results
var leInverseExpectedResult1 = new Uint8Array([0, 0, 0, 0]);
var leInverseExpectedResult2 = new Uint8Array([86, 75, 30, 9]);
var leInverseExpectedResult3 = new Uint8Array([255, 255, 255, 250]);

QUnit.test('Section 7: The littleendian function', function(assert) {
	assert.ok(leTest1 === leExpectedResult1, 'Result: ' + leTest1 + ' should equal ' + leExpectedResult1);
	assert.ok(leTest2 === leExpectedResult2, 'Result: ' + leTest2 + ' should equal ' + leExpectedResult2);
	assert.ok(leTest3 === leExpectedResult3, 'Result: ' + leTest3 + ' should equal ' + leExpectedResult3);
	assert.deepEqual(leInverseTest1, leInverseExpectedResult1, 'Inverse result: [' + leInverseTest1.join(', ') + '] should equal [' + leInverseExpectedResult1.join(', ') + ']');
	assert.deepEqual(leInverseTest2, leInverseExpectedResult2, 'Inverse result: [' + leInverseTest2.join(', ') + '] should equal [' + leInverseExpectedResult2.join(', ') + ']');
	assert.deepEqual(leInverseTest3, leInverseExpectedResult3, 'Inverse result: [' + leInverseTest3.join(', ') + '] should equal [' + leInverseExpectedResult3.join(', ') + ']');	
});


/**
 * Tests from Section 8: The Salsa20 hash function
 */

// Test inputs
var hashInput1 = new Uint8Array([
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]);
var hashInput2 = new Uint8Array([
	211, 159, 13, 115, 76, 55, 82, 183, 3, 117, 222, 37, 191, 187, 234, 136, 
	49, 237, 179, 48, 1, 106, 178, 219, 175, 199, 166, 48, 86, 16, 179, 207, 
	31, 240, 32, 63, 15, 83, 93, 161, 116, 147, 48, 113, 238, 55, 204, 36, 
	79, 201, 235, 79, 3, 81, 156, 47, 203, 26, 244, 243, 88, 118, 104, 54
]);
var hashInput3 = new Uint8Array([
	88, 118, 104, 54, 79, 201, 235, 79, 3, 81, 156, 47, 203, 26, 244, 243, 
	191, 187, 234, 136, 211, 159, 13, 115, 76, 55, 82, 183, 3, 117, 222, 37, 
	86, 16, 179, 207, 49, 237, 179, 48, 1, 106, 178, 219, 175, 199, 166, 48, 
	238, 55, 204, 36, 31, 240, 32, 63, 15, 83, 93, 161, 116, 147, 48, 113
]);

// Run hash tests
var hashTest1 = Salsa20.core.hash(hashInput1);
var hashTest2 = Salsa20.core.hash(hashInput2);
var hashTest3 = Salsa20.core.hash(hashInput3);

// Expected results
var hashExpectedResult1 = new Uint8Array([
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]);
var hashExpectedResult2 = new Uint8Array([
	109, 42, 178, 168, 156, 240, 248, 238, 168, 196, 190, 203, 26, 110, 170, 154, 
	29, 29, 150, 26, 150, 30, 235, 249, 190, 163, 251, 48, 69, 144, 51, 57, 
	118, 40, 152, 157, 180, 57, 27, 94, 107, 42, 236, 35, 27, 111, 114, 114, 
	219, 236, 232, 135, 111, 155, 110, 18, 24, 232, 95, 158, 179, 19, 48, 202
]);
var hashExpectedResult3 = new Uint8Array([
	179, 19, 48, 202, 219, 236, 232, 135, 111, 155, 110, 18, 24, 232, 95, 158, 
	26, 110, 170, 154, 109, 42, 178, 168, 156, 240, 248, 238, 168, 196, 190, 203, 
	69, 144, 51, 57, 29, 29, 150, 26, 150, 30, 235, 249, 190, 163, 251, 48, 
	27, 111, 114, 114, 118, 40, 152, 157, 180, 57, 27, 94, 107, 42, 236, 35
]);

QUnit.test('Section 8: The Salsa20 hash function', function(assert) {
	assert.deepEqual(hashTest1, hashExpectedResult1, '[' + hashTest1.join(', ') + '] should equal [' + hashExpectedResult1.join(', ') + ']');
	assert.deepEqual(hashTest2, hashExpectedResult2, '[' + hashTest2.join(', ') + '] should equal [' + hashExpectedResult2.join(', ') + ']');
	assert.deepEqual(hashTest3, hashExpectedResult3, '[' + hashTest3.join(', ') + '] should equal [' + hashExpectedResult3.join(', ') + ']');
});


/**
 * Additional test from Section 8: The Salsa20 hash function
 * This is CPU intensive so requires a web worker thread
 */
$(function()
{
	// Test input to be passed into Salsa20.core.hash 1 million times
	var hashTest4 = new Uint8Array([
		6, 124, 83, 146, 38, 191, 9, 50, 4, 161, 47, 222, 122, 182, 223, 185, 
		75, 27, 0, 216, 16, 122, 7, 89, 162, 104, 101, 147, 213, 21, 54, 95, 
		225, 253, 139, 176, 105, 132, 23, 116, 76, 41, 176, 207, 221, 34, 157, 108, 
		94, 94, 99, 52, 90, 117, 91, 220, 146, 190, 239, 143, 196, 176, 130, 186
	]);

	// Expected results
	var hashExpectedResult4 = new Uint8Array([
		8, 18, 38, 199, 119, 76, 215, 67, 173, 127, 144, 162, 103, 212, 176, 217, 
		192, 19, 233, 33, 159, 197, 154, 160, 128, 243, 219, 65, 171, 136, 135, 225, 
		123, 11, 68, 86, 237, 82, 20, 155, 133, 189, 9, 83, 167, 116, 194, 78, 
		122, 127, 195, 185, 185, 204, 188, 90, 245, 9, 183, 248, 226, 85, 245, 104
	]);
	
	// Set start time because this test can take over 5 minutes
	var startTime = new Date();
	
	// Convert the base URL so the web worker can import the script
	// Also load the JavaScript code on the HTML page which is what the worker will run
	var baseUrl = window.location.href.replace(/\\/g, '/').replace(/\/[^\/]*$/, '').replace('tests.html', '') + '/';
	var array = ['var baseUrl = "' + baseUrl + '";' + $('#salsa20-hash-worker').html()];

	// Create a Blob to hold the JavaScript code and send it to the inline worker
	var blob = new Blob(array, { type: "text/javascript" });
	var blobUrl = window.URL.createObjectURL(blob);
	var worker = new Worker(blobUrl);

	// When the worker is complete
	worker.addEventListener('message', function(event)
	{		
		// Get the result back
		hashTest4 = event.data.hashTest4;
		
		// Current time
		var currentTime = new Date();
		
		// Calculate time taken in milliseconds and seconds
		var milliseconds = currentTime.getTime() - startTime.getTime();
		var seconds = (milliseconds / 1000).toFixed(3);
		
		// Show the time the process started if applicable
		var timeElapsedMessage = 'Total time elapsed: ' + milliseconds + ' ms (' + seconds + ' s).';

		// Compare the results
		QUnit.test('Section 8: The Salsa20 hash function final test with 1,000,000 iterations', function(assert)
		{
			assert.deepEqual(hashTest4, hashExpectedResult4, '[' + hashTest4.join(', ') + '] should equal [' + hashExpectedResult4.join(', ') + ']. ' + timeElapsedMessage);
		});
		
	}, false);

	// Worker error handler
	worker.addEventListener('error', function(e)
	{
		console.log('ERROR: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);

	}, false);

	// Send data to the worker
	worker.postMessage({
		hashTest4: hashTest4
	});

	// Free up memory
	window.URL.revokeObjectURL(blobUrl);
});


/**
 * Tests from Section 9: The Salsa20 expansion function
 */

// The constants σ0 σ1 σ2 σ3 and τ0 τ1 τ2 τ3 are "expand 32-byte k" and "expand 16-byte k" in ASCII.
var constants16 = "expand 16-byte k";
var constants16ExpectedBytes = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 49, 54, 45, 98, 121, 116, 101, 32, 107]);
var constants16ResultAsciiBytes = new Uint8Array(16);

var constants32 = "expand 32-byte k";
var constants32ExpectedBytes = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);	
var constants32ResultAsciiBytes = new Uint8Array(16);

// Test conversion of constant strings to ASCII and check the bytes match
for (var i = 0, length = constants32.length; i < length; i++)
{
	constants32ResultAsciiBytes[i] = constants32.charCodeAt(i);
	constants16ResultAsciiBytes[i] = constants16.charCodeAt(i);
}


// Test byte arrays
var startArrayToFill = new Uint8Array(64);
var arrayToFillFromA = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
var arrayToFillFromB = new Uint8Array([16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]);
var arrayToFillFromC = new Uint8Array([32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]);
var arrayToFillFromD = new Uint8Array([48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63]);

// Test filling a typed array with bytes from other arrays
Salsa20.core.util.updateArray(startArrayToFill, arrayToFillFromA, 0);
Salsa20.core.util.updateArray(startArrayToFill, arrayToFillFromB, 16);
Salsa20.core.util.updateArray(startArrayToFill, arrayToFillFromC, 32);
Salsa20.core.util.updateArray(startArrayToFill, arrayToFillFromD, 48);

var filledArrayExpectedResult = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63]);


// Salsa20 k0, k1(n) (256 bit key) expansion
var expansionTest1Key0 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
var expansionTest1Key1 = new Uint8Array([201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216]);
var expansionTest1Nonce = new Uint8Array([101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116]);
var expansionTest1ExpectedResult = new Uint8Array([
									69, 37, 68, 39, 41, 15, 107, 193, 255, 139, 122, 6, 170, 233, 217, 98, 
                                    89, 144, 182, 106, 21, 51, 200, 65, 239, 49, 222, 34, 215, 114, 40, 126, 
                                    104, 197, 7, 225, 197, 153, 31, 2, 102, 78, 76, 176, 84, 245, 246, 184, 
                                    177, 160, 133, 130, 6, 72, 149, 119, 192, 195, 132, 236, 234, 103, 246, 74]);
var expansionTest1Result = Salsa20.core.expansion(expansionTest1Nonce, expansionTest1Key0, expansionTest1Key1);

// Salsa20 k0(n) (128 bit key) expansion
var expansionTest2Key0 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
var expansionTest2Nonce = new Uint8Array([101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116]);
var expansionTest2ExpectedResult = new Uint8Array([
									39, 173, 46, 248, 30, 200, 82, 17, 48, 67, 254, 239, 37, 18, 13, 247, 
                                    241, 200, 61, 144, 10, 55, 50, 185, 6, 47, 246, 253, 143, 86, 187, 225, 
                                    134, 85, 110, 246, 161, 163, 43, 235, 231, 94, 171, 51, 145, 214, 112, 29, 
                                    14, 232, 5, 16, 151, 140, 183, 141, 171, 9, 122, 181, 104, 182, 177, 193]);
var expansionTest2Result = Salsa20.core.expansion(expansionTest2Nonce, expansionTest2Key0, []);

QUnit.test('Section 9: The Salsa20 expansion function', function(assert)
{
	assert.deepEqual(constants16ResultAsciiBytes, constants16ExpectedBytes, 'expand 16-byte k [' + constants16ResultAsciiBytes.join(', ') + '] should equal [' + constants16ExpectedBytes.join(', ') + '].');
	assert.deepEqual(constants32ResultAsciiBytes, constants32ExpectedBytes, 'expand 32-byte k [' + constants32ResultAsciiBytes.join(', ') + '] should equal [' + constants32ExpectedBytes.join(', ') + '].');
	
	assert.deepEqual(startArrayToFill, filledArrayExpectedResult, 'filled typed array [' + startArrayToFill.join(', ') + '] should equal [' + filledArrayExpectedResult.join(', ') + '].');
	
	assert.deepEqual(expansionTest1Result, expansionTest1ExpectedResult, '[' + expansionTest1Result.join(', ') + '] should equal [' + expansionTest1ExpectedResult.join(', ') + '].');
	assert.deepEqual(expansionTest2Result, expansionTest2ExpectedResult, '[' + expansionTest2Result.join(', ') + '] should equal [' + expansionTest2ExpectedResult.join(', ') + '].');
});


/**
 * Tests for Section 10: The Salsa20 encryption function
 */

// Get all bytes from 0 - 255 and put in an array
var allPossibleBytes = new Uint8Array(256);

for (var i = 0; i < 256; i++)
{
	allPossibleBytes[i] = i;
}

// Use a random order for the bytes
var allPossibleBytesRandomOrder = new Uint8Array([250, 104, 174, 108, 71, 105, 45, 80, 220, 254, 233, 82, 231, 200, 99, 86, 249, 161, 15, 180, 198, 19, 130, 77, 115, 100, 6, 192, 138, 190, 4, 90, 124, 181, 188, 206, 202, 204, 110, 186, 55, 162, 46, 239, 85, 142, 37, 2, 210, 176, 89, 1, 69, 230, 35, 234, 0, 101, 197, 9, 122, 173, 191, 223, 185, 5, 120, 106, 237, 73, 147, 28, 102, 217, 209, 97, 213, 50, 203, 40, 145, 48, 22, 172, 229, 17, 215, 212, 127, 219, 150, 42, 59, 96, 72, 31, 125, 128, 226, 114, 51, 56, 27, 20, 29, 58, 25, 159, 132, 11, 8, 44, 54, 224, 251, 137, 146, 208, 187, 91, 149, 171, 33, 164, 246, 169, 107, 163, 165, 242, 10, 52, 155, 103, 148, 65, 7, 240, 94, 248, 81, 98, 244, 93, 76, 68, 207, 135, 123, 140, 157, 43, 225, 13, 201, 16, 195, 26, 109, 232, 53, 78, 193, 151, 131, 95, 221, 49, 199, 14, 205, 170, 111, 245, 134, 222, 3, 75, 62, 112, 214, 156, 177, 34, 116, 84, 238, 129, 143, 152, 243, 139, 241, 160, 211, 66, 144, 12, 36, 189, 47, 196, 88, 167, 194, 64, 168, 158, 113, 24, 252, 253, 133, 87, 57, 119, 79, 39, 67, 166, 74, 247, 18, 227, 61, 236, 141, 63, 21, 23, 41, 121, 117, 235, 255, 30, 216, 182, 92, 218, 183, 179, 228, 126, 136, 70, 178, 32, 38, 153, 83, 60, 175, 118, 184, 154]);
var xoredBytes = new Uint8Array(256);

// XOR the 0 - 255 order bytes with the random order bytes
// This will rule out any bytes incorrectly overflowing the 0 - 255 range when using the xorTwoBytes function
for (var i = 0; i < 256; i++)
{
	var xoredByte = Salsa20.core.util.xorTwoBytes(allPossibleBytes[i], allPossibleBytesRandomOrder[i]);
	xoredBytes[i] = xoredByte;
}

// Get all bytes as hex
var allPossibleBytesAsHex = Salsa20.core.util.bytesToHex(allPossibleBytes);
var allPossibleBytesRandomOrderAsHex = Salsa20.core.util.bytesToHex(allPossibleBytesRandomOrder);
var xoredBytesAsHex = Salsa20.core.util.bytesToHex(xoredBytes);

// A correct XOR of the bytes from the two arrays (tested against output of an independent program)
var xoredBytesExpectedResultAsHex = 'fa69ac6f436c2b57d4f7e359ebc56d59e9b01da7d206945a6b7d1cdb96a31a455c949eedeee9489d1f8b04c479a30b2de2816b3271d315dd385cff32469081e0f9443a29a90cd55b2e909b2a997f8567c16144ffb14481832782cc71673d16401de18011575d7d73755373f4e8666643469189fae6a5cd2cedd25bdf8ad415dc257388b71fe212c68f79d473ddef7ad2dcd55d14ef190bbc7994538b5f87f37795ef633427fa7b966fa76701c3582871b3fa8cc362290795cced543a33254d343161118154c9e27ae70d926c0e8d6651a1c92e2e5182efa097fe997d962acc3cdd0d6fdcf1f2cf9e9d0215f5345bb2354742168d7cb344d7de60a9c7538b4665';


// Test various counters
var counter0 = 0;
var counter1 = 2;
var counter2 = 255;
var counter3 = 256;
var counter4 = 1234567890;
var counter5 = Math.pow(2, 32);				// 2^32
var counter6 = Salsa20.core.util.maxInteger;			// 2^53 - 1 (max that JavaScript can handle with Number type)

// Test converting the counter from a number to a fixed 8 byte array
var bytes0 = Salsa20.core.util.numToEightByteArray(counter0);
var bytes1 = Salsa20.core.util.numToEightByteArray(counter1);
var bytes2 = Salsa20.core.util.numToEightByteArray(counter2);
var bytes3 = Salsa20.core.util.numToEightByteArray(counter3);
var bytes4 = Salsa20.core.util.numToEightByteArray(counter4);
var bytes5 = Salsa20.core.util.numToEightByteArray(counter5);
var bytes6 = Salsa20.core.util.numToEightByteArray(counter6);

// Expected bytes
var bytesExpected0 = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
var bytesExpected1 = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 2]);
var bytesExpected2 = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 255]);
var bytesExpected3 = new Uint8Array([0, 0, 0, 0, 0, 0, 1, 0]);
var bytesExpected4 = new Uint8Array([0, 0, 0, 0, 73, 150, 2, 210]);
var bytesExpected5 = new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0]);
var bytesExpected6 = new Uint8Array([0, 31, 255, 255, 255, 255, 255, 255]);


// Test splitting key into two arrays
var testSplitKey128Bit = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
var testSplitKey256Bit = new Uint8Array([
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
	201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216
]);

// Split keys
var testSplitKey128BitResult = Salsa20.core.util.splitKey(testSplitKey128Bit);
var testSplitKey256BitResult = Salsa20.core.util.splitKey(testSplitKey256Bit);

// Expected results
var testSplitKey128BitExpectedResult = {
	key0: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
	key1: new Uint8Array(0)
};
var testSplitKey256BitExpectedResult = {
	key0: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
	key1: new Uint8Array([201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216])
};


// Test with 32 byte (256 bit key)
var encryptionKey0 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
var encryptionKey1 = new Uint8Array([201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216]);
var encryptionKeyCombined = new Uint8Array([
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
	201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216
]);
var encryptionMessage = new Uint8Array([
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]);
var encryptionNonce = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
var encryptionCounter = 0;
var encryptionCiphertext256BitKey = Salsa20.core.encryption(encryptionKeyCombined, encryptionMessage, encryptionNonce, encryptionCounter);

// This test encryption should match the exact result of the expansion function because it is XORing with zeros
var encryptionCounterAndNonceBytes = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
var encryptionExpectedResult256BitKey = Salsa20.core.expansion(encryptionCounterAndNonceBytes, encryptionKey0, encryptionKey1);

// Test with 16 byte (128 bit key)
var encryptionCiphertext128BitKey = Salsa20.core.encryption(encryptionKey0, encryptionMessage, encryptionNonce, encryptionCounter);
var encryptionExpectedResult128BitKey = Salsa20.core.expansion(encryptionCounterAndNonceBytes, encryptionKey0, []);


// Test encryption of 3 & 1/2 blocks (224 bytes)
var encryptionMessage2 = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];
var encryptionCiphertext2 = Salsa20.core.encryption(encryptionKeyCombined, encryptionMessage2, encryptionNonce, encryptionCounter);

// The test encryption above should match the exact result of the expansion function because it is XORing with zero byte message
// Create the 3 & 1/2 expansion key blocks
var encryptionCounterAndNonceBytes2A = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
var encryptionExpectedResult2A = Salsa20.core.expansion(encryptionCounterAndNonceBytes2A, encryptionKey0, encryptionKey1);

var encryptionCounterAndNonceBytes2B = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
var encryptionExpectedResult2B = Salsa20.core.expansion(encryptionCounterAndNonceBytes2B, encryptionKey0, encryptionKey1);

var encryptionCounterAndNonceBytes2C = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]);
var encryptionExpectedResult2C = Salsa20.core.expansion(encryptionCounterAndNonceBytes2C, encryptionKey0, encryptionKey1);

var encryptionCounterAndNonceBytes2D = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3]);
var encryptionExpectedResult2D = Salsa20.core.expansion(encryptionCounterAndNonceBytes2D, encryptionKey0, encryptionKey1);

// Combine the 3 & 1/2 expansion key blocks and truncate to 224 bytes
var encryptionExpectedResultCombined2 = new Uint8Array(256);
Salsa20.core.util.updateArray(encryptionExpectedResultCombined2, encryptionExpectedResult2A, 0);
Salsa20.core.util.updateArray(encryptionExpectedResultCombined2, encryptionExpectedResult2B, 64);
Salsa20.core.util.updateArray(encryptionExpectedResultCombined2, encryptionExpectedResult2C, 128);
Salsa20.core.util.updateArray(encryptionExpectedResultCombined2, encryptionExpectedResult2D, 192);		// now has 256 bytes

// Truncate the array (JavaScript slice not available for typed arrays)
var encryptionExpectedResultTruncated2 = new Uint8Array(224);
for (var i = 0; i < 224; i++)
{
	encryptionExpectedResultTruncated2[i] = encryptionExpectedResultCombined2[i];
}


// Test encryption and decryption
var encryptionMessage3 = new Uint8Array(256);
var encryptionKey3 = new Uint8Array(32);
var encryptionNonce3 = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
var encryptionCounter3 = 0;

// Use key from bytes 0 - 31
for (var i = 0; i < 32; i++) {
	encryptionKey3[i] = i;
}

// Test encryption and decryption of a message consisting of all bytes from 0 - 255
for (var i = 0; i < 256; i++) {
	encryptionMessage3[i] = i;
}

// Perform encryption and test decryption with 256 bit key
var encryptionCiphertext3 = Salsa20.core.encryption(encryptionKey3, encryptionMessage3, encryptionNonce3, encryptionCounter3);
var decryptionPlaintext3 = Salsa20.core.encryption(encryptionKey3, encryptionCiphertext3, encryptionNonce3, encryptionCounter3);

// Use key from bytes 0 - 15
var encryptionKey128BitKey3 = new Uint8Array(16);
for (var i = 0; i < 16; i++) {
	encryptionKey128BitKey3[i] = i;
}

// Perform encryption and test decryption with 128 bit key
var encryptionCiphertext128BitKey3 = Salsa20.core.encryption(encryptionKey128BitKey3, encryptionMessage3, encryptionNonce3, encryptionCounter3);
var decryptionPlaintext128BitKey3 = Salsa20.core.encryption(encryptionKey128BitKey3, encryptionCiphertext128BitKey3, encryptionNonce3, encryptionCounter3);

QUnit.test('Section 10: The Salsa20 encryption function', function(assert)
{
	assert.ok(xoredBytesAsHex === xoredBytesExpectedResultAsHex, 'XORed bytes: ' + xoredBytesAsHex + ' should equal ' + xoredBytesExpectedResultAsHex);
	
	assert.deepEqual(bytes0, bytesExpected0, 'Convert counter to bytes. Number: ' + counter0 + ' [' + bytes0.join(', ') + '] should equal [' + bytesExpected0.join(', ') + '].');
	assert.deepEqual(bytes1, bytesExpected1, 'Convert counter to bytes. Number: ' + counter1 + ' [' + bytes1.join(', ') + '] should equal [' + bytesExpected1.join(', ') + '].');
	assert.deepEqual(bytes2, bytesExpected2, 'Convert counter to bytes. Number: ' + counter2 + ' [' + bytes2.join(', ') + '] should equal [' + bytesExpected2.join(', ') + '].');
	assert.deepEqual(bytes3, bytesExpected3, 'Convert counter to bytes. Number: ' + counter3 + ' [' + bytes3.join(', ') + '] should equal [' + bytesExpected3.join(', ') + '].');
	assert.deepEqual(bytes4, bytesExpected4, 'Convert counter to bytes. Number: ' + counter4 + ' [' + bytes4.join(', ') + '] should equal [' + bytesExpected4.join(', ') + '].');
	assert.deepEqual(bytes5, bytesExpected5, 'Convert counter to bytes. Number: ' + counter5 + ' [' + bytes5.join(', ') + '] should equal [' + bytesExpected5.join(', ') + '].');
	assert.deepEqual(bytes6, bytesExpected6, 'Convert counter to bytes. Number: ' + counter6 + ' [' + bytes6.join(', ') + '] should equal [' + bytesExpected6.join(', ') + '].');
	
	assert.deepEqual(testSplitKey128BitResult, testSplitKey128BitExpectedResult, 'Test splitKey function on 128 bit key');
	assert.deepEqual(testSplitKey256BitResult, testSplitKey256BitExpectedResult, 'Test splitKey function on 256 bit key');
	
	assert.deepEqual(encryptionCiphertext256BitKey, encryptionExpectedResult256BitKey, 'Encrypt zero byte message and match output of expansion function. 256 bit encryption: [' + encryptionCiphertext256BitKey.join(', ') + '] should equal [' + encryptionExpectedResult256BitKey.join(', ') + '].');
	assert.deepEqual(encryptionCiphertext128BitKey, encryptionExpectedResult128BitKey, 'Encrypt zero byte message and match output of expansion function. 128 bit encryption: [' + encryptionCiphertext128BitKey.join(', ') + '] should equal [' + encryptionExpectedResult128BitKey.join(', ') + '].');
	
	assert.deepEqual(encryptionCiphertext2, encryptionExpectedResultTruncated2, 'Encrypt 3 & 1/2 message blocks and match against output of expansion function. Encryption: [' + encryptionCiphertext2.join(', ') + '] should equal [' + encryptionExpectedResultTruncated2.join(', ') + '].');
	
	assert.deepEqual(decryptionPlaintext3, encryptionMessage3, 'Encrypt and decrypt 256 bytes with 256 bit key then match the decrypted bytes against original plaintext. Decryption: [' + decryptionPlaintext3.join(', ') + '] should equal [' + encryptionMessage3.join(', ') + '].');
	assert.deepEqual(decryptionPlaintext128BitKey3, encryptionMessage3, 'Encrypt and decrypt 256 bytes with 128 bit key then match the decrypted bytes against original plaintext. Decryption: [' + decryptionPlaintext128BitKey3.join(', ') + '] should equal [' + encryptionMessage3.join(', ') + '].');
});


/**
 * Normalise the input key formats into a byte array
 */

var testKeyA = 'aabbccddeeff00112233445566778899';										// 128 bit key in hex
var testKeyB = 'aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899';		// 256 bit key in hex
var testKeyC = new Uint8Array(16);					// 128 bit key in bytes
var testKeyD = new Uint8Array(32);					// 256 bit key in bytes

var testKeyG = new Uint8Array(33);					// Check incorrect length
var testKeyH = 'aabbccddeeff001122334455667788';	// Check incorrect length
var testKeyI = [0, 1, 2, 3, 4, 5];					// Check incorrect type
var testKeyJ = 123412341234;						// Check incorrect type

// Fill the typed arrays with random bytes from the Web Crypto API
window.crypto.getRandomValues(testKeyC);
window.crypto.getRandomValues(testKeyD);
window.crypto.getRandomValues(testKeyG);

var testKeyResultA = Salsa20.core.util.parseKey(testKeyA);
var testKeyResultB = Salsa20.core.util.parseKey(testKeyB);
var testKeyResultC = Salsa20.core.util.parseKey(testKeyC);
var testKeyResultD = Salsa20.core.util.parseKey(testKeyD);

// Error cases (commented out because they cause an exception)
// var testKeyResultG = Salsa20.core.util.parseKey(testKeyG);
// var testKeyResultH = Salsa20.core.util.parseKey(testKeyH);
// var testKeyResultI = Salsa20.core.util.parseKey(testKeyI);
// var testKeyResultJ = Salsa20.core.util.parseKey(testKeyJ);

QUnit.test('Normalise the input key formats into a byte array', function(assert)
{
	assert.ok(testKeyResultA.length === 16, 'Array length: ' + testKeyResultA.length + ' should equal 16. Array: [' + testKeyResultA.join(', ') + ']');
	assert.ok(testKeyResultB.length === 32, 'Array length: ' + testKeyResultB.length + ' should equal 32. Array: [' + testKeyResultB.join(', ') + ']');
	assert.ok(testKeyResultC.length === 16, 'Array length: ' + testKeyResultC.length + ' should equal 16. Array: [' + testKeyResultC.join(', ') + ']');
	assert.ok(testKeyResultD.length === 32, 'Array length: ' + testKeyResultD.length + ' should equal 32. Array: [' + testKeyResultD.join(', ') + ']');
});


/**
 * Normalise the input message formats into a byte array
 */

// Test ASCII printable chars
var utf8StringA = ' !"#$%&\'()*+-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
var utf8StringTestA = Salsa20.core.util.utf8StringToBytes(utf8StringA);
var utfStringExpectedTestA = new Uint8Array([32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126]);

// Test a few UTF-8 chars
var utf8StringB = 'ØÙÚÛÜÝÞßáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄą';
var utf8StringTestB = Salsa20.core.util.utf8StringToBytes(utf8StringB);
var utfStringExpectedTestB = new Uint8Array([195, 152, 195, 153, 195, 154, 195, 155, 195, 156, 195, 157, 195, 158, 195, 159, 195, 161, 195, 162, 195, 163, 195, 164, 195, 165, 195, 166, 195, 167, 195, 168, 195, 169, 195, 170, 195, 171, 195, 172, 195, 173, 195, 174, 195, 175, 195, 176, 195, 177, 195, 178, 195, 179, 195, 180, 195, 181, 195, 182, 195, 184, 195, 185, 195, 186, 195, 187, 195, 188, 195, 189, 195, 190, 195, 191, 196, 128, 196, 129, 196, 130, 196, 131, 196, 132, 196, 133]);

// Error cases (commented out because they cause an exception)
// var utf8StringTestC = Salsa20.core.util.utf8StringToBytes('\uD800');
// var utf8StringTestD = Salsa20.core.util.utf8StringToBytes('\uDFFF');

// Test conversion back to string
var decodedUtf8StringTestA = Salsa20.core.util.bytesToUtf8String(utf8StringTestA);
var decodedUtf8StringTestB = Salsa20.core.util.bytesToUtf8String(utf8StringTestB);

// Check hexadecimal string conversion to bytes
var hexStringTestE = Salsa20.core.util.parseMessage('aabbccddeeff00112233445566778899a0b1c2d3e4f5', { inputTextType: 'hex' });
var hexStringTestF = Salsa20.core.util.parseMessage('aabbccddeeff00112233445566778899a0b1c2d3e4f5');

QUnit.test('Normalise the input message formats into a byte array', function(assert)
{
	assert.deepEqual(utf8StringTestA, utfStringExpectedTestA, 'Convert ASCII string to bytes: ' + utf8StringA + ' = [' + utf8StringTestA.join(', ') + '] should equal [' + utfStringExpectedTestA.join(', ') + '].');
	assert.deepEqual(utf8StringTestB, utfStringExpectedTestB, 'Convert UTF-8 string to bytes: ' + utf8StringB + ' = [' + utf8StringTestB.join(', ') + '] should equal [' + utfStringExpectedTestB.join(', ') + '].');
	assert.ok(decodedUtf8StringTestA === utf8StringA, 'Decoded bytes back to UTF-8 string: ' + decodedUtf8StringTestA + ' should equal ' + utf8StringA);
	assert.ok(decodedUtf8StringTestB === utf8StringB, 'Decoded bytes back to UTF-8 string: ' + decodedUtf8StringTestB + ' should equal ' + utf8StringB);
	assert.ok(hexStringTestE.length === 22, 'Hex string with correct option property set: ' + hexStringTestE.length + ' should equal 22 bytes');
	assert.ok(hexStringTestF.length === 44, 'Hex string without correct option property set treats every char as a regular char: ' + hexStringTestF.length + ' should equal 44 bytes');
});


/**
 * Normalise the input nonce formats into a byte array
 */

var nonceA = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);				// Test regular nonce
var nonceB = new Uint8Array([255, 254, 253, 252, 251, 250, 249, 248]);	// Test regular nonce
var nonceC = 0;														// Test lowest integer
var nonceD = Salsa20.core.util.maxInteger;								// Test max integer;
var nonceE = '0000000000000001';									// Test hex string
var nonceF = 'aabbccddeeff0011';									// Test hex string

// Convert to 8 byte array
var nonceResultA = Salsa20.core.util.parseNonce(nonceA);
var nonceResultB = Salsa20.core.util.parseNonce(nonceB);
var nonceResultC = Salsa20.core.util.parseNonce(nonceC);
var nonceResultD = Salsa20.core.util.parseNonce(nonceD);
var nonceResultE = Salsa20.core.util.parseNonce(nonceE);
var nonceResultF = Salsa20.core.util.parseNonce(nonceF);

var nonceExpectedResultA = nonceA;
var nonceExpectedResultB = nonceB;
var nonceExpectedResultC = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
var nonceExpectedResultD = new Uint8Array([0, 31, 255, 255, 255, 255, 255, 255]);
var nonceExpectedResultE = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]);
var nonceExpectedResultF = new Uint8Array([170, 187, 204, 221, 238, 255, 0, 17]);

// Error cases (commented out because they cause an exception)
// var nonceG = Salsa20.core.util.maxInteger + 1;			// Test max integer of JavaScript exceeded
// var nonceH = -1;										// Test negative integer
// var nonceI = 'aabbccddeeff001';						// Test string that is too short
// var nonceResultG = Salsa20.core.util.parseNonce(nonceG);
// var nonceResultH = Salsa20.core.util.parseNonce(nonceH);
// var nonceResultI = Salsa20.core.util.parseNonce(nonceI);

QUnit.test('Normalise the input nonce formats into a byte array', function(assert)
{
	assert.deepEqual(nonceResultA, nonceExpectedResultA, 'Passed in regular nonce, should be no change: [' + nonceResultA.join(', ') + '] should equal [' + nonceExpectedResultA.join(', ') + '].');
	assert.deepEqual(nonceResultB, nonceExpectedResultB, 'Passed in regular nonce, should be no change: [' + nonceResultB.join(', ') + '] should equal [' + nonceExpectedResultB.join(', ') + '].');
	assert.deepEqual(nonceResultC, nonceExpectedResultC, '0 integer nonce should be converted to byte array of 0s: [' + nonceResultC.join(', ') + '] should equal [' + nonceExpectedResultC.join(', ') + '].');
	assert.deepEqual(nonceResultD, nonceExpectedResultD, 'Max integer size: [' + nonceResultD.join(', ') + '] should equal [' + nonceExpectedResultD.join(', ') + '].');
	assert.deepEqual(nonceResultE, nonceExpectedResultE, 'Simple hex string: [' + nonceResultE.join(', ') + '] should equal [' + nonceExpectedResultE.join(',') + '].');
	assert.deepEqual(nonceResultF, nonceExpectedResultF, 'Complex hex string : [' + nonceResultF.join(', ') + '] should equal [' + nonceExpectedResultF.join(',') + '].');
});


/**
 * Validate the input counter format
 */

var counterA = Salsa20.core.util.parseCounter(0, 64);
var counterB = Salsa20.core.util.parseCounter(2000, 64);
var counterC = Salsa20.core.util.parseCounter(Salsa20.core.util.maxInteger, 64);		// JavaScript max integer (9007199254740991)
var counterD = Salsa20.core.util.parseCounter(9007199254740990, 128);
var counterE = Salsa20.core.util.parseCounter(9007199254740989, 192);

// Error cases (commented out because they cause an exception)
// var counterF = Salsa20.core.util.parseCounter(Math.pow(2, 53) - 1, 128);	// Test maximum integer exceeded
// var counterG = Salsa20.core.util.parseCounter('0');							// Test string
// var counterH = Salsa20.core.util.parseCounter(9007199254740991, 192);		// Try encrypting 192 bytes from start counter, but this will exceed keystream bytes that can be generated

QUnit.test('Validate the input counter format', function(assert)
{
	assert.ok(counterA === 0, 'Test number 0');
	assert.ok(counterB === 2000, 'Test number 2000');
	assert.ok(counterC === 9007199254740991, 'Test maximum integer 2^53 - 1 (9007199254740991)');
	assert.ok(counterD === 9007199254740990, 'Test 3 keystream blocks is able to be generated from this counter position');
	assert.ok(counterE === 9007199254740989, 'Test 4 keystream blocks is able to be generated from this counter position');
});


/**
 * Test the main encrypt wrapper function
 */

// Test 256 bit key in bytes
var testEncryptWrapperKey256Bits = new Uint8Array(32);
window.crypto.getRandomValues(testEncryptWrapperKey256Bits);

// Test 128 bit key in bytes
var testEncryptWrapperKey128Bits = new Uint8Array(16);
window.crypto.getRandomValues(testEncryptWrapperKey128Bits);

// Test encryption of ASCII text with 256 bit key
var testEncryptWrapperMessage0 = 'The quick brown fox jumps over the lazy dog';
var testEncryptWrapperNonce0 = 0;
var testEncryptWrapperCounter0 = 0;
var testEncryptWrapperCiphertext0 = Salsa20.encrypt(testEncryptWrapperKey256Bits, testEncryptWrapperMessage0, testEncryptWrapperNonce0, testEncryptWrapperCounter0);

// Test encryption of ASCII text with 128 bit key
var testEncryptWrapperMessage1 = 'The quick brown fox jumps over the lazy dog';
var testEncryptWrapperNonce1 = 0;
var testEncryptWrapperCounter1 = 0;
var testEncryptWrapperCiphertext1 = Salsa20.encrypt(testEncryptWrapperKey128Bits, testEncryptWrapperMessage1, testEncryptWrapperNonce1, testEncryptWrapperCounter1);


// Test encryption of hex plaintext with 256 bit key
var testEncryptWrapperMessage2 = '54686520717569636b2062726f776e20666f78206a756d7073206f76657220746865206c617a7920646f67';		// "The quick brown fox jumps over the lazy dog" in hex
var testEncryptWrapperNonce2 = 0;
var testEncryptWrapperCounter2 = 0;
var testEncryptWrapperOptions2 = { inputTextType: 'hex' };
var testEncryptWrapperCiphertext2 = Salsa20.encrypt(testEncryptWrapperKey256Bits, testEncryptWrapperMessage2, testEncryptWrapperNonce2, testEncryptWrapperCounter2, testEncryptWrapperOptions2);

// Test encryption of hex plaintext with 128 bit key
var testEncryptWrapperMessage3 = '54686520717569636b2062726f776e20666f78206a756d7073206f76657220746865206c617a7920646f67';		// "The quick brown fox jumps over the lazy dog" in hex
var testEncryptWrapperNonce3 = 0;
var testEncryptWrapperCounter3 = 0;
var testEncryptWrapperOptions3 = { inputTextType: 'hex' };
var testEncryptWrapperCiphertext3 = Salsa20.encrypt(testEncryptWrapperKey128Bits, testEncryptWrapperMessage3, testEncryptWrapperNonce3, testEncryptWrapperCounter3, testEncryptWrapperOptions3);


// Test return type of hex with 256 bit key
var testEncryptWrapperMessage4 = 'The quick brown fox jumps over the lazy dog';
var testEncryptWrapperNonce4 = 0;
var testEncryptWrapperCounter4 = 0;
var testEncryptWrapperOptions4 = { returnType: 'hex' };
var testEncryptWrapperCiphertext4 = Salsa20.encrypt(testEncryptWrapperKey256Bits, testEncryptWrapperMessage4, testEncryptWrapperNonce4, testEncryptWrapperCounter4, testEncryptWrapperOptions4);

// Test return type of hex with 128 bit key
var testEncryptWrapperMessage5 = 'The quick brown fox jumps over the lazy dog';
var testEncryptWrapperNonce5 = 0;
var testEncryptWrapperCounter5 = 0;
var testEncryptWrapperOptions5 = { returnType: 'hex' };
var testEncryptWrapperCiphertext5 = Salsa20.encrypt(testEncryptWrapperKey128Bits, testEncryptWrapperMessage5, testEncryptWrapperNonce5, testEncryptWrapperCounter5, testEncryptWrapperOptions5);


// Test hex key input with 256 bit key
var testEncryptWrapperKey256BitsHex = Salsa20.core.util.bytesToHex(Array.prototype.slice.call(testEncryptWrapperKey256Bits));
var testEncryptWrapperMessage6 = 'The quick brown fox jumps over the lazy dog';
var testEncryptWrapperNonce6 = 0;
var testEncryptWrapperCounter6 = 0;
var testEncryptWrapperCiphertext6 = Salsa20.encrypt(testEncryptWrapperKey256BitsHex, testEncryptWrapperMessage6, testEncryptWrapperNonce6, testEncryptWrapperCounter6);

// Test hex key input with 128 bit key
var testEncryptWrapperKey128BitsHex = Salsa20.core.util.bytesToHex(Array.prototype.slice.call(testEncryptWrapperKey128Bits));
var testEncryptWrapperMessage7 = 'The quick brown fox jumps over the lazy dog';
var testEncryptWrapperNonce7 = 0;
var testEncryptWrapperCounter7 = 0;
var testEncryptWrapperCiphertext7 = Salsa20.encrypt(testEncryptWrapperKey128BitsHex, testEncryptWrapperMessage7, testEncryptWrapperNonce7, testEncryptWrapperCounter7);


// Test encrypting large text from a large start counter position with 256 bit key
var testEncryptWrapperMessage8 = 'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.';
var testEncryptWrapperNonce8 = 4509;
var testEncryptWrapperCounter8 = 388992;
var testEncryptWrapperCiphertext8 = Salsa20.encrypt(testEncryptWrapperKey256Bits, testEncryptWrapperMessage8, testEncryptWrapperNonce8, testEncryptWrapperCounter8);

// Test encrypting large text from a large start counter position with 128 bit key
var testEncryptWrapperMessage9 = 'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.';
var testEncryptWrapperNonce9 = 4509;
var testEncryptWrapperCounter9 = 388992;
var testEncryptWrapperCiphertext9 = Salsa20.encrypt(testEncryptWrapperKey128Bits, testEncryptWrapperMessage9, testEncryptWrapperNonce9, testEncryptWrapperCounter9);


// Test encrypting UTF-8 chars with 256 bit key
var testEncryptWrapperMessage10 = 'ØÙÚÛÜÝÞßáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄą';
var testEncryptWrapperNonce10 = 1000;
var testEncryptWrapperCounter10 = 0;
var testEncryptWrapperCiphertext10 = Salsa20.encrypt(testEncryptWrapperKey256Bits, testEncryptWrapperMessage10, testEncryptWrapperNonce10, testEncryptWrapperCounter10);

// Test encrypting UTF-8 chars with 128 bit key
var testEncryptWrapperMessage11 = 'ØÙÚÛÜÝÞßáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĀāĂăĄą';
var testEncryptWrapperNonce11 = 1000;
var testEncryptWrapperCounter11 = 0;
var testEncryptWrapperCiphertext11 = Salsa20.encrypt(testEncryptWrapperKey128Bits, testEncryptWrapperMessage11, testEncryptWrapperNonce11, testEncryptWrapperCounter11);

QUnit.test('Test the main encrypt wrapper function', function(assert)
{
	assert.ok(testEncryptWrapperCiphertext0.length === testEncryptWrapperMessage0.length, 'Ciphertext length is the same length as the plaintext for 256 bit key');	
	assert.ok(testEncryptWrapperCiphertext1.length === testEncryptWrapperMessage1.length, 'Ciphertext length is the same length as the plaintext for 128 bit key');	
	
	assert.deepEqual(testEncryptWrapperCiphertext2, testEncryptWrapperCiphertext0, 'Input same message as hex, ciphertext should be the same for 256 bit key');
	assert.deepEqual(testEncryptWrapperCiphertext3, testEncryptWrapperCiphertext1, 'Input same message as hex, ciphertext should be the same for 128 bit key');
	
	assert.deepEqual(testEncryptWrapperCiphertext0, Salsa20.core.util.hexToBytes(testEncryptWrapperCiphertext4), 'Return type as hex, ciphertext should be the same for 256 bit key');
	assert.deepEqual(testEncryptWrapperCiphertext1, Salsa20.core.util.hexToBytes(testEncryptWrapperCiphertext5), 'Return type as hex, ciphertext should be the same for 128 bit key');
	
	assert.deepEqual(testEncryptWrapperCiphertext0, testEncryptWrapperCiphertext6, 'Input key as hex, ciphertext should be the same for 256 bit key');
	assert.deepEqual(testEncryptWrapperCiphertext1, testEncryptWrapperCiphertext7, 'Input key as hex, ciphertext should be the same for 128 bit key');
	
	assert.ok(testEncryptWrapperCiphertext8.length === testEncryptWrapperMessage8.length, 'Ciphertext length is the same length as the long plaintext for 256 bit key (' + testEncryptWrapperCiphertext8.length + ') bytes');
	assert.ok(testEncryptWrapperCiphertext9.length === testEncryptWrapperMessage9.length, 'Ciphertext length is the same length as the long plaintext for 128 bit key (' + testEncryptWrapperCiphertext9.length + ') bytes');
	
	assert.ok(testEncryptWrapperCiphertext10.length === testEncryptWrapperMessage10.length * 2, 'Ciphertext length is twice the length encrypting these UTF-8 chars with 256 bit key (' + testEncryptWrapperMessage10 + ')');
	assert.ok(testEncryptWrapperCiphertext11.length === testEncryptWrapperMessage11.length * 2, 'Ciphertext length is twice the length encrypting these UTF-8 chars with 128 bit key (' + testEncryptWrapperMessage10 + ')');
});


/**
 * Test the main decrypt wrapper function
 */
var testDecryptWrapperPlaintext0 = Salsa20.decrypt(testEncryptWrapperKey256Bits, testEncryptWrapperCiphertext0, testEncryptWrapperNonce0, testEncryptWrapperCounter0);
var testDecryptWrapperPlaintext1 = Salsa20.decrypt(testEncryptWrapperKey128Bits, testEncryptWrapperCiphertext1, testEncryptWrapperNonce1, testEncryptWrapperCounter1);

var testDecryptWrapperPlaintext2 = Salsa20.decrypt(testEncryptWrapperKey256Bits, testEncryptWrapperCiphertext2, testEncryptWrapperNonce2, testEncryptWrapperCounter2, { returnType: 'hex' });
var testDecryptWrapperPlaintext3 = Salsa20.decrypt(testEncryptWrapperKey128Bits, testEncryptWrapperCiphertext3, testEncryptWrapperNonce3, testEncryptWrapperCounter3, { returnType: 'hex' });

var testDecryptWrapperPlaintext4 = Salsa20.decrypt(testEncryptWrapperKey256Bits, testEncryptWrapperCiphertext4, testEncryptWrapperNonce4, testEncryptWrapperCounter4, { inputTextType: 'hex' });
var testDecryptWrapperPlaintext5 = Salsa20.decrypt(testEncryptWrapperKey128Bits, testEncryptWrapperCiphertext5, testEncryptWrapperNonce5, testEncryptWrapperCounter5, { inputTextType: 'hex' });

var testDecryptWrapperPlaintext6 = Salsa20.decrypt(testEncryptWrapperKey256BitsHex, testEncryptWrapperCiphertext6, testEncryptWrapperNonce6, testEncryptWrapperCounter6);
var testDecryptWrapperPlaintext7 = Salsa20.decrypt(testEncryptWrapperKey128BitsHex, testEncryptWrapperCiphertext7, testEncryptWrapperNonce7, testEncryptWrapperCounter7);

var testDecryptWrapperPlaintext8 = Salsa20.decrypt(testEncryptWrapperKey256Bits, testEncryptWrapperCiphertext8, testEncryptWrapperNonce8, testEncryptWrapperCounter8);
var testDecryptWrapperPlaintext9 = Salsa20.decrypt(testEncryptWrapperKey128Bits, testEncryptWrapperCiphertext9, testEncryptWrapperNonce9, testEncryptWrapperCounter9);

var testDecryptWrapperPlaintext10 = Salsa20.decrypt(testEncryptWrapperKey256Bits, testEncryptWrapperCiphertext10, testEncryptWrapperNonce10, testEncryptWrapperCounter10);
var testDecryptWrapperPlaintext11 = Salsa20.decrypt(testEncryptWrapperKey128Bits, testEncryptWrapperCiphertext11, testEncryptWrapperNonce11, testEncryptWrapperCounter11);

QUnit.test('Test the main decrypt wrapper function', function(assert)
{
	assert.ok(testDecryptWrapperPlaintext0 === testEncryptWrapperMessage0, 'Ciphertext decrypts to same ASCII plaintext for 256 bit key. "' + testDecryptWrapperPlaintext0 + '" should equal "' + testEncryptWrapperMessage0 + '"');
	assert.ok(testDecryptWrapperPlaintext1 === testEncryptWrapperMessage1, 'Ciphertext decrypts to same ASCII plaintext for 128 bit key. "' + testDecryptWrapperPlaintext1 + '" should equal "' + testEncryptWrapperMessage1 + '"');
	
	assert.ok(testDecryptWrapperPlaintext2 === testEncryptWrapperMessage2, 'Ciphertext decrypts to same hex plaintext for 256 bit key. "' + testDecryptWrapperPlaintext2 + '" should equal "' + testEncryptWrapperMessage2 + '"');
	assert.ok(testDecryptWrapperPlaintext3 === testEncryptWrapperMessage3, 'Ciphertext decrypts to same hex plaintext for 128 bit key. "' + testDecryptWrapperPlaintext3 + '" should equal "' + testEncryptWrapperMessage3 + '"');
	
	assert.ok(testDecryptWrapperPlaintext4 === testEncryptWrapperMessage4, 'Hex ciphertext decrypts to same ASCII plaintext for 256 bit key. "' + testDecryptWrapperPlaintext4 + '" should equal "' + testEncryptWrapperMessage4 + '"');
	assert.ok(testDecryptWrapperPlaintext5 === testEncryptWrapperMessage5, 'Hex ciphertext decrypts to same ASCII plaintext for 128 bit key. "' + testDecryptWrapperPlaintext5 + '" should equal "' + testEncryptWrapperMessage5 + '"');

	assert.ok(testDecryptWrapperPlaintext6 === testEncryptWrapperMessage6, 'Ciphertext decrypts to same ASCII plaintext for 256 bit hex key. "' + testDecryptWrapperPlaintext6 + '" should equal "' + testEncryptWrapperMessage6 + '"');
	assert.ok(testDecryptWrapperPlaintext7 === testEncryptWrapperMessage7, 'Ciphertext decrypts to same ASCII plaintext for 128 bit hex key. "' + testDecryptWrapperPlaintext7 + '" should equal "' + testEncryptWrapperMessage7 + '"');
	
	assert.ok(testDecryptWrapperPlaintext8 === testEncryptWrapperMessage8, 'Ciphertext decrypts to same large text from a large start counter position for 256 bit key. "' + testDecryptWrapperPlaintext8 + '" should equal "' + testEncryptWrapperMessage8 + '"');
	assert.ok(testDecryptWrapperPlaintext9 === testEncryptWrapperMessage9, 'Ciphertext decrypts to same large text from a large start counter position for 128 bit key. "' + testDecryptWrapperPlaintext9 + '" should equal "' + testEncryptWrapperMessage9 + '"');
	
	assert.ok(testDecryptWrapperPlaintext10 === testEncryptWrapperMessage10, 'Ciphertext decrypts to same UTF-8 plaintext for 256 bit key. "' + testDecryptWrapperPlaintext10 + '" should equal "' + testEncryptWrapperMessage10 + '"');
	assert.ok(testDecryptWrapperPlaintext11 === testEncryptWrapperMessage11, 'Ciphertext decrypts to same UTF-8 plaintext for 128 bit key. "' + testDecryptWrapperPlaintext11 + '" should equal "' + testEncryptWrapperMessage11 + '"');	
});


/**
 * Test web worker encrypt and decrypt
 */
$(function()
{
	/**
	 * Test encryption using web worker thread
	 */
	var workerEncKey = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]);
	var workerEncMessage = 'The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.';
	var workerEncNonce = new Uint8Array([3, 1, 4, 1, 5, 9, 2, 6]);
	var workerEncCounter = 0;
	
	//var workerEncExpectedCiphertext = Salsa20.encrypt(workerEncKey, workerEncMessage, workerEncNonce, workerEncCounter);
	var workerEncExpectedCiphertext = new Uint8Array([58, 212, 216, 159, 7, 137, 165, 7, 192, 37, 54, 89, 129, 253, 9, 235, 164, 224, 218, 193, 43, 142, 130, 203, 73, 15, 244, 84, 124, 123, 232, 163, 188, 76, 114, 52, 170, 41, 238, 80, 185, 75, 176, 130, 20, 23, 30, 250, 218, 86, 208, 103, 3, 15, 98, 6, 174, 228, 28, 15, 6, 229, 88, 86, 130, 199, 194, 99, 191, 99, 153, 211, 94, 103, 209, 80, 106, 118, 58, 55, 170, 120, 57, 93, 209, 15, 4, 187, 77, 160, 123, 198, 223, 207, 130, 200, 214, 58, 40, 8, 223, 151, 52, 35, 41, 172, 220, 159, 227, 58, 97, 235, 75, 226, 251, 85, 79, 152, 178, 248, 91, 10, 207, 157, 154, 17, 183, 243, 185, 123, 215, 159, 80, 137]);
	
	// Convert the base URL so the web worker can import the script
	// Also load the JavaScript code on the HTML page which is what the worker will run
	var baseUrl = window.location.href.replace(/\\/g, '/').replace(/\/[^\/]*$/, '').replace('tests.html', '') + '/';
	var encArray = ['var baseUrl = "' + baseUrl + '";' + $('#salsa20-encryption-worker').html()];
	
	// Create a Blob to hold the JavaScript code and send it to the inline worker
	var encBlob = new Blob(encArray, { type: "text/javascript" });
	var encBlobUrl = window.URL.createObjectURL(encBlob);
	var encWorker = new Worker(encBlobUrl);
	
	// When the worker is complete
	encWorker.addEventListener('message', function(event)
	{		
		// Get the result back
		var ciphertext = event.data.ciphertext;
				
		// Compare the results
		QUnit.test('Test encryption using web worker thread', function(assert)
		{
			assert.deepEqual(ciphertext, workerEncExpectedCiphertext, '[' + ciphertext.join(', ') + '] should equal [' + workerEncExpectedCiphertext.join(', ') + '].');
		});
		
	}, false);
	
	// Worker error handler
	encWorker.addEventListener('error', function(e)
	{
		throw new Error('Error in worker thread: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
		
	}, false);
	
	// Send data to the worker
	encWorker.postMessage({
		key: workerEncKey,
		message: workerEncMessage,
		nonce: workerEncNonce,
		counter: workerEncCounter
	});
	
	// Free up memory
	window.URL.revokeObjectURL(encBlobUrl);
	
	
	/**
	 * Test decryption using web worker thread
	 */
	
	// Load the JavaScript code on the HTML page which is what the worker will run	
	var decArray = ['var baseUrl = "' + baseUrl + '";' + $('#salsa20-decryption-worker').html()];
	
	// Create a Blob to hold the JavaScript code and send it to the inline worker
	var decBlob = new Blob(decArray, { type: "text/javascript" });
	var decBlobUrl = window.URL.createObjectURL(decBlob);
	var decWorker = new Worker(decBlobUrl);
	
	// When the worker is complete
	decWorker.addEventListener('message', function(event)
	{
		// Get the result back
		var plaintext = event.data.plaintext;
		
		// Compare the results
		QUnit.test('Test decryption using web worker thread', function(assert)
		{
			assert.deepEqual(plaintext, workerEncMessage, '"' + plaintext + '" should equal "' + workerEncMessage + '".');
		});
	
	}, false);
	
	// Worker error handler
	decWorker.addEventListener('error', function(e)
	{
		//throw new Error('Error in worker thread: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
	
	}, false);
	
	// Send data to the worker
	decWorker.postMessage({
		key: workerEncKey,
		ciphertext: workerEncExpectedCiphertext,
		nonce: workerEncNonce,
		counter: workerEncCounter
	});
	
	// Free up memory
	window.URL.revokeObjectURL(decBlobUrl);
});


/**
 * Test the generate keystream wrapper function
 */

// Test lengths produced are correct
var keystreamTestKey = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]);
var keystreamTestLengthA = 128;
var keystreamTestNonceA = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
var keystreamTestCounterA = 0;
var keystreamA = Salsa20.generateKeystream(keystreamTestKey, keystreamTestLengthA, keystreamTestNonceA, keystreamTestCounterA, { returnType: 'hex' });
var keystreamLengthA = keystreamA.length;
var keystreamLengthExpectedA = 128 * 2;		// x2 because 2 hex chars == 1 byte

var keystreamTestLengthB = 256;
var keystreamTestNonceB = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
var keystreamTestCounterB = 0;
var keystreamB = Salsa20.generateKeystream(keystreamTestKey, keystreamTestLengthB, keystreamTestNonceB, keystreamTestCounterB, { returnType: 'hex' });
var keystreamLengthB = keystreamB.length;
var keystreamLengthExpectedB = 256 * 2;

var keystreamTestLengthC = 257;
var keystreamTestNonceC = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
var keystreamTestCounterC = 0;
var keystreamC = Salsa20.generateKeystream(keystreamTestKey, keystreamTestLengthC, keystreamTestNonceC, keystreamTestCounterC, { returnType: 'hex' });
var keystreamLengthC = keystreamC.length;
var keystreamLengthExpectedC = (256 + 64) * 2;	// Should be 320 bytes (640 hex chars)


// Test outputs not the same with different nonce
var keystreamTestLengthD = 256;
var keystreamTestNonceD = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]);
var keystreamTestCounterD = 0;
var keystreamD = Salsa20.generateKeystream(keystreamTestKey, keystreamTestLengthD, keystreamTestNonceD, keystreamTestCounterD, { returnType: 'hex' });


// Test keystream from different start counter is equal to part of earlier keystream
var keystreamTestLengthE = 256;
var keystreamTestNonceE = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
var keystreamTestCounterE = 2;
var keystreamE = Salsa20.generateKeystream(keystreamTestKey, keystreamTestLengthE, keystreamTestNonceE, keystreamTestCounterE, { returnType: 'hex' });
var keystreamSubstringE = keystreamE.substr(0, 128);	// 64 bit slice
var keystreamSubstringC = keystreamC.substr(256, 128);	// Start of output from counter 2 (64 bytes * 2 + 64 bytes * 2)


// Test regular return type of a byte array is the same as the hexadecimal earlier
var keystreamTestLengthF = 257;
var keystreamTestNonceF = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
var keystreamTestCounterF = 0;
var keystreamF = Salsa20.generateKeystream(keystreamTestKey, keystreamTestLengthF, keystreamTestNonceF, keystreamTestCounterF);
var keystreamExpectedF = Salsa20.core.util.hexToBytes(keystreamC);

QUnit.test('Test the generate keystream wrapper function', function(assert)
{
	assert.ok(keystreamLengthA === keystreamLengthExpectedA, 'Keystream length ' + keystreamLengthA + ' should equal ' + keystreamLengthExpectedA);
	assert.ok(keystreamLengthB === keystreamLengthExpectedB, 'Keystream length ' + keystreamLengthB + ' should equal ' + keystreamLengthExpectedB);
	assert.ok(keystreamLengthC === keystreamLengthExpectedC, 'Keystream length ' + keystreamLengthC + ' should equal ' + keystreamLengthExpectedC);	
	assert.notEqual(keystreamB, keystreamD, 'Keystream generated from one nonce should not equal another generated from different nonce');	
	assert.ok(keystreamSubstringE === keystreamSubstringC, 'Keystream from 0 - 128 from start counter 2 is equal to keystream from 128 - 256 from start counter 0. ' + keystreamSubstringE + ' should equal ' + keystreamSubstringC);	
	assert.deepEqual(keystreamF, keystreamExpectedF, 'Keystream return type of bytes [' + keystreamF.join(', ') + '] should equal [' + keystreamExpectedF.join(', ') + '].');
});


/**
 * Test web worker keystream generation
 */
$(function()
{
	var workerKey = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]);
	var length = 257;
	var workerEncNonce = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
	var workerEncCounter = 0;
	
	//var workerEncExpectedCiphertext = Salsa20.encrypt(workerEncKey, workerEncMessage, workerEncNonce, workerEncCounter);
	var workerEncExpectedKeystream = keystreamC;
	
	// Convert the base URL so the web worker can import the script
	// Also load the JavaScript code on the HTML page which is what the worker will run
	var baseUrl = window.location.href.replace(/\\/g, '/').replace(/\/[^\/]*$/, '').replace('tests.html', '') + '/';
	var ksArray = ['var baseUrl = "' + baseUrl + '";' + $('#salsa20-keystream-worker').html()];
	
	// Create a Blob to hold the JavaScript code and send it to the inline worker
	var ksBlob = new Blob(ksArray, { type: "text/javascript" });
	var ksBlobUrl = window.URL.createObjectURL(ksBlob);
	var ksWorker = new Worker(ksBlobUrl);
	
	// When the worker is complete
	ksWorker.addEventListener('message', function(event)
	{		
		// Get the result back
		var keystream = event.data.keystream;
				
		// Compare the results
		QUnit.test('Test keystream generation using web worker thread', function(assert)
		{
			assert.deepEqual(keystream, workerEncExpectedKeystream, keystream + ' should equal ' + workerEncExpectedKeystream);
		});
		
	}, false);
	
	// Worker error handler
	ksWorker.addEventListener('error', function(e)
	{
		throw new Error('Error in worker thread: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
		
	}, false);
	
	// Send data to the worker
	ksWorker.postMessage({
		key: workerKey,
		length: length,
		nonce: workerEncNonce,
		counter: workerEncCounter,
		options: { returnType: 'hex' }
	});
	
	// Free up memory
	window.URL.revokeObjectURL(ksBlobUrl);
});


/**
 * Test web worker keystream generation of 5MB
 */
$(function()
{
	var key = new Uint8Array(32);
	var length = 5 * 1024 * 1024;	// 5MB / 5242880 bytes
	var nonce = new Uint8Array(8);
	var counter = 0;
	
	// Fill the key and nonce with random values
	window.crypto.getRandomValues(key);
	window.crypto.getRandomValues(nonce);
	
	// Set the start time
	var startTime = new Date();
		
	// Convert the base URL so the web worker can import the script
	// Also load the JavaScript code on the HTML page which is what the worker will run
	var baseUrl = window.location.href.replace(/\\/g, '/').replace(/\/[^\/]*$/, '').replace('tests.html', '') + '/';
	var ksArray = ['var baseUrl = "' + baseUrl + '";' + $('#salsa20-keystream-worker').html()];
	
	// Create a Blob to hold the JavaScript code and send it to the inline worker
	var ksBlob = new Blob(ksArray, { type: "text/javascript" });
	var ksBlobUrl = window.URL.createObjectURL(ksBlob);
	var ksWorker = new Worker(ksBlobUrl);
	
	// When the worker is complete
	ksWorker.addEventListener('message', function(event)
	{		
		// Get the result back
		var keystream = event.data.keystream;
		
		// Current time
		var currentTime = new Date();
		
		// Calculate time taken in milliseconds and seconds
		var milliseconds = currentTime.getTime() - startTime.getTime();
		var seconds = (milliseconds / 1000).toFixed(3);
		
		// Show the time the process started if applicable
		var timeElapsedMessage = 'Total time elapsed: ' + milliseconds + ' ms (' + seconds + ' s).';

		// Compare the results
		QUnit.test('Test web worker keystream generation of 5MB', function(assert)
		{
			assert.ok(keystream.length === 5242880, 'Keystream length [' + keystream.length + ' should equal 5242880. ' + timeElapsedMessage);
		});
		
	}, false);
	
	// Worker error handler
	ksWorker.addEventListener('error', function(e)
	{
		throw new Error('Error in worker thread: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
		
	}, false);
	
	// Send data to the worker
	ksWorker.postMessage({
		key: key,
		length: length,
		nonce: nonce,
		counter: counter
	});
	
	// Free up memory
	window.URL.revokeObjectURL(ksBlobUrl);
});