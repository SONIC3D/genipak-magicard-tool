# Genipak and Magicard Tool

## Introduction
The Genipak and Magicard Tool is a tool for converting raw address/value pairs of cheating codes to Genipak and Magicard formats.

## About Genipak and Magicard
Genipak and Magicard are Sega Genesis/MegaDrive cheating devices similar to Game Genie. Genipak was developed by Realtek in 1992, and Magicard is a modified version released by Gamtec. They are technically ROM bus patching tools.

The code formats of Genipak and Magicard are different. But the internal algorithm is the same.

## How to use
For the Node.js version, you need to install Node.js first. Then run `node genipakEncDec.js` or `node magicardEncDec.js` to check the detailed usage notes.

For the HTML version, just open the index.html file in your browser. Enter the code and press the corresponding button to convert.

## Code format and the algorithm
Both Genipak and Magicard codes are 10 characters long. The code can be converted to a raw address/value pair for patching the data output on the console ROM bus. (The address is 24 bits long, and the value is 16 bits long.)

If you plan to verify the algorithm details in this doc. The original decoding code function entry is at the offset 0x0F3A of the Genipak ROM, and the offset 0x0FC8 of the Magicard ROM.

The decoding algorithm (converting the cheating code to a raw address/value pair) can be split into the following steps:
1. Code character values transition.
2. Encryption key extraction.
3. Apply the decoding algorithm to each character and concatenate the results.

### Code character values transition
* The valid input characters for Genipak are:  "ABCDEFGHIJKLMNOP".
* The valid input characters for Magicard are: "ABDFGHIKNPRSTUYZ".

Each character can be converted to a 4-bit HEX value. The conversion table is as follows:
| HEX value| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | A | B | C | D | E | F |
| -------- | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - | - |
| Genipak  | A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
| Magicard | A | B | D | F | G | H | I | K | N | P | R | S | T | U | Y | Z |

### Encryption key extraction
After converting the cheat code to a HEX value string, there are 2 encryption key characters that need to be extracted.
* The 1st key char is the 3rd char of the HEX string.
* The 2nd key char is the 5th char of the HEX string.

### Apply the decoding algorithm to each character
1. Treat each char of the HEX string as a 4-bit HEX number in the following steps.
2. For the 1st char and 10th char of the HEX string, add 6 to each of them and MOD them by $F.
3. For the 5th char of the HEX string, add $F to it, then minus the key1, then MOD it by $F.
4. For the other chars of the HEX string, add $F to it, then add the (key1-key2), then MOD it by $F.
5. Concatenate all the result characters in their original order, the first 6 chars are the decoded address, and the rest 4 chars are the value.

### Decoding example
* Input Genipak code: LBENFNFPIM
* Step 1: Convert to HEX string: B14D5D5F8C
* Step 2: Get key1 = 4, and key2 = 5
* Step 3: Apply the algorithm and concat the result string.
    ```
      B 1 4 D 5 D : 5 F 8 C
    + 6 0 0 0 0 0 : 0 0 0 6
    + 4 4 4 4 0 4 : 4 4 4 4
    - 5 5 5 5 4 5 : 5 5 5 5
    & F F F F F F : F F F F
    -----------------------
      0 0 3 C 1 C : 4 E 7 1
    ```
* Finally, we get the raw address/value pair: `003C1C:4E71`.

### Encoding the raw address/value pair to the Genipak or Magicard code
Basically, it's just the reversed calculation steps of the decoding algorithm. 
1. Encryption key calculation.
2. Apply the encoding algorithm to each character and concatenate the results.
3. Code character values transition.

The primary difference is the step of calculating the encryption keys.

### Encryption key calculation
1. Concatenate the address (6 chars) and the value (4 chars) as the input string.
2. Get the 3rd char from the input string as data_1.
3. Get the 5th char from the input string as data_2.
4. The key1 = (data_1 + data_2) % 0xF.
5. The key2 = (key1 + data_2) % 0xF.

