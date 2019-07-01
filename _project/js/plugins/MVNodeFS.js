//=============================================================================
//  RMMVNodeP1.js
//=============================================================================

/*:
* @author PluginDev
* @plugindesc A plugin to read and write files using Node.js
*
*/
(function () {

  //Setup function in case we want to split up our code further  
  function setup() {
//=============================================================================
//  MVNodeFS
//=============================================================================    
    function MVNodeFS() {

    }

    MVNodeFS.fs = require("fs");

    //Wrapper for Node.js writeFileSync
    MVNodeFS.writeFile = function (filePath, filename, data) {
      filePath = this.createPath("/" + filePath +"/");
      this.fs.writeFileSync(filePath + filename, data);
      console.log("Wrote File: " + filename);
    };

    //Wrapper for Node.js readFileSync
    MVNodeFS.readFile = function (filePath, filename) {
      filePath = this.createPath("/" + filePath + "/");
      console.log("Read File:", filename);
      //Returning the file we read using utf8 encoding; this means it will be in text
      return this.fs.readFileSync(filePath + filename, "utf8");
    };

    //Method for creating the proper file path from the relative file path
    MVNodeFS.createPath = function (relativePath) {
      //Checks if MV is in dev mode, or production, then decides the appropriate path
      relativePath = (Utils.isNwjs() && Utils.isOptionValid("test")) ? relativePath : "/www/" + relativePath;
      //Creates the path using the location pathname of the window and replacing certain characters
      var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, relativePath);
      if(path.match(/^\/([A-Z]\:)/)) {
        path = path.slice(1);
      }
      //Decode URI component and finally return the path
      path = decodeURIComponent(path);
      return path;
    };
    
    //Export Our Class so it can be used anywhere
    window.MVNodeFS = MVNodeFS;
  }

  //Execute setup function to run our code after setup
  setup();
})();