
// 将Magicard金手指码转换为<地址:值>对
//  by SONIC3D
//  2022.Oct.14
//
// 使用方法：
// 直接执行
//  node magicardEncDec.js decode UFFIIUKURH
//      (UFFIIUKURH是Magicard格式的金手指字符串)
//  node magicardEncDec.js encode 00033A4A78
//      (00033A是地址，4A78是值)

// 验证输入的金手指码格式是否合法。合法则返回0，非法则返回错误号。
// 错误号:
//  0: Success
//  -1: Invalid code length.
//  -2: Code contains invalid character(s). (Valid characters list: ABDFGHIKNPRSTUYZ)
function validateMagicardCode(magicardCode) {
    var ret = 0;
    // 长度校验
    if (magicardCode.length != 10) {
        console.error(`[Error] Invalid code length, valid code must be in 10 characters.`);
        ret = -1;
    }
    // 内容字符校验
    charValidationResult = magicardCode.match(/[^ABDFGHIKNPRSTUYZ]/g);
    if (charValidationResult != null) {
        console.error(`[Error] Invalid character is found: ${charValidationResult}`);
        ret = -2;
    }

    return ret;
}

// 验证输入的地址值对格式是否合法。合法则返回0，非法则返回错误号。
// 错误号:
//  0: Success
//  -1: Invalid code length.
//  -2: Code contains invalid character(s). (Valid characters list: 0123456789ABCDEF)
function validateAddrDataPair(strInput) {
    var ret = 0;
    // 长度校验
    if (strInput.length != 10) {
        console.error(`[Error] Invalid code length, valid code must be in 10 characters.`);
        ret = -1;
    }
    // 内容字符校验
    charValidationResult = strInput.match(/[^0123456789ABCDEF]/g);
    if (charValidationResult != null) {
        console.error(`[Error] Invalid character is found: ${charValidationResult}`);
        ret = -2;
    }

    return ret;
}

// 将Magicard格式的金手指码字符串的每一个字符转换成对应该字符的4bit值的16进制字符
// 注意：应确保输入的金手指码全为大写字符
function magicardCode2HexString(inCode) {
    while(inCode.indexOf('A') != -1) {inCode = inCode.replace('A', '0');}
    while(inCode.indexOf('B') != -1) {inCode = inCode.replace('B', '1');}
    while(inCode.indexOf('D') != -1) {inCode = inCode.replace('D', '2');}
    while(inCode.indexOf('F') != -1) {inCode = inCode.replace('F', '3');}
    while(inCode.indexOf('G') != -1) {inCode = inCode.replace('G', '4');}
    while(inCode.indexOf('H') != -1) {inCode = inCode.replace('H', '5');}
    while(inCode.indexOf('I') != -1) {inCode = inCode.replace('I', '6');}
    while(inCode.indexOf('K') != -1) {inCode = inCode.replace('K', '7');}
    while(inCode.indexOf('N') != -1) {inCode = inCode.replace('N', '8');}
    while(inCode.indexOf('P') != -1) {inCode = inCode.replace('P', '9');}
    while(inCode.indexOf('R') != -1) {inCode = inCode.replace('R', 'A');}
    while(inCode.indexOf('S') != -1) {inCode = inCode.replace('S', 'B');}
    while(inCode.indexOf('T') != -1) {inCode = inCode.replace('T', 'C');}
    while(inCode.indexOf('U') != -1) {inCode = inCode.replace('U', 'D');}
    while(inCode.indexOf('Y') != -1) {inCode = inCode.replace('Y', 'E');}
    while(inCode.indexOf('Z') != -1) {inCode = inCode.replace('Z', 'F');}

    return inCode;
}

