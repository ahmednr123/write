//var _global = {};

//SELECTORS======================================//

var $ = function(_element, _index){
	if(_element[0]=='#')
		return document.getElementById(_element.slice(1));
	else if(_element[0]=='.'){
		let index = _index | 0;
		return document.getElementsByClassName(_element.slice(1))[index];
	}
}

var $forEach = function(_element, _func){
	Array.prototype.forEach.call(document.querySelectorAll(_element), _func);
}

//FUNCTIONS======================================//

var xhrPost = function(_url, _onReady, _data){
	var xhrpost = new XMLHttpRequest();
	xhrpost.onreadystatechange = function(){
		/*if(xhrpost.readyState == 4 && xhrpost.status == 200){
			_onReady(xhrpost.responseText, xhrpost);
		}*/
		if(xhrpost.readyState == 0 && xhrpost.status == 0){
			_onReady(xhrpost.responseText, xhrpost);
		}
	}
	xhrpost.open("POST", _url, true);
	xhrpost.setRequestHeader("Content-Type", "application/json");
	xhrpost.send(_data);
};

var xhrRequest = function(_url, _onReady,_xhr){
	var xhr = _xhr || new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			_onReady(xhr.responseText, _xhr);
		}
	}
	xhr.open("GET", _url, true);
	xhr.send();
}

var getScreen = function(_url){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			return JSON.parse(xhr.responseText);
		}
	}
	xhr.open("GET", _url, true);
	xhr.send();
}

//LOGIN / REGISTER ===================================//

$forEach('.address', function(e){
	e.value = window.location.pathname;
});

$('#add_').addEventListener('click', function(){
	if(_global.user){
		window.location.href = '/edit';
	} else {
		popupEvent('register');
	}
});

$('#logo').addEventListener('click', function(){
	window.location.href = '/';
});

var popupEvent = function(section){

	$('#transparent_screen').style.display = 'block';

	if(section == 'register'){
		$('#popup_').classList.add('register_section');
		$('.login_form').style.display = 'none'
		$('.register_form').style.display = 'block'
		$('#popup_').classList.remove('login_section');
		$('#login_section').classList.remove('selected');
		$('#register_section').classList.add('selected');
	} else {
		$('#popup_').classList.add('login_section');
		$('.register_form').style.display = 'none'
		$('.login_form').style.display = 'block'
		$('#popup_').classList.remove('register_section');
		$('#register_section').classList.remove('selected');
		$('#login_section').classList.add('selected');
	}
	
	
	
	$('#closePopup').addEventListener('click', function(){
		$('#transparent_screen').style.display = 'none';
	})
	$('#register_section').addEventListener('click', function(){
		$('#popup_').classList.remove('login_section');
		$('#popup_').classList.add('register_section');
		$('#register_section').classList.add('selected');
		$('#login_section').classList.remove('selected');
		$('.login_form').style.display = 'none'
		$('.register_form').style.display = 'block'
	})
	$('#login_section').addEventListener('click', function(){
		$('#popup_').classList.remove('register_section');
		$('#popup_').classList.add('login_section');
		$('#register_section').classList.remove('selected');
		$('#login_section').classList.add('selected');
		$('.register_form').style.display = 'none'
		$('.login_form').style.display = 'block'
	})

};

$('#searchIcon_').addEventListener('click',function(){
	if($('#searchBox_top').style.display == 'none'){
		$('#searchBox_top').style.display = 'block'
		$('#searchBox_top').focus()
		$('#searchBox_top').addEventListener('focusout', function(){
			$('#searchBox_top').style.display = 'none'
		})
	} else {
		$('#searchBox_top').style.display = 'none'
	}
});

if($('#login')) $('#login').addEventListener('click', popupEvent);

xhrRequest('/xbar', function(arr){
	arr = JSON.parse(arr);
	let html = '';

	for(let i in arr){
		html += '<a class="link" href="/blog?id='+arr[i].id+'">'+arr[i].heading+'</a>'
	}

	$('#links').innerHTML = html;
});