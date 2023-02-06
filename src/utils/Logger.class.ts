export class Logger {
  static log(...data: any[]) {
    console.group('🔥🤖 Scrapping... 🤖🔥');
    console.log(...data);
    console.groupEnd();
  }
}
