import esbuild from 'esbuild';
import { visualizer } from 'esbuild-plugin-visualizer';
import fs from 'fs';

const packages = [
  { entry: '../packages/core', outfile: '../packages/core/dist/esm' },
  // { entry: "src/package2/index.ts", outfile: "dist/package2.js" },
  // { entry: "src/package3/index.ts", outfile: "dist/package3.js" },
];

const buildPromises = packages.map((pkg) =>
  esbuild.build({
    entryPoints: [pkg.entry],
    bundle: true,
    outfile: pkg.outfile,
    metafile: true, // 生成元数据
  })
);

Promise.all(buildPromises)
  .then((results) => {
    // 合并所有元数据
    const mergedMetafile = {
      inputs: {},
      outputs: {},
    };

    results.forEach((result) => {
      Object.assign(mergedMetafile.inputs, result.metafile.inputs);
      Object.assign(mergedMetafile.outputs, result.metafile.outputs);
    });

    // 保存合并后的元数据
    fs.writeFileSync('meta.json', JSON.stringify(mergedMetafile));

    // 生成可视化报告
    esbuild
      .build({
        entryPoints: [], // 不需要实际打包
        write: false,
        plugins: [
          visualizer({
            filename: 'stats.html',
            metadata: mergedMetafile, // 使用合并后的元数据
          }),
        ],
      })
      .then(() => {
        console.log('打包完成！请查看 stats.html 文件。');
      });
  })
  .catch(() => process.exit(1));