### Encoding example
* RAW address value pair: 00033A:4A78, so the input string is 00033A4A78.
* Step 1: Calculate the encryption keys.
    ```
    data_1 = 0;
    data_2 = 3;
    key1 = (data_1 + data_2) % 0xF = (0 + 3) % 0xF = 3;
    key2 = (key1 + data_2) % 0xF = (3 + 3) % 0xF = 6;
    ```
* Step 2: Apply the algorithm and concatenate the result string.
    ```
      0 0 0 3 3 A : 4 A 7 8
    + 6 6 6 6 3 6 : 6 6 6 6
    - 3 3 3 3 0 3 : 3 3 3 3
    - 6 0 0 0 0 0 : 0 0 0 6
    & F F F F F F : F F F F
    -----------------------
      D 3 3 6 6 D   7 D A 5
    ```
* Step 3: Transform the HEX string `D3366D7DA5` to Genipak and Magicard code formats.
    * Genipak code: NDDGGNHNKF
    * Magicard code: UFFIIUKURH

## Other Technical Details
### Hardware register info
* $8000: Mode Register
    * Byte Access, Write Only
        * Bit 7-6: Unused (always set to 1 in code)
        * Bit 5: Cheating code line 5 status (0: enabled, 1: disabled)
        * Bit 4: Cheating code line 4 status (0: enabled, 1: disabled)
        * Bit 3: Cheating code line 3 status (0: enabled, 1: disabled)
        * Bit 2: Cheating code line 2 status (0: enabled, 1: disabled)
        * Bit 1: Cheating code line 1 status (0: enabled, 1: disabled)
        * Bit 0: Cheating program ROM/Game cartridge ROM mapping status (0: Genipak/Magicard ROM, 1: game cartridge ROM)
    * Cheating code is disable if the sum value of all the char values in the code is 0.
* $8002-$801E: Patch Registers
    * Word Access, Write Only
    * $8002: Cheating code line 1 patch address LSW(Bit 15-0 of the target address).
    * $8004: Cheating code line 1 patch address MSW(Bit 31-16 of the target address).
        * Bit 31..24 are always 0 in calculation result. (May not be actually mapped to any real hardware register, as the 68000 address bus is 24-bit.)
    * $8006: Cheating code line 1 patch data.
    * $8008: Cheating code line 2 patch address LSW.
    * $800A: Cheating code line 2 patch address MSW.
    * $800C: Cheating code line 2 patch data.
    * $800E: Cheating code line 3 patch address LSW.
    * $8010: Cheating code line 3 patch address MSW.
    * $8012: Cheating code line 3 patch data.
    * $8014: Cheating code line 4 patch address LSW.
    * $8016: Cheating code line 4 patch address MSW.
    * $8018: Cheating code line 4 patch data.
    * $801A: Cheating code line 5 patch address LSW.
    * $801C: Cheating code line 5 patch address MSW.
    * $801E: Cheating code line 5 patch data.

## Special Thanks
* EkeEke(eke_eke31@yahoo.fr), for the original Magicard notes.
* dtxyy(QQ: 8583***44), for donating a working Magicard to me. (Oct,2022)
* 老何189276(QQ: 2726****61), for donating a working Genipak to me. (May,2023)

## Reference
* Notes written by EkeEke and referenced by [this topic](http://gendev.spritesmind.net/forum/viewtopic.php?t=813)(via archive.org): [http://genplus-gx.googlecode.com/files/gamtec.txt](https://web.archive.org/web/20110901131001/http://genplus-gx.googlecode.com/files/gamtec.txt)
    * Please note that the register mapping info and the code concatenation info in the above notes are incorrect. Check the section [Hardware register info](#hardware-register-info) and [Code format and the algorithm](#code-format-and-the-algorithm) in current ReadMe for the corrected info.
* Genipak: https://segaretro.org/Genipak
* Magicard: https://segaretro.org/Magicard

## Cart Images
* Genipak
    <br><img src="https://github.com/SONIC3D/genipak-magicard-tool/blob/master/cart_images/genipak/IMG_4711_small.jpg?raw=true" width="512" />
* Magicard
    <br><img src="https://github.com/SONIC3D/genipak-magicard-tool/blob/master/cart_images/magicard/IMG_0603_small.jpg?raw=true" width="512" />
