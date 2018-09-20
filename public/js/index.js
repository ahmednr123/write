_global.tagBlogs = {};

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

$('#add_').addEventListener('click', function(){
	if(_global.user){
		window.location.href = '/edit';
	} else {
		popupEvent('register');
	}
});

$forEach('.tab', function(e){
	e.addEventListener('click', function(){
		$forEach('.tab', function(es){
			es.classList.remove("selected");
		});
		tagBlogs(e.id);
		e.classList.add("selected");
		if(e.id == 'all'){
			tagBlogs('!!');
		} else {
			tagBlogs(e.id);
		}
	});
});

function tagBlogs(tagName){
	var html = '';

	if(tagName[0] == '#'){
		tagName = '!'+tagName.slice(1,tagName.length);
	}

	if(!_global.tagBlogs[(tagName=='!!')?'all':tagName]){
		xhrRequest('/tag/'+tagName, function(arr){
			console.log('ASKING THE SERVER!');
			arr = JSON.parse(arr);
			
			for(let i in arr){
				let json = arr[i];
				html += '<div class="article"><a class="articlem" href="/blog?id='+json.id+'"><div class="articleH">'+json.heading+'</div><div class="articleC">'+makeStr(json.content)+'</div></a><div class="articleT_" style="display:flex;justify-content:space-between"> <a id="author" style="color:white" href="/profile?u='+json.username+'">'+json.full_name+'</a><div class="articleT">'+json.blog_date+'</div></div></div>'
			}

			_global.tagBlogs[(tagName=='!!')?'all':tagName] = html;
			$('#articles').innerHTML = html;
		})
	} else {
		console.log('LOCALLY')
		$('#articles').innerHTML = _global.tagBlogs[(tagName=='!!')?'all':tagName];
	}

}

function makeStr(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}