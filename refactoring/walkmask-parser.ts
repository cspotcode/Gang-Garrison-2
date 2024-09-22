class BWImageParser {
    parse(input: string): { width: number; height: number; pixels: boolean[][] } {
        const lines = input.trim().split('\n');
        if (lines.length !== 3) {
            throw new Error('Input should contain exactly 3 lines');
        }

        const width = parseInt(lines[0], 10);
        const height = parseInt(lines[1], 10);

        if (isNaN(width) || isNaN(height)) {
            throw new Error('Invalid width or height');
        }

        const data = lines[2];
        const pixels = this.decodePixels(data, width, height);

        return { width, height, pixels };
    }

    private decodePixels(data: string, width: number, height: number): boolean[][] {
        const pixels: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));
        let pixelIndex = 0;

        for (const char of data) {
            const pixelData = this.decodeChar(char);
            
            for (let i = 0; i < 6 && pixelIndex < width * height; i++) {
                const x = pixelIndex % width;
                const y = Math.floor(pixelIndex / width);
                pixels[y][x] = Boolean(pixelData & (1 << (5 - i)));
                pixelIndex++;
            }
        }

        return pixels;
    }

    private decodeChar(char: string): number {
        const asciiValue = char.charCodeAt(0);
        if (asciiValue < 32 || asciiValue > 95) {
            throw new Error(`Invalid character in data: ${char}`);
        }
        return asciiValue - 32;
    }

    // Utility method to visualize the parsed image
    visualize(pixels: boolean[][]): string {
        return pixels.map(row => row.map(pixel => pixel ? '█' : ' ').join('')).join('\n');
    }
}

interface Result {
    width: number; height: number; pixels: boolean[][];
}

export function parse(input: string): Result {
    const parser = new BWImageParser();
    return parser.parse(input);
}

export function visualize(result: Result) {
    const parser = new BWImageParser();
    return parser.visualize(result.pixels);
}

export function logVisualize(result: Result) {
    console.log(`Width: ${result.width}`);
    console.log(`Height: ${result.height}`);
    console.log('Image:');

    const parser = new BWImageParser();
    console.log(parser.visualize(result.pixels));
}

function example() {
    // Example usage:
    const parser = new BWImageParser();
    const input = `10
    5
    89:;<=`;

    const result = parser.parse(input);
}

example();