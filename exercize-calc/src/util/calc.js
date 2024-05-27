function addCalc(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return a + b;
  }
  let max = calcMax(a, b);
  return (a * max + b * max) / max;
}
function minusCalc(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return a - b;
  }
  let max = calcMax(a, b);
  return (a * max - b * max) / max;
}

function multCalc(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return a * b;
  }
  let max = calcMax(a, b);
  return (a * max * (b * max)) / max;
}

function diviCalc(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return a / b;
  }
  let max = calcMax(a, b);
  return (a * max) / (b * max) / max;
}

function calcDecimalLength(decimal) {
  var splitArray = decimal.toString().split('.');
  if (splitArray.length === 1) {
    return 0;
  }
  return splitArray[1].length;
}

function calcMax(a, b) {
  let aLength = calcDecimalLength(a);
  let bLength = calcDecimalLength(b);
  let max = Math.pow(10, Math.max(aLength, bLength));
  return max;
}

export { addCalc, minusCalc, multCalc, diviCalc };
