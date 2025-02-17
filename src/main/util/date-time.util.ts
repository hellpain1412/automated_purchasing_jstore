export class DateTimeUtil {
  static delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async delayRange(min: number, max: number) {
    min = Number(min);
    max = Number(max);
    const a = Math.floor(min + Math.random() * (max - min));
    await this.delay(a);
  }
}
