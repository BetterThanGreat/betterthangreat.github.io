var sloganSpan = document.getElementById("slogan").querySelector("span"),
	adjectives = ["Radical", "Unbelievable", "Revolutionary", "Beautiful", "Functional", "Great"],
	adjIndex = 0;

var start = function(){
	window.setTimeout(updateSlogan, 500);
};

var updateSlogan = function(){
	adjIndex++;
	sloganSpan.innerHTML = adjectives[adjIndex];
	
	if (adjIndex == adjectives.length - 1)
	{
		sloganSpan.style.color = "#292929";
		return;
	}

	window.setTimeout(updateSlogan, 500);
};
