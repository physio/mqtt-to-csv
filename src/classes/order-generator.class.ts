export class OrderGenerator {

    generate(str: string): string[] {
        const words = str.split('%');
        const result = [];
        words.forEach(element => {
            result.push(element.replace(/'/, '-'));
        });

        return result;
    }
}