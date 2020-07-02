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
          type: "processing_modular_V1.0",
          slot: 1,
          compare: {},
          method: "delay",
          seconds: parseFloat(node.seconds)
        }
        var file = globalContext.get("exportFile")
        var slot = globalContext.get("slot");
        if (currentMode == "test") {
          file.slots[slot].jig_test.push(command)
        }
        else { 
          file.slots[slot].jig_error.push(command)
        }
        globalContext.set("exportFile", file);
        node.status({fill:"green", shape:"dot", text:"done"}); // seta o status pra waiting
        msg.payload = command
        
        node.send(msg);
      });
  }
  RED.nodes.registerType("delay", DelayNode);
}