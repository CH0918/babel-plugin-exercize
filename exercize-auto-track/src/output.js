var _tracker = _interopRequireDefault(require("./tracker")).default;

function _interopRequireDefault(obj) { _tracker(); _tracker(); return obj && obj.__esModule ? obj : { default: obj }; }

// import aa from 'aa';
// import * as bb from 'bb';
// import { cc } from 'cc';
// import 'dd';
// // import tracker from 'tracker';
// import { tracker } from 'tracker';
// function a() {
//   console.log('aaa');
// }
// class B {
//   bb() {
//     return 'bbb';
//   }
// }
// const c = () => 'ccc';
// const d = function () {
//   console.log('ddd');
// };
// import tt from 'tracker';
// import { tt } from 'tracker';
// import { tracker as tt } from 'tracker';
// import * as tt from 'tracker';
// import 'ttt';
function aa() {
  _tracker();

  console.log('aa');
}

const fn1 = () => {
  _tracker();

  return console.log(11);
};

class User {
  fn1() {
    _tracker();
  }

}

const fn2 = function () {
  _tracker();
};

const fn3 = () => {
  _tracker();
};

(() => {
  _tracker();

  console.log(11);
})();