import sub from "./sub.js";

const button = document.getElementsByTagName("button")[0];
const inputs = document.getElementsByTagName("input");
const result = document.getElementsByTagName("span")[0];
button.onclick = function() {
  result.textContent = sub(inputs[0].value, inputs[1].value);
};
