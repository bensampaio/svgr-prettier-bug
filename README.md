This repo was created to reproduce an issue when using prettier with svgr to generate icon components.

* Run the command below to generate the icon components
```shell
yarn build
```

* Notice that the lines between imports and the component are removed.

* Add a new line between the imports and the component.

* Run prettier as shown below 

```shell
yarn format
```

* Notice that the empty line wasn't removed.