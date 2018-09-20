
setTimeout(function(){
	xhrPost('/blog/'+blogId+'/view');
	//console.log("VIEWED!");
}, 5000);

$('#logo').addEventListener('click', function(){
	window.location.href = '/';
});

$('#likeBtn').addEventListener('click', function(){
	$('#like').innerHTML = parseInt($('#like').innerHTML) + 1;
	xhrPost('/blog/'+blogId+'/like');
});

$('#dislikeBtn').addEventListener('click', function(){
	$('#dislike').innerHTML = parseInt($('#dislike').innerHTML) + 1;
	xhrPost('/blog/'+blogId+'/dislike');
});

$forEach('.address', function(e){
	e.value = window.location.pathname + '?id=' + blogId;
});

$forEach('.reply', function(e){
	e.addEventListener('click', function(){
		let cmnt = $('#commentbox').value;
		console.log(cmnt.indexOf('@'+e.getAttribute('name')) == -1)
		if(cmnt.indexOf('@'+e.getAttribute('name')) == -1)
			$('#commentbox').value += '@'+e.getAttribute('name')+' ';
	});
});

setInterval(function(){
	$forEach('.commentT', function(e){
		e.value = $('#commentbox').value;
	});
}, 500);

setInterval(function(){
	$('#commentbox').style.height = $('#commentbox').scrollHeight
}, 500);