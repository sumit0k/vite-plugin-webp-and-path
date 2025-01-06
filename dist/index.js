import chalk from "chalk";
import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
const VitePluginWebpAndPath = (options = {}) => {
    const { targetDir = "./dist/", imgExtensions = "jpeg,jpg,png", textExtensions = "html,css,js", quality = 80, enableLogs = true, } = options;
    const imgExtensionsArray = imgExtensions.split(",");
    const log = (message, type = "info") => {
        if (enableLogs) {
            let output = message;
            switch (type) {
                case "info":
                    output = chalk.blue(message);
                    break;
                case "success":
                    output = chalk.green(message);
                    break;
                case "error":
                    output = chalk.red(message);
                    break;
            }
            console.log(output);
        }
    };
    const filesPath = `${targetDir}/**/*`;
    return {
        name: "vite-plugin-webp-and-path",
        async writeBundle() {
            try {
                // get target files
                const imageFiles = glob.sync(`${filesPath}*.{${imgExtensions}}`);
                const textFiles = glob.sync(`${filesPath}*.{${textExtensions}}`);
                log(`Target images is: ${imageFiles.join(", ")}`, "info");
                // image convert
                for (const file of imageFiles) {
                    const dir = path.dirname(file);
                    await imagemin([file], {
                        destination: dir,
                        plugins: [imageminWebp({ quality })],
                    });
                    log(`Converted: ${file}`, "success");
                }
                log("All images converted to webp!", "success");
                imageFiles.forEach((file) => {
                    fs.unlinkSync(file);
                });
                log("All original images deleted.");
                // path replace
                for (const filePath of textFiles) {
                    const fileContent = fs.readFileSync(filePath, "utf-8");
                    let updatedContent = fileContent;
                    for (const ext of imgExtensionsArray) {
                        const regex = new RegExp(`^(?!.*//).*\\.${ext}`, "g");
                        updatedContent = updatedContent.replace(regex, ".webp");
                    }
                    fs.writeFileSync(filePath, updatedContent);
                    log(`Image paths replaced in ${filePath}`);
                }
                log("All image paths replaced!", "success");
            }
            catch (err) {
                log(`Error: ${err}`, "error");
            }
        },
    };
};
export default VitePluginWebpAndPath;
//# sourceMappingURL=index.js.map