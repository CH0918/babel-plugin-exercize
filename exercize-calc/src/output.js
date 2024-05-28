// import { addCalc, minusCalc, multCalc, diviCalc } from "@/util/calc.js";
const { addCalc, minusCalc, multCalc, diviCalc } = require('./util/calc');
const add = addCalc(addCalc(0.1, 0.2), 0.3);
const sub = minusCalc(0.2, 0.1);
const mul = multCalc(multCalc(0.1, 0.1), 0.1);
const div = diviCalc(0.1, 0.2);
console.log({
  add,
  sub,
  mul,
  div,
});
