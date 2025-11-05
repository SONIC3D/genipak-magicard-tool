
// 将GameGenie金手指码转换为<地址:值>对
//  by SONIC3D
//  2025.Nov.5
//
// 使用方法：
// 直接执行
//  node gamegenieEncDec.js decode ACLAATD4
//  node gamegenieEncDec.js decode ACLA-ATD4
//      (ACLAATD4/ACLA-ATD4是GameGenie格式的金手指字符串)
//  node gamegenieEncDec.js encode 00947A0800
//      (00947A是地址，0800是值)

function GameGenieCodeSystem() {
}

// 标准化输入的金手指码格式，去掉多余字符并转换为大写形式。
// 例如: 将al7A-AA56转换为AL7AAA56
// 参数:
//  inputCode: 输入的金手指码字符串，可能包含'-'等分隔符
// 返回:
//  标准化后的金手指码字符串，全部大写且不包含分隔符，长度最多8个字符
GameGenieCodeSystem.prototype.normalizeCode = function(inputCode) {
    // 将输入的inputCode中的'-'字符删除
    inputCode = inputCode.replace(/-/g, '');

    // 取inputCode的前8个字符作为最终的金手指码,如果不足8个字符则全部返回
    inputCode = inputCode.substring(0, 8);

    var ret = inputCode.toUpperCase();
    return ret;
}

