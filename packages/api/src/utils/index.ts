export function isDevelopment() {
  return process.env.APP_ENV === "development";
}

export function filterNumber(value?: number | string) {
  return value ? Number(value) : undefined;
}

export function partition<T>(
  array: T[],
  callback: (element: T, index: number, array: T[]) => boolean
) {
  return array.reduce(
    function (result, element, i) {
      callback(element, i, array)
        ? result[0].push(element)
        : result[1].push(element);

      return result;
    },
    [[], []]
  );
}
