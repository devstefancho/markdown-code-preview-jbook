import * as esbuild from 'esbuild-wasm';
 
export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // try to figure out where the index.js file is stored
      build.onResolve({ filter: /^index\.js$/ }, (args: any) => {
        return { path: args.path, namespace: "a" };
      });

      build.onResolve({ filter: /\.+\// }, (args: any) => {
        return {
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
          namespace: "a",
        };
      });

      build.onResolve({ filter: /.*/ }, (args: any) => {
        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: "a",
        };
      });
    },
  };
};
