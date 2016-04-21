// ExtensionMaker
// (c) JoshyRobot 2016

function ExtensionMaker(info) {
	// Save extension name
	this.name = info.name;
	
	// Make extension descriptor
	this.descriptor = {
		blocks: [],
		menus: {}
	};
	
	// Save url if defined
	if ('url' in info) {
		this.descriptor.url = info.url;
	}
	
	// Storage for functions
	this.functions = {
		_shutdown: function() {},
		_getStatus: function() {
			return {status: 2, msg: 'Ready'};
		}
	};
	
	// Set fuctions
	this.setFunction = function(info) {
		var func = info.func;
		this.functions[info.name] = func;
	};
	
	// Add block
	this.addBlock = function(info) {
		// Save function
		this.setFunction(info);
		
		// Save block descriptor
		blockDesc = [
			info.type,
			info.block,
			info.name
		];
		
		// Add default values if set
		if (typeof info.values === 'object') {
			blockDesc = blockDesc.concat(info.values);
		} else if (typeof info.values === 'string') {
			blockDesc.push(info.values);
		}
		
		// Set block descriptor
		this.descriptor.blocks.push(blockDesc);
	};
	
	// Register extension
	this.register = function() {
		ScratchExtensions.register(this.name, this.descriptor, this.functions);
	};
	
	// Unregister the extension
	this.unregister = function() {
		ScratchExtensions.unregister(this.name);
	};
}