// 将16进制串的每一个字符转换成对应该字符的4bit值的Magicard格式的金手指码字符串的字符
// 注意：应确保输入的全为大写字符
function hexString2MagicardCode(inCode) {
    while(inCode.indexOf('F') != -1) {inCode = inCode.replace('F', 'Z');}
    while(inCode.indexOf('E') != -1) {inCode = inCode.replace('E', 'Y');}
    while(inCode.indexOf('D') != -1) {inCode = inCode.replace('D', 'U');}
    while(inCode.indexOf('C') != -1) {inCode = inCode.replace('C', 'T');}
    while(inCode.indexOf('B') != -1) {inCode = inCode.replace('B', 'S');}
    while(inCode.indexOf('A') != -1) {inCode = inCode.replace('A', 'R');}
    while(inCode.indexOf('9') != -1) {inCode = inCode.replace('9', 'P');}
    while(inCode.indexOf('8') != -1) {inCode = inCode.replace('8', 'N');}
    while(inCode.indexOf('7') != -1) {inCode = inCode.replace('7', 'K');}
    while(inCode.indexOf('6') != -1) {inCode = inCode.replace('6', 'I');}
    while(inCode.indexOf('5') != -1) {inCode = inCode.replace('5', 'H');}
    while(inCode.indexOf('4') != -1) {inCode = inCode.replace('4', 'G');}
    while(inCode.indexOf('3') != -1) {inCode = inCode.replace('3', 'F');}
    while(inCode.indexOf('2') != -1) {inCode = inCode.replace('2', 'D');}
    while(inCode.indexOf('1') != -1) {inCode = inCode.replace('1', 'B');}
    while(inCode.indexOf('0') != -1) {inCode = inCode.replace('0', 'A');}

    return inCode;
}

// 计算指定某一位解码后的结果
// 参数:
//      codeHex: 完整的Magicard金手指码转为16进制的形式（需确保10位字符串，本函数不再验证该字符串有效性）
//      charPlaceId: 期望输出第几位的结果，有效值范围0-9
// 返回:
//      一个16进制数字字符(0-F)
function decodeSingleCharPlace(codeHex, charPlaceId, predefinedCode1, predefinedCode2, predefinedCode3) {
    charPlaceId = Math.max(0, Math.min(9, charPlaceId));    // 有效值范围保护

    // 计算关键位字符的10进制值
    var numTargetCharPlaceId = parseInt(codeHex[charPlaceId], 16);
    var numP1 = parseInt(predefinedCode1[charPlaceId], 16);
    var numP2 = parseInt(predefinedCode2[charPlaceId], 16);
    var numP3 = parseInt(predefinedCode3[charPlaceId], 16);
    // console.log(`[Debug] charPlaceId: ${charPlaceId}`);
    // console.log(`[Debug] codeHex: ${codeHex}`);
    // console.log(`[Debug] codeHex[charPlaceId]: ${codeHex[charPlaceId]}`);
    // console.log(`[Debug] numTargetCharPlaceId: ${numTargetCharPlaceId}`);

    // 最前面加32是为了防止减numP3时出现负数，多余内容最后会被mod 16消去
    var numResult = (32 + numTargetCharPlaceId + numP1 + numP2 - numP3) % 16;
    return numResult.toString(16);
}

