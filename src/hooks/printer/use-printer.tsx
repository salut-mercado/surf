const cut = async () => {
  return await fetch("http://localhost:8001/cut", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
const print = async (instructions: string) => {
  return await fetch("http://localhost:8001/print", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ instructions }),
  });
};
const cashdraw = async () => {
  return await fetch("http://localhost:8001/cashdraw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Not a hook, just a utility function to control the printer.
 */
export const usePrinter = (): {
  cut: () => Promise<unknown>;
  print: (instructions: string) => Promise<unknown>;
  cashdraw: () => Promise<unknown>;
} => {
  return { cut, print, cashdraw } as const;
};
