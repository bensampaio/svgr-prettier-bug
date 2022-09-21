import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import glob from 'glob';
import { transform } from '@svgr/core';
import { camelCase, upperFirst } from 'lodash-es';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const iconFileExt = '.svg';

const iconsPath = path.join(__dirname, 'src', '*.svg');

// the location of the generated Components
const componentsPath = path.join(__dirname, 'dist');

const iconsToProcess = {
  svgPath: iconsPath,
  iconComponentsPath: componentsPath,
};

const tsTemplate = (
  { componentName, imports, interfaces, jsx, props },
  { tpl }
) => tpl`
  import React, { ReactElement, SVGProps } from 'react';
  
  ${interfaces};
  
  export const ${componentName} = (${props}: SVGProps<SVGSVGElement>): ReactElement => (
    ${jsx}
  );
`;

glob(iconsToProcess.svgPath, (err, files) => {
  files
    .filter((fileName) => fileName.endsWith(iconFileExt))
    .forEach((fileName) => {
      // we generate a name for the component based on the file name
      const fileNameWithoutExtension = path.basename(fileName, iconFileExt);
      const componentName = upperFirst(camelCase(fileNameWithoutExtension));

      // read the raw svg code
      const svgCode = fs.readFileSync(fileName, 'UTF-8');

      // generate Ts component using svgr
      // for all the available options check https://react-svgr.com/docs/options
      const tsCode = transform.sync(
        svgCode,
        {
          icon: false,
          typescript: true,
          plugins: [
            '@svgr/plugin-jsx',
          ],
          template: tsTemplate,
        },
        { componentName }
      );

      // create a .tsx file for the component
      fs.writeFileSync(
        path.join(iconsToProcess.iconComponentsPath, `${componentName}.tsx`),
        tsCode
      );
    });
});
