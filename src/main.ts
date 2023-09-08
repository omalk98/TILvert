import { processArguments } from "./utils";
import { getHelp, getVersion } from "./helpers";

function main() {
  const [argMap, input] = processArguments();

  if (argMap.get("isHelp")) {
    getHelp();
    process.exit(0);
  }
  if (argMap.get("isVersion")) {
    getVersion();
    process.exit(0);
  }

  console.log(argMap);
}

main();
