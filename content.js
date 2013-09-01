

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    /*console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
	*/
	
	var rs = $(request.pattern);
	//console.log(request.pattern);
	//console.log(rs);
    if (rs.length == 1)
	{
	  //console.log(rs[0].src);
      sendResponse({match: "yes", image: rs[0].src});
	}
	else
	  sendResponse({match: "no", image: null});
  });

  
  window.onload=function()
	{
		chrome.storage.sync.get("WebcomicUpdate", function(items) {
			
			if(typeof items === 'undefined' || typeof items["WebcomicUpdate"] === 'undefined')
			{
				localdata = {};
			}
			else
				localdata = items["WebcomicUpdate"];
			//console.log("data loaded: ");
			//console.log(localdata);
			
			if(localdata.hasOwnProperty(document.URL))
			{
				var props = localdata[document.URL];
				var rs = $(props.pattern);
				props.src = rs[0].src;
				localdata[document.URL] = props;
				chrome.storage.sync.set({'WebcomicUpdate': localdata});
			}
		});
	}
  
  