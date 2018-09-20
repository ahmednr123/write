$('#logo').addEventListener('click', function(){
	window.location.href = '/';
});

_global.textareaChars = [];
let prev = $('#blogContent').scrollHeight;

setInterval(function(){

	$('#blogContent').style.height = $('#blogContent').scrollHeight

	if(($('#blogContent').scrollHeight - prev) > 0){
		_global.textareaChars.push($('#blogContent').value.length);
	}

	if(parseInt($('#blogContent').style.height) > 78 && $('#blogContent').value.length < _global.textareaChars[_global.textareaChars.length - 1]){
		$('#blogContent').style.height = $('#blogContent').scrollHeight - 39;
	}

}, 500);