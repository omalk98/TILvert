export default function getVersion(): void {
  let version = `${process.env.npm_package_name} ${process.env.npm_package_version}\n`;

  version += `${"License:".padEnd(18)}${process.env.npm_package_license}\n`;
  version += `${"Written by:".padEnd(18)}${
    process.env.npm_package_author_name
  }\n`;

  console.log(version);
}
