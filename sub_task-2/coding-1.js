const processLines =  require("./process_lines");

class BaseAlphabetCombinationsGenerator {
    #result = [];
    _input = "";

    #digitToAlphabet(digit) {
        return String.fromCharCode(digit + 64);
    }

    #backtrack(current, remainingDigits) {
        if (remainingDigits.length === 0) {
            this.#result.push(current);
            return;
        }


        const firstDigit = parseInt(remainingDigits[0], 10);
        const firstAlphabet = this.#digitToAlphabet(firstDigit);
        this.#backtrack(current + firstAlphabet, remainingDigits.slice(1));

        if (remainingDigits.length > 1) {
            const twoDigitNumber = parseInt(remainingDigits.slice(0, 2), 10);
            if (twoDigitNumber <= 26) {
                const twoDigitAlphabet = this.#digitToAlphabet(twoDigitNumber);
                this.#backtrack(current + twoDigitAlphabet, remainingDigits.slice(2));
            }
        }
    }

    constructor(input) {
        this._input = isNaN(input) ? 0 : input;
    }

    generateCombinations() {
        this.#result = [];
        this.#backtrack('', this._input.toString());
        return this.#result.join(',');
    }
}

class AlphabetCombinationsGenerator extends BaseAlphabetCombinationsGenerator {
    #result = [];

    generateCombinations() {
        console.log('Backtracking Result:',super.generateCombinations());
        this.stack = [];
        this.#result = [];
        this.stack.push({ current: '', remainingDigits: this._input.toString() });

        while (this.stack.length > 0) {
            const { current, remainingDigits } = this.stack.pop();

            if (remainingDigits.length === 0) {
                this.#result.push(current);
            } else {
                const firstDigit = parseInt(remainingDigits[0], 10);
                const firstAlphabet = this.#digitToAlphabet(firstDigit);
                this.stack.push({ current: current + firstAlphabet, remainingDigits: remainingDigits.slice(1) });

                if (remainingDigits.length > 1) {
                    const twoDigitNumber = parseInt(remainingDigits.slice(0, 2), 10);
                    if (twoDigitNumber <= 26) {
                        const twoDigitAlphabet = this.#digitToAlphabet(twoDigitNumber);
                        this.stack.push({ current: current + twoDigitAlphabet, remainingDigits: remainingDigits.slice(2) });
                    }
                }
            }
        }

        return this.#result.join(',');
    }

    #digitToAlphabet(digit) {
        return String.fromCharCode(digit + 64);
    }
}

const executeCoding1 = (input)=>{
    const generator = new AlphabetCombinationsGenerator(input);
    const possibleOutputs = generator.generateCombinations();
    console.log('Iterative Result:', possibleOutputs);
}
processLines("./input-1.txt",executeCoding1);
