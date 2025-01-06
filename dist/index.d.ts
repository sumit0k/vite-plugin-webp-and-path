interface Options {
    targetDir?: string;
    imgExtensions?: string;
    textExtensions?: string;
    quality?: number;
    enableLogs?: boolean;
}
declare const VitePluginWebpAndPath: (options?: Options) => {
    name: string;
    writeBundle(): Promise<void>;
};
export default VitePluginWebpAndPath;
