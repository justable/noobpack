import log from "./log.js";

export default function(a, b) {
  log("executing sub function");
  return Number(a) - Number(b);
}