// 计算整个金手指解码后的结果
// 参数:
//      inputCode: 完整的Magicard金手指码（需确保10位字符串，本函数不再验证该字符串有效性）
// 返回:
//      一个10位字符长的16进制数字的字符串
function decodeAllCharPlace(inputCode) {
    var ret = "";
    var codeHex = magicardCode2HexString(inputCode);
    console.log(`Input code(HEX):   ${codeHex}`);

    // 计算中用到的第1个预定义值
    var predefinedCode1 = "6000000006";

    // 取出关键位的字符
    var charIJKL = codeHex[2];
    var charQRST = codeHex[4];
    // console.log(`[Debug] charIJKL: ${charIJKL}`);
    // console.log(`[Debug] charQRST: ${charQRST}`);

    // 计算中用到的第2、3个预定义值
    var predefinedCode2 = `${charIJKL}${charIJKL}${charIJKL}${charIJKL}0${charIJKL}${charIJKL}${charIJKL}${charIJKL}${charIJKL}`;
    var predefinedCode3 = `${charQRST}${charQRST}${charQRST}${charQRST}${charIJKL}${charQRST}${charQRST}${charQRST}${charQRST}${charQRST}`;
    // console.log(`[Debug] predefinedCode2: ${predefinedCode2}`);
    // console.log(`[Debug] predefinedCode3: ${predefinedCode3}`);

    var tmp = "";
    for(var i=0;i<10;i++) {
        tmp += decodeSingleCharPlace(codeHex, i, predefinedCode1, predefinedCode2, predefinedCode3);
    }

    tmp = tmp.toUpperCase();
    // tmp = tmp.substring(0,2) + tmp.substring(6,10) + tmp.substring(2,6); // 原始文档错误，这里不需要换位
    var resultAddressDataPair = tmp;
    // console.log(`[Debug] Result of decodeAllCharPlace(): ${tmp}`);

    var ret = {
        resultAddrDataPair: resultAddressDataPair,      // 结果"地址/数据值"对，16进制字符串形式
        codeHex: codeHex,                               // 输入的金手指码转为直接的16进制字符串后的结果
        charIJKL: charIJKL,
        charQRST: charQRST,
        predefinedCode1: predefinedCode1,
        predefinedCode2: predefinedCode2,
        predefinedCode3: predefinedCode3
    }
    return ret;
}

function encodeSingleCharPlace(inputAddrDataPair, charPlaceId, predefinedCode1, predefinedCode2, predefinedCode3) {
    charPlaceId = Math.max(0, Math.min(9, charPlaceId));    // 有效值范围保护

    var numTargetCharPlaceId = parseInt(inputAddrDataPair[charPlaceId], 16);
    var numP1 = parseInt(predefinedCode1[charPlaceId], 16);
    var numP2 = parseInt(predefinedCode2[charPlaceId], 16);
    var numP3 = parseInt(predefinedCode3[charPlaceId], 16);

    // 最前面加32是为了防止减numP3时出现负数，多余内容最后会被mod 16消去
    var numResult = (32 + numTargetCharPlaceId + numP1 - numP2 - numP3) % 16;
    return numResult.toString(16);
}

// 计算整个地址值对编码后的结果
// 参数:
//      inputAddrDataPair: 地址值对，10位字符串，前6位是地址，后4位是数据值，全大写
// 返回:
//      一个10位字符长的16进制数字的字符串
function encodeAllCharPlace(inputAddrDataPair) {
    var numChar2 = parseInt(inputAddrDataPair[2],16);
    var numChar4 = parseInt(inputAddrDataPair[4],16);
    // 计算IJKL和QRST位的值
    var numIJKL = (numChar2 + numChar4) % 16;
    var numQRST = (numIJKL + numChar4) % 16;
    var charIJKL = numIJKL.toString(16).toUpperCase();
    var charQRST = numQRST.toString(16).toUpperCase();

    // 计算中用到的第1、2、3个预定义值
    var predefinedCode1 = `${charQRST}${charQRST}${charQRST}${charQRST}${charIJKL}${charQRST}${charQRST}${charQRST}${charQRST}${charQRST}`;
    var predefinedCode2 = `${charIJKL}${charIJKL}${charIJKL}${charIJKL}0${charIJKL}${charIJKL}${charIJKL}${charIJKL}${charIJKL}`;
    var predefinedCode3 = "6000000006";    // 计算中用到的第3个预定义值

    var tmp = "";
    for(var i=0;i<10;i++) {
        tmp += encodeSingleCharPlace(inputAddrDataPair, i, predefinedCode1, predefinedCode2, predefinedCode3);
    }

    tmp = tmp.toUpperCase();
    tmp = hexString2MagicardCode(tmp);
    // tmp = tmp.substring(0,2) + tmp.substring(6,10) + tmp.substring(2,6);    // 原始文档错误，这里不需要换位
    var resultMagicardCode = tmp;
    // console.log(`[Debug] Result of encodeAllCharPlace(): ${resultMagicardCode}`);

    var ret = {
        resultMagicardCode: resultMagicardCode,     // 计算结果，即Magicard形式的金手指码字符串
        charIJKL: charIJKL,
        charQRST: charQRST,
        predefinedCode1: predefinedCode1,
        predefinedCode2: predefinedCode2,
        predefinedCode3: predefinedCode3
    }
    return ret;
}

