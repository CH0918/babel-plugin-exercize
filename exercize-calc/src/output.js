import { addCalc, minusCalc, multCalc, diviCalc } from "@/util/calc.js";
const add = addCalc(addCalc(0.1, 0.2), 0.3);
const sub = minusCalc(0.2, 0.1);
const mul = multCalc(0.1, 0.2);
const div = diviCalc(0.1, 0.2);