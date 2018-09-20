var fs = require('fs');
var parse = require('xml-parser');
var xml = "<html><head>HELLO</head><Body>BELLO</Body></html>";//fs.readFileSync('examples/developerforce.xml', 'utf8');
var inspect = require('util').inspect;
var arr = [];

var obj = parse(xml);
arr.push(obj.root)

let a = conv(arr)

console.log(inspect(a, { colors: true, depth: Infinity }));
//console.log(typeof(json))

function conv(root){
	let arr = [];
	for(let i in root){
		let name, attributes;
		let body = [];
		let json = {};

		for(let x in root[i]){
			if(x == 'name'){
				name = root[i][x]
			} else if(x == 'attributes'){
				attributes = root[i][x]
			} else if(x == 'children'){
				body = conv(root[i][x])
			} else if(x == 'content'){
				if(root[i][x] != ''){
					body = root[i][x]
				}
			}
		}

		json[name] = attributes;
		json['body'] = body;

		arr.push(json)
	}
	return arr
}