function decodeMainProc(inputCode) {
    // Trim to 10 chars
    inputCode = inputCode.substring(0,10).toUpperCase();
    console.log(`Input code:        ${inputCode}`);

    // 验证格式
    if (validateMagicardCode(inputCode) != 0) {
        console.error(`[Error] Input code is not in valid format.`);
    } else {
        // 输出计算过程
        var rObj = decodeAllCharPlace(inputCode);
        console.log('');
        console.log(`Decoding:`);
        console.log(`  ${rObj.codeHex[0]} ${rObj.codeHex[1]} ${rObj.codeHex[2]} ${rObj.codeHex[3]} ${rObj.codeHex[4]} ${rObj.codeHex[5]} : ${rObj.codeHex[6]} ${rObj.codeHex[7]} ${rObj.codeHex[8]} ${rObj.codeHex[9]}`);
        console.log(`+ ${rObj.predefinedCode1[0]} ${rObj.predefinedCode1[1]} ${rObj.predefinedCode1[2]} ${rObj.predefinedCode1[3]} ${rObj.predefinedCode1[4]} ${rObj.predefinedCode1[5]} : ${rObj.predefinedCode1[6]} ${rObj.predefinedCode1[7]} ${rObj.predefinedCode1[8]} ${rObj.predefinedCode1[9]}`);
        console.log(`+ ${rObj.predefinedCode2[0]} ${rObj.predefinedCode2[1]} ${rObj.predefinedCode2[2]} ${rObj.predefinedCode2[3]} ${rObj.predefinedCode2[4]} ${rObj.predefinedCode2[5]} : ${rObj.predefinedCode2[6]} ${rObj.predefinedCode2[7]} ${rObj.predefinedCode2[8]} ${rObj.predefinedCode2[9]}`);
        console.log(`- ${rObj.predefinedCode3[0]} ${rObj.predefinedCode3[1]} ${rObj.predefinedCode3[2]} ${rObj.predefinedCode3[3]} ${rObj.predefinedCode3[4]} ${rObj.predefinedCode3[5]} : ${rObj.predefinedCode3[6]} ${rObj.predefinedCode3[7]} ${rObj.predefinedCode3[8]} ${rObj.predefinedCode3[9]}`);
        console.log(`& F F F F F F : F F F F`);
        console.log(`-----------------------`);
        console.log(`  ${rObj.resultAddrDataPair[0]} ${rObj.resultAddrDataPair[1]} ${rObj.resultAddrDataPair[2]} ${rObj.resultAddrDataPair[3]} ${rObj.resultAddrDataPair[4]} ${rObj.resultAddrDataPair[5]} : ${rObj.resultAddrDataPair[6]} ${rObj.resultAddrDataPair[7]} ${rObj.resultAddrDataPair[8]} ${rObj.resultAddrDataPair[9]}`);
    }
}

