type GGONValue = string | GGONMap | GGONList;

interface GGONMap {
    [key: string]: GGONValue;
}

interface GGONList extends GGONMap {
    length: number;
}

class GGONParser {
    private pos: number = 0;
    private input: string = '';

    parse(input: string): GGONValue {
        this.input = input;
        this.pos = 0;
        try {
            return this.parseValue();
        } catch (e) {
            e.message += '\n' + this.input.slice(Math.max(0, this.pos - 10), this.pos + 10);
            throw e;
        }
    }

    private parseValue(): GGONValue {
        this.skipWhitespace();
        const char = this.input[this.pos];
        if (char === '{') {
            return this.parseMap();
        } else if (char === '[') {
            return this.parseList();
        } else if (char === "'") {
            return this.parseQuotedString();
        } else {
            return this.parseUnquotedString();
        }
    }

    private parseMap(): GGONMap {
        const map: GGONMap = {};
        this.pos++; // Skip '{'
        this.skipWhitespace();

        while (this.input[this.pos] !== '}') {
            const key = this.parseString();
            this.skipWhitespace();
            if (this.input[this.pos] !== ':') throw new Error("Expected ':' after key in map");
            this.pos++; // Skip ':'
            this.skipWhitespace();
            const value = this.parseValue();
            map[key] = value;
            this.skipWhitespace();
            if (this.input[this.pos] === ',') {
                this.pos++; // Skip ','
                this.skipWhitespace();
            }
        }
        this.pos++; // Skip '}'
        return map;
    }

    private parseList(): GGONList {
        const list: GGONList = { length: 0 };
        this.pos++; // Skip '['
        this.skipWhitespace();

        let index = 0;
        while (this.input[this.pos] !== ']') {
            const value = this.parseValue();
            list[index.toString()] = value;
            index++;
            this.skipWhitespace();
            if (this.input[this.pos] === ',') {
                this.pos++; // Skip ','
                this.skipWhitespace();
            }
        }
        this.pos++; // Skip ']'
        list.length = index;
        return list;
    }

    private parseQuotedString(): string {
        let result = '';
        this.pos++; // Skip opening quote
        while (this.input[this.pos] !== "'" || this.input[this.pos - 1] === '\\') {
            if (this.input[this.pos] === '\\') {
                this.pos++;
                switch (this.input[this.pos]) {
                    case '\\': result += '\\'; break;
                    case "'": result += "'"; break;
                    case 'n': result += '\n'; break;
                    case 'r': result += '\r'; break;
                    case 't': result += '\t'; break;
                    case '0': result += '\0'; break;
                    default: throw new Error(`Invalid escape sequence: \\${this.input[this.pos]}`);
                }
            } else {
                result += this.input[this.pos];
            }
            this.pos++;
        }
        this.pos++; // Skip closing quote
        return result;
    }

    private parseUnquotedString(): string {
        const match = this.input.slice(this.pos).match(/^[a-zA-Z0-9_\.\-\+]+/);
        if (!match) throw new Error('Invalid unquoted string');
        const result = match[0];
        this.pos += result.length;
        return result;
    }

    private parseString(): string {
        return this.input[this.pos] === "'" ? this.parseQuotedString() : this.parseUnquotedString();
    }

    private skipWhitespace(): void {
        while (/\s/.test(this.input[this.pos])) {
            this.pos++;
        }
    }
}

export function parse(ggonString: string): GGONValue {
    const parser = new GGONParser();
    return parser.parse(ggonString);
}

function example() {
    // Usage example:
    const ggonString = `{
        unquoted: value,
        'quoted key': 'quoted value',
        list: [1, two, 'three'],
        nestedMap: {
            key: 'value'
        }
    }`;
    const parsed = parse(ggonString);
    console.log(JSON.stringify(parsed, null, 2));
}