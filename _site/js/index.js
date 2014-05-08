var sloganSpan = document.getElementById("slogan").querySelector("span"),
	adjectives = ["Radical", "Unbelievable", "Revolutionary", "Beautiful", "Functional", "Great", ""],
	adjIndex = 0;

var start = function(){
	window.setTimeout(updateSlogan, 500);

	startSpace();
};

var updateSlogan = function(){
	adjIndex++;
	sloganSpan.innerHTML = adjectives[adjIndex];
	
	if (adjIndex == adjectives.length - 1)
	{
		var hideCall = document.getElementById("hide-call"),
			className = "show";
			
		if (hideCall.classList)
			hideCall.classList.add(className);
		else
			hideCall.className += ' ' + className;

		sloganSpan.style.color = "#292929";
		return;
	}

	window.setTimeout(updateSlogan, 500);
};
