export function titleCaseTurkish(input: string): string {
  if (input.length === 0) {
    return input;
  }

  const result: string[] = [];
  let atWordStart = true;

  for (const char of input) {
    if (isWordSeparator(char)) {
      result.push(char);
      atWordStart = true;
      continue;
    }

    if (atWordStart) {
      result.push(char.toLocaleUpperCase("tr-TR"));
      atWordStart = false;
    } else {
      result.push(char.toLocaleLowerCase("tr-TR"));
    }
  }

  return result.join("");
}

function isWordSeparator(char: string): boolean {
  if (/\s/.test(char)) {
    return true;
  }
  if (char === "-" || char === "/") {
    return true;
  }
  return false;
}
