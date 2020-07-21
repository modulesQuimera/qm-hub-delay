module.exports = function(RED) {
  function DelayNode(config) {
      RED.nodes.createNode(this,config);
      this.seconds = config.seconds;
      var node = this;
      
      node.on('input', function(msg) {
        var globalContext = node.context().global;
        // var exportMode = globalContext.get("exportMode");
        var currentMode = globalContext.get("currentMode");
        var command =  {
          type: "processing_modular_V1_0",
          slot: 1,
          compare: {},
          method: "delay",
          seconds: parseFloat(node.seconds),
          get_output: {},
        }
        var file = globalContext.get("exportFile")
        var slot = globalContext.get("slot");
        if(!(slot === "begin" || slot === "end")){
          if(currentMode == "test"){
              file.slots[slot].jig_test.push(command);
          }
          else{
              file.slots[slot].jig_error.push(command);
          }
        }
        else{
          if(slot === "begin"){
            file.slots[0].jig_test.push(command);
              // file.begin.push(command);
          }
          else{
            file.slots[3].jig_test.push(command);
              // file.end.push(command);
          }
        }
        globalContext.set("exportFile", file);
        node.status({fill:"green", shape:"dot", text:"done"}); // seta o status pra waiting
        // msg.payload = command
        console.log(command)

        
        node.send(msg);
      });
  }
  RED.nodes.registerType("processing-delay", DelayNode);
}