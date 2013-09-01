

function makeSafeForCSS(name) {
    return name.replace(/[^a-z0-9]/g, function(s) {
        var c = s.charCodeAt(0);
        if (c == 32) return '-';
        if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
        return 'wu_' + ('000' + c.toString(16)).slice(-4);
    });
}



checkUpdate=function(url,pat,src,name)
{
	var id = makeSafeForCSS(name);
	$.get(url,function(data) 
		{
			try
			{
				var comic = $(pat,$(data))[0];
			}
			catch(err) { /* Do Nothing */ }
			if(src != comic.src)
			{
				//it has been updated!
				try
				{
					var icon = $(data).filter('link[rel="shortcut icon"], link[rel="SHORTCUT ICON"]').attr('href');
					if(icon.indexOf("http") === -1)
					{
						icon = url.substring(0, url.lastIndexOf("/")) + '/' + icon;
					}
				}
				catch(err) 
				{
					var icon = "";
				}
				//add item to list
				var ul = $('#updateList')[0];
				item = '<div class="updateListItem" id="'+id+'"><img src="'+icon+'" />&nbsp;&nbsp;&nbsp;'+name+'</div>';
				
				ul.innerHTML += item;
				ul.style.display='none';
				ul.style.display='block';
				//attach listener to item
				$('#'+id)[0].addEventListener("click", 
				function(e)
				{
					chrome.tabs.create({'url': url});
					$("#"+id)[0].style.display = 'none';
				}
				, false);
				
			}
		});
}


testPattern=function(pat)
{
		
		return chrome.tabs.sendMessage(thistab.id, {pattern: pat}, function(response) 
		{
			if(counted == -1)
				return;
			//console.log(response);
			//var mf = $('#myframe')[0];
			//mf.innerHTML = response;
			counted++;
			
			if(response.match == "yes")
			{
				counted = -1;
				//var mf = $('#myframe')[0];
				//mf.innerHTML = "Match Found: <br/> <img src='"+response.image+"' width='90px;'>";
				var nm = $('#name')[0];
				match = {'name': nm.value, 'url': thistab.url, 'pattern': pat, 'src': response.image};
				console.log(match);
				if(!localdata.hasOwnProperty(match.url))
				{
					localdata[match.url] = match;
					//chrome.storage.sync.remove('WebcomicUpdate');
					console.log(localdata);
					chrome.storage.sync.set({'WebcomicUpdate': localdata});
				}
				var at = $('#addthis')[0];
				at.style.display = "none";
				
			}
			else if(counted == comicSelectorPatterns.length)
			{
				//var mf = $('#myframe')[0];
				//mf.innerHTML = "No Match";
			}
		});

		
		//return chrome.tabs.sendMessage(tab.id,{pattern: pat});
}

	window.onload=function()
	{
		var ml = $('#mylink')[0];
		ml.addEventListener("click", checkForComic, false); 
		chrome.storage.sync.get("WebcomicUpdate", function(items) {
			
			if(typeof items === 'undefined' || typeof items["WebcomicUpdate"] === 'undefined')
			{
				localdata = {};
			}
			else
			{
				localdata = items["WebcomicUpdate"];
						for (var key in localdata)
						{
							var cmc = localdata[key];
							checkUpdate(cmc.url,cmc.pattern,cmc.src,cmc.name);
						}
			}
			console.log("data loaded: ");
			console.log(localdata);
			
		});
		chrome.tabs.getSelected(null, function(tab) 
		{
			thistab = tab;
		});
		
	}
	
	checkForComic=function()
	{
		var mf = $('#myframe')[0];
		mf.innerHTML = "Checking...";
		for (var i=0;i<comicSelectorPatterns.length;i++)
		{ 
			//console.log(comicSelectorPatterns[i]);
			testPattern(comicSelectorPatterns[i]);
		}
		
		//console.log(testPattern("hello"));
	};

	
//CSS Patterns used for jQuery select to pick the comic out of HTML
counted = 0;
comicSelectorPatterns=[
"img.comic",
"img.Comic",
"img#comic",
"img#Comic",
".comic img",
".Comic img",
"#comic img",
"#Comic img",
"img[class*=comic]",
"img[class*=Comic]",
"img[id*=comic]",
"img[id*=Comic]",
"div[class*=comic] img",
"div[class*=Comic] img",
"div[id*=comic] img",
"div[id*=Comic] img"
];
	
	
	
  /*
  $.get({
  url: "test.html",
  success: function(data){

 var htmlraw = data;
 //alert(htmlraw)  /// should print the raw test.html
 $("#someDiv").html(htmlraw);
  }
});



$(window).load(function(){
    $('.project').each(function(){
        var maxWidth = 0;
        $(this).find('.content img').each(function(){
            var w = $(this).width();
            if (w > maxWidth) { 
              maxWidth = w;
            }
        });
        if (maxWidth) {
          $(this).css({width:maxWidth});
        }
    });       
});
  */
  
  
  
  