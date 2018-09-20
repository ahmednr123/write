let date = new Date();
let str = date

let result = '';

for(let i in str){
	if(str[i]=='T'){
		break;
	}

	result += str[i];
}

console.log(result);