function encodeMainProc(inputCode) {
    // Trim to 10 chars
    inputCode = inputCode.substring(0,10).toUpperCase();
    console.log(`Input Address/Data Pair:   ${inputCode}`);

    // 验证格式
    if (validateAddrDataPair(inputCode) != 0) {
        console.error(`[Error] Input code is not in valid format.`);
    } else {
        // 输出计算过程
        var rObj = encodeAllCharPlace(inputCode);
        var encKey1 = rObj.charIJKL;
        var encKey2 = rObj.charQRST;
        console.log('');
        console.log(`Encoding:`);
        console.log(`  encKey1: ${encKey1}`);
        console.log(`  encKey2: ${encKey2}`);
        console.log('');
        console.log(`  ${inputCode[0]} ${inputCode[1]} ${inputCode[2]} ${inputCode[3]} ${inputCode[4]} ${inputCode[5]} : ${inputCode[6]} ${inputCode[7]} ${inputCode[8]} ${inputCode[9]}`);
        console.log(`+ ${rObj.predefinedCode1[0]} ${rObj.predefinedCode1[1]} ${rObj.predefinedCode1[2]} ${rObj.predefinedCode1[3]} ${rObj.predefinedCode1[4]} ${rObj.predefinedCode1[5]} : ${rObj.predefinedCode1[6]} ${rObj.predefinedCode1[7]} ${rObj.predefinedCode1[8]} ${rObj.predefinedCode1[9]}`);
        console.log(`- ${rObj.predefinedCode2[0]} ${rObj.predefinedCode2[1]} ${rObj.predefinedCode2[2]} ${rObj.predefinedCode2[3]} ${rObj.predefinedCode2[4]} ${rObj.predefinedCode2[5]} : ${rObj.predefinedCode2[6]} ${rObj.predefinedCode2[7]} ${rObj.predefinedCode2[8]} ${rObj.predefinedCode2[9]}`);
        console.log(`- ${rObj.predefinedCode3[0]} ${rObj.predefinedCode3[1]} ${rObj.predefinedCode3[2]} ${rObj.predefinedCode3[3]} ${rObj.predefinedCode3[4]} ${rObj.predefinedCode3[5]} : ${rObj.predefinedCode3[6]} ${rObj.predefinedCode3[7]} ${rObj.predefinedCode3[8]} ${rObj.predefinedCode3[9]}`);
        console.log(`& F F F F F F : F F F F`);
        console.log(`-----------------------`);
        console.log(`  ${rObj.resultMagicardCode[0]} ${rObj.resultMagicardCode[1]} ${rObj.resultMagicardCode[2]} ${rObj.resultMagicardCode[3]} ${rObj.resultMagicardCode[4]} ${rObj.resultMagicardCode[5]}   ${rObj.resultMagicardCode[6]} ${rObj.resultMagicardCode[7]} ${rObj.resultMagicardCode[8]} ${rObj.resultMagicardCode[9]}`);
    }
}

function allFeatureMainProc() {
    var inputCode = "";

    // 获取命令行参数
    var args = process.argv.slice(2);
    if (args.length > 1) {
        cmd = args[0];
        inputCode += args[1];
    }

    if ((args.length <= 1)
        || ((cmd != "encode") && (cmd != "decode")))
    {
        console.error("[Error] Parameters error. Usage:");
        console.log("  node magicardEncDec.js <cmd> <code>");
        console.log("    cmd:");
        console.log("      encode: Convert address data pair to Magicard Code.");
        console.log("      decode: Convert Magicard Code to address data pair.");
        console.log("    code:");
        console.log("      with the 'decode' command, the input code format is like 'UFFIIUKURH'.");
        console.log("      with the 'encode' command, the input code format is like '00033A4A78',");
        console.log("      where '00033A' is the address and '4A78' is the data.");
    } else if (cmd == "decode") {
        decodeMainProc(inputCode);
    } else if (cmd == "encode") {
        encodeMainProc(inputCode);
    }
}


////////////////
// 主逻辑开始
////////////////

allFeatureMainProc();

/*
////////////////////////////////////////////////////////////////////////
// 单独测试Decode
var inputCode = "";
// 获取命令行参数
var args = process.argv.slice(2);
if (args.length > 0) {
    inputCode += args[0];
}

decodeMainProc(inputCode);

////////////////////////////////////////////////////////////////////////
// 单独测试Decode
var inputCode = "";

// 获取命令行参数
var args = process.argv.slice(2);
if (args.length > 0) {
    inputCode += args[0];
}

encodeMainProc(inputCode);
*/