// 验证输入的GameGenie金手指码格式是否合法。合法则返回0，非法则返回错误号。
// 参数:
//  inputCode: 输入的加密格式的金手指码字符串(仅支持GameGenie格式)，每个金手指码应当8个字符或9个字符(中间含有一个'-'字符)。
// 错误号:
//  0: Success
//  -1: Invalid code length.
//  -2: Code contains invalid character(s).
//      (Valid GameGenie characters list: ABCDEFGHJKLMNPRSTVWXYZ0123456789, 32 characters in total, no 'I', 'O', 'Q', 'U')
GameGenieCodeSystem.prototype.validateEncryptedCode = function(inputCode) {
    var ret = 0;
    // 长度校验
    if (inputCode.length != 8) {
        console.error(`[Error] Invalid code length, valid code must be in 8 characters.`);
        ret = -1;
    }
    // 内容字符校验
    var strRegex = /[^ABCDEFGHJKLMNPRSTVWXYZ0123456789]/g;  // GameGenie code
    var charValidationResult = inputCode.match(strRegex);
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
GameGenieCodeSystem.prototype.validateAddrDataPair = function(strInput) {
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

// 将GameGenie格式的金手指码字符串的每一个字符转换成对应该字符的2进制字符串
// 注意：应确保输入的金手指码全为大写字符
GameGenieCodeSystem.prototype.gamegenieCode2BinString = function(inCode) {
    // 1st pass: replace '0' and '1' to temporary strings
    while(inCode.indexOf('0') != -1) {inCode = inCode.replace('0', 'babba');}   // '0' should be replaced as 10110, but it will affect later replacements, so use temporary string 'a' as 0 and 'b' as 1, to do 2-pass replacement
    while(inCode.indexOf('1') != -1) {inCode = inCode.replace('1', 'babbb');}   // '1' should be replaced as 10111, but it will affect later replacements, so use temporary string 'a' as 0 and 'b' as 1, to do 2-pass replacement

    // 2nd pass: replace temporary strings and other string to final binary digits
    while(inCode.indexOf('a') != -1) {inCode = inCode.replace('a', '0');}
    while(inCode.indexOf('b') != -1) {inCode = inCode.replace('b', '1');}

    while(inCode.indexOf('A') != -1) {inCode = inCode.replace('A', '00000');}
    while(inCode.indexOf('B') != -1) {inCode = inCode.replace('B', '00001');}
    while(inCode.indexOf('C') != -1) {inCode = inCode.replace('C', '00010');}
    while(inCode.indexOf('D') != -1) {inCode = inCode.replace('D', '00011');}
    while(inCode.indexOf('E') != -1) {inCode = inCode.replace('E', '00100');}
    while(inCode.indexOf('F') != -1) {inCode = inCode.replace('F', '00101');}
    while(inCode.indexOf('G') != -1) {inCode = inCode.replace('G', '00110');}
    while(inCode.indexOf('H') != -1) {inCode = inCode.replace('H', '00111');}
    while(inCode.indexOf('J') != -1) {inCode = inCode.replace('J', '01000');}
    while(inCode.indexOf('K') != -1) {inCode = inCode.replace('K', '01001');}
    while(inCode.indexOf('L') != -1) {inCode = inCode.replace('L', '01010');}
    while(inCode.indexOf('M') != -1) {inCode = inCode.replace('M', '01011');}
    while(inCode.indexOf('N') != -1) {inCode = inCode.replace('N', '01100');}
    while(inCode.indexOf('P') != -1) {inCode = inCode.replace('P', '01101');}
    while(inCode.indexOf('R') != -1) {inCode = inCode.replace('R', '01110');}
    while(inCode.indexOf('S') != -1) {inCode = inCode.replace('S', '01111');}
    while(inCode.indexOf('T') != -1) {inCode = inCode.replace('T', '10000');}
    while(inCode.indexOf('V') != -1) {inCode = inCode.replace('V', '10001');}
    while(inCode.indexOf('W') != -1) {inCode = inCode.replace('W', '10010');}
    while(inCode.indexOf('X') != -1) {inCode = inCode.replace('X', '10011');}
    while(inCode.indexOf('Y') != -1) {inCode = inCode.replace('Y', '10100');}
    while(inCode.indexOf('Z') != -1) {inCode = inCode.replace('Z', '10101');}

    // while(inCode.indexOf('0') != -1) {inCode = inCode.replace('0', '10110');}    // Already replaced ahead
    // while(inCode.indexOf('1') != -1) {inCode = inCode.replace('1', '10111');}    // Already replaced ahead
    while(inCode.indexOf('2') != -1) {inCode = inCode.replace('2', '11000');}
    while(inCode.indexOf('3') != -1) {inCode = inCode.replace('3', '11001');}
    while(inCode.indexOf('4') != -1) {inCode = inCode.replace('4', '11010');}
    while(inCode.indexOf('5') != -1) {inCode = inCode.replace('5', '11011');}
    while(inCode.indexOf('6') != -1) {inCode = inCode.replace('6', '11100');}
    while(inCode.indexOf('7') != -1) {inCode = inCode.replace('7', '11101');}
    while(inCode.indexOf('8') != -1) {inCode = inCode.replace('8', '11110');}
    while(inCode.indexOf('9') != -1) {inCode = inCode.replace('9', '11111');}

    return inCode;
}

// 将2进制字符串按5bit为单位作分割，然后转换成对应的GameGenie格式的金手指码字符串的字符并返回该字符串
// 如果含有无法识别的5bit字符串值，则返回null
GameGenieCodeSystem.prototype.binString2GameGenieCode = function(inCode) {
    // 构造一个二进制字符串映射到GG字符的映射字典
    var binToGGCharMap = {
        '00000': 'A',
        '00001': 'B',
        '00010': 'C',
        '00011': 'D',
        '00100': 'E',
        '00101': 'F',
        '00110': 'G',
        '00111': 'H',
        '01000': 'J',
        '01001': 'K',
        '01010': 'L',
        '01011': 'M',
        '01100': 'N',
        '01101': 'P',
        '01110': 'R',
        '01111': 'S',
        '10000': 'T',
        '10001': 'V',
        '10010': 'W',
        '10011': 'X',
        '10100': 'Y',
        '10101': 'Z',
        '10110': '0',
        '10111': '1',
        '11000': '2',
        '11001': '3',
        '11010': '4',
        '11011': '5',
        '11100': '6',
        '11101': '7',
        '11110': '8',
        '11111': '9'
    };

    // 将inCode按5位一组放进一个字符串数组
    var arrInCodeParts = [];
    for(var i=0;i<inCode.length;i+=5) {
        arrInCodeParts.push(inCode.substring(i, i+5));
    }

    // 替换每一组5位二进制字符串为对应的GG字符
    var ret = "";
    for(var j=0;j<arrInCodeParts.length;j++) {
        var currPart = arrInCodeParts[j];
        if (!(currPart in binToGGCharMap)) {
            return null;
        }
        ret += binToGGCharMap[currPart];
    }
    return ret;
}

// 将"00101100"这样的二进制值字符串转换成对应的十六进制的"2C"这样的字符串
GameGenieCodeSystem.prototype.binString2HexString = function(inCode) {
    var hexString = "";
    for (var i = 0; i < inCode.length; i += 4) {
        var currPart = inCode.substring(i, i + 4);
        var hexChar = parseInt(currPart, 2).toString(16).toUpperCase();
        hexString += hexChar;
    }
    return hexString;
}

// 将"2C"这样的十六进制值字符串转换成对应的二进制的"00101100"这样的字符串
GameGenieCodeSystem.prototype.hexString2BinString = function(inCode) {
    var binString = "";
    for (var i = 0; i < inCode.length; i++) {
        var hexChar = inCode[i];
        var binChar = parseInt(hexChar, 16).toString(2).padStart(4, '0');
        binString += binChar;
    }
    return binString;
}

// 解析输入的GameGenie码, 返回含有解析解过和中间数据的一个结构体
GameGenieCodeSystem.prototype.decodeAllCharPlace = function(inputCode) {
    var codeBinStr = this.gamegenieCode2BinString(inputCode);
    // console.log(`Input code(BIN):   \n${codeBinStr}`);

    // 将codeBinStr按4位一组放进一个字符串数组
    var arrCodeBinStrParts = [];
    for(var i=0;i<codeBinStr.length;i+=4) {
        arrCodeBinStrParts.push(codeBinStr.substring(i, i+4));
    }

    // 将分组后的内容用空格连接起来，方便打印
    var spacedCodeBinStr = arrCodeBinStrParts.join(" ");
    // console.log(`Input code(BIN, grouped in 4-bit):`);
    // console.log(` G0   G1   G2   G3   G4   G5   G6   G7   G8   G9`);
    // console.log(`${spacedCodeBinStr}`);

    //////////////////////////////////////////////////
    // 对arrCodeBinStrParts进行顺序更换,
    // 新数组中第0、1组对应老数组的第4、5组，新数组的第2、3组对应老数组的第2、3组
    // 新数组中第4、5组对应老数组的第8、9组，新数组的第6、7组对应老数组的第7、6组(然后把第6组第一个字符移动到第7组末尾，第7组第一个字符移动到第6组末尾)
    // 新数组中第8、9组对应老数组的第0、1组
    var arrRearrangedBinStrParts = [];
    arrRearrangedBinStrParts[0] = arrCodeBinStrParts[4];
    arrRearrangedBinStrParts[1] = arrCodeBinStrParts[5];
    arrRearrangedBinStrParts[2] = arrCodeBinStrParts[2];
    arrRearrangedBinStrParts[3] = arrCodeBinStrParts[3];
    arrRearrangedBinStrParts[4] = arrCodeBinStrParts[8];
    arrRearrangedBinStrParts[5] = arrCodeBinStrParts[9];
    arrRearrangedBinStrParts[6] = arrCodeBinStrParts[7];
    arrRearrangedBinStrParts[7] = arrCodeBinStrParts[6];
    arrRearrangedBinStrParts[8] = arrCodeBinStrParts[0];
    arrRearrangedBinStrParts[9] = arrCodeBinStrParts[1];

    // 将按组重排布后的内容用空格连接起来，方便打印
    var spacedRearrangedCodeBinStr = arrRearrangedBinStrParts.join(" ");
    // console.log(`Group rearranged code(BIN, grouped in 4-bit):`);
    // console.log(` G4   G5   G2   G3   G8   G9   G7   G6   G0   G1`);
    // console.log(`${spacedRearrangedCodeBinStr}`);

    //////////////////////////////////////////////////
    // 处理第6、7组的字符循环左移位
    var arrBitRotatedBinStrParts = [];
    for (var i = 0; i < arrRearrangedBinStrParts.length; i++) {
        arrBitRotatedBinStrParts[i] = arrRearrangedBinStrParts[i];
    }
    var tmpChar6GroupFirstChar = arrBitRotatedBinStrParts[6][0];
    arrBitRotatedBinStrParts[6] = arrBitRotatedBinStrParts[6].substring(1) + arrBitRotatedBinStrParts[7][0];
    arrBitRotatedBinStrParts[7] = arrBitRotatedBinStrParts[7].substring(1) + tmpChar6GroupFirstChar;

    // 将G6 G7循环位移后的内容用空格连接起来，方便打印
    var spacedBitRotatedCodeBinStr = arrBitRotatedBinStrParts.join(" ");
    // console.log(`Bit rotated G6 and G7 code(BIN, grouped in 4-bit):`);
    // console.log(` G4   G5   G2   G3   G8   G9   G7*  G6*  G0   G1`);
    // console.log(`${spacedBitRotatedCodeBinStr}`);

    //////////////////////////////////////////////////
    // 合并转换到最终十六进制结果
    decodedBinStr = arrBitRotatedBinStrParts.join("");
    decodedHexStr = this.binString2HexString(decodedBinStr);

    // console.log(`Decoded result(HEX):`);
    // console.log(`${decodedHexStr}`);

    var ret = {
        resultAddrDataPair: decodedHexStr,      // 结果"地址/数据值"对，16进制字符串形式
        codeBinStr: codeBinStr,                 // 输入的金手指码2进制字符串
        decodedBinStr: decodedBinStr,           // 全部解码后的2进制字符串
        // 以下是一些中间结果
        arrCodeBinStrParts: arrCodeBinStrParts, // 输入的金手指码2进制字符串按4bit分组后的数组
        arrRearrangedBinStrParts: arrRearrangedBinStrParts, // 重排布后的2进制字符串按4bit分组后的数组
        arrBitRotatedBinStrParts: arrBitRotatedBinStrParts  // G6G7组数据位进行循环位移后的2进制字符串按4bit分组后的数组
    }
    return ret;
}

GameGenieCodeSystem.prototype.encodeAllCharPlace = function(inputAddrDataPair) {
    var inputAddrDataPairBinStr = this.hexString2BinString(inputAddrDataPair);
    // 将inputAddrDataPairBinStr按4位一组放进一个字符串数组
    var arrInputAddrDataPairBinStrParts = [];
    for (var i = 0; i < inputAddrDataPairBinStr.length; i += 4) {
        arrInputAddrDataPairBinStrParts.push(inputAddrDataPairBinStr.substring(i, i + 4));
    }

    // 将原始地址值对对应的二进制字符串内容用空格连接起来，方便打印
    var spacedInputAddrDataPairBinStr = arrInputAddrDataPairBinStrParts.join(" ");
    // console.log(`Input Address/Data pair(BIN, grouped in 4-bit):`);
    // console.log(` G0   G1   G2   G3   G4   G5   G6   G7   G8   G9`);
    // console.log(`${spacedInputAddrDataPairBinStr}`);

    //////////////////////////////////////////////////
    // 处理第6、7组的字符循环右移位
    var arrBitRotatedBinStrParts = [];
    for (var i = 0; i < arrInputAddrDataPairBinStrParts.length; i++) {
        arrBitRotatedBinStrParts[i] = arrInputAddrDataPairBinStrParts[i];
    }
    var tmpChar6GroupLastChar = arrBitRotatedBinStrParts[6][3];
    var tmpChar7GroupLastChar = arrBitRotatedBinStrParts[7][3];
    arrBitRotatedBinStrParts[6] = tmpChar7GroupLastChar + arrBitRotatedBinStrParts[6].substring(0,3);
    arrBitRotatedBinStrParts[7] = tmpChar6GroupLastChar + arrBitRotatedBinStrParts[7].substring(0,3);

    // 将G6 G7循环位移后的内容用空格连接起来，方便打印
    var spacedBitRotatedCodeBinStr = arrBitRotatedBinStrParts.join(" ");
    // console.log(`Bit rotated G6 and G7 code(BIN, grouped in 4-bit):`);
    // console.log(` G0   G1   G2   G3   G4   G5   G6*  G7*  G8   G9`);
    // console.log(`${spacedBitRotatedCodeBinStr}`);

    //////////////////////////////////////////////////
    // 对arrCodeBinStrParts进行顺序更换,
    // 新数组中第0、1组对应老数组的第8、9组
    // 新数组的第2、3组对应老数组的第2、3组, 新数组中第4、5组对应老数组的第0、1组
    // 新数组的第6、7组对应老数组的第7、6组(要在之前先把第6组最后一个字符移动到第7组第一个字符位置，第7组最后一个字符移动到第6组第一个字符位置)
    // 新数组中第8、9组对应老数组的第4、5组
    var arrRearrangedBinStrParts = [];
    arrRearrangedBinStrParts[0] = arrBitRotatedBinStrParts[8];
    arrRearrangedBinStrParts[1] = arrBitRotatedBinStrParts[9];
    arrRearrangedBinStrParts[2] = arrBitRotatedBinStrParts[2];
    arrRearrangedBinStrParts[3] = arrBitRotatedBinStrParts[3];
    arrRearrangedBinStrParts[4] = arrBitRotatedBinStrParts[0];
    arrRearrangedBinStrParts[5] = arrBitRotatedBinStrParts[1];
    arrRearrangedBinStrParts[6] = arrBitRotatedBinStrParts[7];
    arrRearrangedBinStrParts[7] = arrBitRotatedBinStrParts[6];
    arrRearrangedBinStrParts[8] = arrBitRotatedBinStrParts[4];
    arrRearrangedBinStrParts[9] = arrBitRotatedBinStrParts[5];

    // 将按组重排布后的内容用空格连接起来，方便打印
    var spacedRearrangedCodeBinStr = arrRearrangedBinStrParts.join(" ");
    // console.log(`Group rearranged code(BIN, grouped in 4-bit):`);
    // console.log(` G8   G9   G2   G3   G0   G1   G7   G6   G4   G5`);
    // console.log(`${spacedRearrangedCodeBinStr}`);

    //////////////////////////////////////////////////
    // 合并转换到最终十六进制结果
    var encodedBinStr = arrRearrangedBinStrParts.join("");
    var encodedGameGenieCode = this.binString2GameGenieCode(encodedBinStr);

    // console.log(`Encoded result(GameGenie):`);
    // console.log(`${encodedGameGenieCode}`);

    // 将encodedBinStr按5位一组放进一个字符串数组(供外部调用方使用)
    var arrEncodedBinStrParts = [];
    for(var i=0;i<encodedBinStr.length;i+=5) {
        arrEncodedBinStrParts.push(encodedBinStr.substring(i, i+5));
    }

    var ret = {
        resultEncryptedCode: encodedGameGenieCode,      // 计算结果，即GameGenie形式的金手指码字符串
        addrDataPairBinStr: inputAddrDataPairBinStr,    // 输入的地址/数据对的2进制字符串
        encodedBinStr: encodedBinStr,                   // 全部编码后的2进制字符串
        arrEncodedBinStrParts: arrEncodedBinStrParts,   // 编码后的2进制字符串按5bit分组后的数组
        // 以下是一些中间结果
        arrInputAddrDataPairBinStrParts: arrInputAddrDataPairBinStrParts, // 输入的地址/数据对的2进制字符串按4bit分组后的数组
        arrBitRotatedBinStrParts: arrBitRotatedBinStrParts, // G6G7组数据位进行循环位移后的2进制字符串按4bit分组后的数组
        arrRearrangedBinStrParts: arrRearrangedBinStrParts  // 重排布后的2进制字符串按4bit分组后的数组
    }
    return ret;
}

GameGenieCodeSystem.prototype.decodeMainProc = function(inputCode) {
    // Trim to 9 chars
    inputCode = inputCode.substring(0,9).toUpperCase();
    // 标准化输入内容
    inputCode = this.normalizeCode(inputCode);

    console.log(`Input code:        ${inputCode}`);

    // 验证格式
    if (this.validateEncryptedCode(inputCode) != 0) {
        console.error(`[Error] Input code is not in valid format.`);
    } else {
        // 输出计算过程
        var rObj = this.decodeAllCharPlace(inputCode);
        var codeBinStr = rObj.codeBinStr;
        var spacedCodeBinStr = rObj.arrCodeBinStrParts.join(" ");   // 将分组后的内容用空格连接起来，方便打印
        var spacedRearrangedCodeBinStr = rObj.arrRearrangedBinStrParts.join(" ");    // 将按组重排布后的内容用空格连接起来，方便打印
        var spacedBitRotatedCodeBinStr = rObj.arrBitRotatedBinStrParts.join(" ");    // 将G6 G7循环位移后的内容用空格连接起来，方便打印

        console.log('');
        console.log(`Input code(BIN):   \n${codeBinStr}`);
        console.log('');
        console.log(`Decoding:`);
        console.log(`Step 1: Input code(BIN, grouped in 4-bit):`);
        console.log(`     G0   G1   G2   G3   G4   G5   G6   G7   G8   G9`);
        console.log(`    ${spacedCodeBinStr}`);
        console.log(`Step 2: Group rearranged code(BIN, grouped in 4-bit):`);
        console.log(`     G4   G5   G2   G3   G8   G9   G7   G6   G0   G1`);
        console.log(`    ${spacedRearrangedCodeBinStr}`);
        console.log(`Step 3: Bit rotated G6 and G7 code(BIN, grouped in 4-bit):`);
        console.log(`     G4   G5   G2   G3   G8   G9   G7*  G6*  G0   G1`);
        console.log(`    ${spacedBitRotatedCodeBinStr}`);
        console.log(`-----------------------------------------------------`);
        console.log(`    ${rObj.resultAddrDataPair[0]}    ${rObj.resultAddrDataPair[1]}    ${rObj.resultAddrDataPair[2]}    ${rObj.resultAddrDataPair[3]}    ${rObj.resultAddrDataPair[4]}    ${rObj.resultAddrDataPair[5]}  :  ${rObj.resultAddrDataPair[6]}    ${rObj.resultAddrDataPair[7]}    ${rObj.resultAddrDataPair[8]}    ${rObj.resultAddrDataPair[9]}`);
        console.log('');
        console.log(`Decoded result(HEX):`);
        console.log(`${rObj.resultAddrDataPair}`);
    }
}

// 将<地址:值>对转换为GameGenie金手指码
GameGenieCodeSystem.prototype.encodeMainProc = function(inputCode) {
    // Trim to 10 chars
    inputCode = inputCode.substring(0,10).toUpperCase();
    console.log(`Input Address/Data Pair:   ${inputCode}`);


    // 验证格式
    if (this.validateAddrDataPair(inputCode) != 0) {
        console.error(`[Error] Input code is not in valid format.`);
    } else {
        // 输出计算过程
        var rObj = this.encodeAllCharPlace(inputCode);
        var addrDataPairBinStr = rObj.addrDataPairBinStr;
        var spacedInputAddrDataPairBinStr = rObj.arrInputAddrDataPairBinStrParts.join(" ");
        var spacedBitRotatedCodeBinStr = rObj.arrBitRotatedBinStrParts.join(" ");
        var spacedRearrangedCodeBinStr = rObj.arrRearrangedBinStrParts.join(" ");
        var groupedEncodedBinStr = rObj.arrEncodedBinStrParts.join(" ");

        console.log('');
        console.log(`Input address/data pair(BIN):   \n${addrDataPairBinStr}`);
        console.log('');
        console.log(`Encoding:`);
        console.log(`Step 1: Input Address/Data pair(BIN, grouped in 4-bit):`);
        console.log(`     G0   G1   G2   G3   G4   G5   G6   G7   G8   G9`);
        console.log(`    ${spacedInputAddrDataPairBinStr}`);
        console.log(`Step 2: Bit rotated G6 and G7 code(BIN, grouped in 4-bit):`);
        console.log(`     G0   G1   G2   G3   G4   G5   G6*  G7*  G8   G9`);
        console.log(`    ${spacedBitRotatedCodeBinStr}`);
        console.log(`Step 3: Group rearranged code(BIN, grouped in 4-bit):`);
        console.log(`     G8   G9   G2   G3   G0   G1   G7   G6   G4   G5`);
        console.log(`    ${spacedRearrangedCodeBinStr}`);
        console.log(`Step 4: Re-grouped the code(BIN, grouped in 5-bit):`);
        console.log(`    ${groupedEncodedBinStr}`);
        console.log(`-----------------------------------------------------`);
        console.log(`    ${rObj.resultEncryptedCode[0]}     ${rObj.resultEncryptedCode[1]}     ${rObj.resultEncryptedCode[2]}     ${rObj.resultEncryptedCode[3]}     ${rObj.resultEncryptedCode[4]}     ${rObj.resultEncryptedCode[5]}     ${rObj.resultEncryptedCode[6]}     ${rObj.resultEncryptedCode[7]}`);
        console.log('');
        console.log(`Encoded result(GameGenie):`);
        console.log(`${rObj.resultEncryptedCode}`);
    }
}



// 包含所有功能的主处理过程
function allFeatureMainProc_GG() {
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
        console.log("  node gamegenieEncDec.js <cmd> <code>");
        console.log("    cmd:");
        console.log("      encode: Convert address data pair to GameGenie Code.");
        console.log("      decode: Convert GameGenie Code to address data pair.");
        console.log("    code:");
        console.log("      with the 'decode' command, the input code format is like 'ACLAATD4' or 'ACLA-ATD4'.");
        console.log("      with the 'encode' command, the input code format is like '00947A0800',");
        console.log("      where '00947A' is the address and '0800' is the data.");
    } else if (cmd == "decode") {
        var ggCodeSys = new GameGenieCodeSystem();
        ggCodeSys.decodeMainProc(inputCode);
    } else if (cmd == "encode") {
        var ggCodeSys = new GameGenieCodeSystem();
        ggCodeSys.encodeMainProc(inputCode);
    }
}


////////////////
// 主逻辑开始
////////////////

// allFeatureMainProc_GG();

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
