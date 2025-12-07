import { Receipt } from "~/lib/receipt";
import { useGlobalStore } from "~/store/global.store";

export interface IReceipt<T> {
  (data: T, options?: IReceiptOptions): Promise<string>;
}

export interface IReceiptOptions {
  printer?:
    | "escpos"
    | "epson"
    | "sii"
    | "citizen"
    | "fit"
    | "impact"
    | "impactb"
    | "generic"
    | "star"
    | "starline"
    | "emustarline"
    | "stargraphic"
    | "starimpact"
    | "starimpact2"
    | "starimpact3"; // -p
  charactersPerLine?: number; // -c 24-96 default: 48
  language?:
    | "en"
    | "fr"
    | "de"
    | "es"
    | "po"
    | "it"
    | "ru"
    | "ja"
    | "ko"
    | "zh-hans"
    | "zh-hant"
    | "th"; // -l
  reduceLineSpacing?: boolean; // -s
  printMargins?: [left: number, right: number]; // -m 0-24,0-24 default: 0,0
  upsideDown?: boolean; // -u
  printAsImage?: boolean; // -i
  withPaperCut?: boolean; // !-n
  imageThresholding?: number; // -b 0-255
  imageGammaCorrection?: number; // -g 0.1-10.0 default: 1.0
  landscape?: boolean; // -v
  printResolution?: number; // -r 180, 203 default: 203
}

export function createReceipt<T>(fn: IReceipt<T>): IReceipt<T> {
  return async (data: T, options: IReceiptOptions = {}) => {
    const printWidth = useGlobalStore.getState().receiptWidth;
    const receipt = await fn(data);
    console.log({ printWidth, charactersPerLine: printWidth === 80 ? 48 : 32 });
    const example = Receipt.from(
      receipt,
      constructOptions({
        ...options,
        charactersPerLine: printWidth === 80 ? 48 : 32,
      })
    );
    const instructions: string = await example.toCommand();
    return instructions
      .split("")
      .map((c) => `0${c.charCodeAt(0).toString(16)}`.slice(-2))
      .join(" ");
  };
}

function constructOptions(options: IReceiptOptions) {
  const opts: string[] = [];
  if (options.charactersPerLine) {
    if (options.charactersPerLine < 24 || options.charactersPerLine > 96) {
      throw new Error("Characters per line must be between 24 and 96");
    }
    opts.push(`-c ${parseInt("" + options.charactersPerLine)}`);
  } else {
    opts.push(`-c 48`);
  }
  if (options.language) {
    opts.push(`-l ${options.language}`);
  }
  if (options.printer) {
    opts.push(`-p ${options.printer}`);
  } else {
    opts.push(`-p escpos`);
  }
  if (options.reduceLineSpacing) {
    opts.push(`-s`);
  }
  if (options.printMargins) {
    const [left, right] = options.printMargins;
    if (left < 0 || left > 24) {
      throw new Error("Left margin must be between 0 and 24");
    }
    if (right < 0 || right > 24) {
      throw new Error("Right margin must be between 0 and 24");
    }
    opts.push(`-m ${parseInt("" + left)},${parseInt("" + right)}`);
  }

  if (options.upsideDown) {
    opts.push(`-u`);
  }
  if (options.printAsImage) {
    opts.push(`-i`);
  }
  if (options.withPaperCut !== true) {
    opts.push(`-n`);
  }
  if (options.imageThresholding) {
    if (options.imageThresholding < 0 || options.imageThresholding > 255) {
      throw new Error("Image thresholding must be between 0 and 255");
    }
    opts.push(`-b ${options.imageThresholding}`);
  }
  if (options.imageGammaCorrection) {
    if (
      options.imageGammaCorrection < 0.1 ||
      options.imageGammaCorrection > 10.0
    ) {
      throw new Error("Image gamma correction must be between 0.1 and 10.0");
    }
    opts.push(`-g ${options.imageGammaCorrection}`);
  }
  if (options.landscape) {
    opts.push(`-v`);
  }
  if (options.printResolution) {
    if (options.printResolution !== 180 && options.printResolution !== 203) {
      throw new Error("Print resolution must be 180 or 203");
    }
    opts.push(`-r ${options.printResolution}`);
  }

  return opts.join(" ");
}
