// ESM bundles can be loaded in browsers: https://caniuse.com/es6-module
module.exports = {
  "presets": [
      [
         "@babel/preset-env",
         {
             "loose": true, // ES6 to ES5
             "bugfixes": true,
             //"useBuiltIns": "usage",
             "modules": false,
             "exclude": ["transform-typeof-symbol"],
             "targets": {
                 "browsers": [
                     "chrome  >= 61", "Firefox >= 60", "edge >= 16", "iOS >= 10.3","Safari >= 10.1","Android >= 93","Opera >= 48"]
             },
             "debug": true
         }
     ]
 ]
}


// {
//   "plugins": [ "@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-object-rest-spread" ],
//   "presets": [
//     "@babel/preset-typescript", // this or plugin  @babel/plugin-transform-typescript
//     [
//       "@babel/env",
//       {
//         "useBuiltIns": "usage",
//         "modules": false, // required for typescript?
//         "targets": {
//           "browsers": [
//             "last 2 chrome versions",
//             "ie 11",
//             "safari 11",
//             "edge 15",
//             "firefox 59"
//             //  bootsrap set:
//             //  "chrome  >= 45",
//             //  "Firefox >= 38",
//             //  "Explorer >= 10",
//             //  "edge >= 12",
//             //  "iOS >= 9",
//             //  "Safari >= 9",
//             //  "Android >= 4.4",
//             //  "Opera >= 30"
//           ]
//         },
//         "debug": true
//       }
//     ]
//   ]
// }