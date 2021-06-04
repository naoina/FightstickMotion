var currentversion = "210124";

function onLoadLayout(data)
{
	var layout = new copyLayout(data);
	if(layout === null)
		return;
	customlayout = layout;

	resetgamepad();

	document.getElementById("inputhistorytoggle").checked = customlayout.inputhistorymode.toggle;
	document.getElementById(
		(customlayout.inputhistorymode.direction === 1) ? "inputhistoryhorizontal" :
			((customlayout.inputhistorymode.direction === 2) ? "inputhistoryhorizontalup" : "inputhistoryvertical")).checked = true;
	document.getElementById("inputhistorycount").value = customlayout.inputhistorymode.count;
	document.getElementById("inputhistorygame").value = customlayout.inputhistorymode.game || "default";
	document.getElementById("inputhistorytoggle").onchange();

	e = document.getElementById("customlayoutfilename");
	e.value = customlayout.name;
	e.onchange();

	e = document.getElementById("custombackgroundshow");
	e.checked = !customlayout.background || customlayout.background.show;
	getBackgroundValue();
	e.onchange();

	e = document.getElementById("customshowstick");
	e.checked = customlayout.showstick;
	e.onchange();

	e = document.getElementById("customtotalbuttons");
	e.value = customlayout.totalbuttonshow;
	e.onchange();

	e = document.getElementById("custombuttondefault");
	e.checked = true;
	e.onchange();

	var e = document.getElementById("customlayouttoggle");
	e.checked = true;
	e.onchange();
}

function loadJSON(filename)
{
	var json = document.head.getElementsByClassName("json")[0];
	if(json != undefined)
		document.head.removeChild(json);

	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = filename;
	script.className = "json";
	script.async = false;
	document.head.appendChild(script);
}

function loadLayout(file)
{
	var reader = new FileReader();

	reader.onload = function(e) {
		var text = e.target.result;
//		onLoadLayout(JSON.parse(text));

		var json = document.head.getElementsByClassName("json")[0];
		if(json != undefined)
			document.head.removeChild(json);

		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.innerText = text;
		script.className = "json";
		script.async = false;
		document.head.appendChild(script);
	}

	reader.readAsText(file);
}

function saveLayout(filename)
{
	var remark =
		"/*------------------------------------*\\\r\n" +
		"|   Fightstick Motion Custom Layout   |\r\n" +
		"\\*------------------------------------*/\r\n\r\n";

	saveToFile(filename, remark + "onLoadLayout(" + JSON.stringify(customlayout) + ");" );
}

function saveSetting(filename)
{
	var link = document.getElementById("savelinktext").value;
	saveToFile(filename, "<html><head><meta http-equiv=\"refresh\" content=\"0; URL='" + link + "'\" /></head></html>");
}

function loadCustomCSS(href, callback)
{
	link = document.createElement( "link" );
	link.rel = "stylesheet";
	link.type = "text/css";
	link.href = decodeURI(href);
	link.onload = callback;
	document.getElementsByTagName( "head" )[0].appendChild( link );
}

function getCustomCSSValue(cssval, name)
{
	if(cssval !== undefined)
	{
		var cname = name + "=";
		var ca = cssval.split(";");
		for(var i = 0; i < ca.length; i++)
		{
			var c = ca[i];
			while (c.charAt(0) == " ")
				c = c.substring(1);
			if (c.indexOf(cname) == 0)
			{
				return c.substring(cname.length, c.length);
			}
		}
	}
    return "";
}

function saveToFile(filename, data)
{
	if(window.navigator.msSaveOrOpenBlob)
		window.navigator.msSaveOrOpenBlob(new Blob([data]), filename);
	else
	{
		var link = document.createElement("a");
//		link.href = 'data:text/plain;charset=utf-16,' + encodeURIComponent(data);
		link.href = window.URL.createObjectURL(new Blob([data], {type: 'text/css'}));
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
}

function getChildByClass(el, className)
{
	for(var i = 0, il = el.childNodes.length; i < il; i++)
	{
		var classes = el.childNodes[i].className !== undefined? el.childNodes[i].className.split(" ") : [];
		for(var j = 0, jl = classes.length; j < jl; j++)
		{
			if (classes[j] == className)
				notes = el.childNodes[i];
		}
	}
	return notes;
}

function getChildById(el, id)
{
	for(var i = 0, il = el.childNodes.length; i < il; i++)
	{
		var classes = el.childNodes[i].id !== undefined? el.childNodes[i].id.split(" ") : [];
		for(var j = 0, jl = classes.length; j < jl; j++)
		{
			if (classes[j] == id)
				notes = el.childNodes[i];
		}
	}

	if(notes == el)
		console.log(el);

	return notes;
}

function getParameterByName(name)
{
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
	var results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1]/*.replace(/\+/g, " ")*/);
}

function copyLink(id)
{
	document.getElementById(id).select();
	var successful = document.execCommand("copy");
}

function getGamepads()
{
	return navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
}

function getGamepad(index)
{
	var gamepad;
	var gamepads = getGamepads();
	if(gamepads !== undefined && gamepads !== null)
	{
		gamepad = gamepads[index];
	}

	return gamepad;
}

function getActiveGamepad()
{
	if(activegamepad === -1)
	{
		var gamepads = getGamepads();
		var len = gamepads.length;
		for(var i = 0; i < len; ++i)
		{
			var gamepad = gamepads[i];
			if(gamepad !== undefined && gamepad !== null)
			{
				var buttons = gamepad.buttons;
				var btnlen = buttons.length;
				for(var j = 0; j < btnlen; ++j)
				{
					if(buttons[j].pressed)
					{
						var axeslen = gamepad.axes.length;
						gamepadaxescenter = [];
						for(var j = 0; j < axeslen; ++j)
							gamepadaxescenter[j] = gamepad.axes[j];

						return gamepad.index;
					}
				}
			}
		}
	}

	return -1;
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback, element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function setClassName(e, t)
{
	if(e !== undefined && e !== null)
		e.className = t;
}

function addClassName(e, t)
{
	if(e !== undefined && e !== null)
		if(e.className.search(RegExp("\\b" + t + "\\b")) === -1)
			e.className += (e.className != "") ? " " + t : t;
}

function removeClassName(e, t)
{
	if(e !== undefined && e != null)
		e.className = e.className.replace(RegExp("(^|\\s)" + t + "(\\s|$)"), " ").trim();
}

function replaceClassName(e, o, n)
{
	var regex = new RegExp("\\b" + o + "\\b");

	if(regex.test(e.className))
		e.className = e.className.replace(regex, n);
	else
		addClassName(e, n);
}

function setClassNameById(id, t)
{
	var e = document.getElementById(id);
	if(e !== undefined && e !== null)
		setClassName(e, t);
}

function setElementValueById(id, val)
{
	var e = document.getElementById(id);
	if(e !== undefined && e !== null)
		e.value = val;
}

function enableById(id, enable)
{
	var e = document.getElementById(id);
	if(e !== undefined && e !== null)
		e.disabled = !enable;
}

function setValueById(id, value)
{
	var e = document.getElementById(id);
	if(e !== undefined && e !== null)
		e.value = value;
}

function getValueById(id)
{
	var e = document.getElementById(id);
	if(e !== undefined && e !== null)
		return e.value;
}

function addClassNameById(id, name)
{
	var e = document.getElementById(id);
	if(e !== undefined && e !== null)
		addClassName(e, name);
}

function removeClassNameById(id, name)
{
	var e = document.getElementById(id);
	if(e !== undefined && e !== null)
		removeClassName(e, name);
}

function toggleClassNameById(id, name, toggle)
{
	var e = document.getElementById(id);
	if(e !== undefined && e !== null)
	{
		if(toggle)
			addClassName(e, name);
		else
			removeClassName(e, name);
	}
}

function getGamepadElement(p)
{
	return document.getElementById("gamepad" + p);
}

function getGamepadAreaElement(p)
{
	return getChildById(getGamepadElement(p), "gamepad-area");
}

function getStickAreaElement(p)
{
	return getChildById(getGamepadAreaElement(p), "stick-area");
}

function getButtonAreaElement(p)
{
	return document.getElementById("button-area");
}

function getStickElement(p)
{
	return getChildById(getStickAreaElement(p), "stick");
}

function getStickArrowElement(p, d)
{
	return getChildById(getStickAreaElement(p), sticknames[d] );
}

function getStickSetupElement(p, d)
{
	return document.getElementById(sticknames[d]);
}

function getButtonElement(p, b)
{
	return document.getElementById("button" + b);
}

function connecthandler(e)
{
	if(activegamepad === -1)
	{
		activegamepad = getActiveGamepad();

		if(activegamepad !== -1)
		{
			showGamepadArea(true);

			window.requestAnimFrame(updateStatus);

			if(polltimer !== -1)
			{
				clearInterval(polltimer);
				polltimer = -1;
			}
		}
	}
}

function disconnecthandler(e)
{
	var disconnected = true;
	if(activegamepad !== -1)
	{
		var gamepad = getGamepad(activegamepad);
		if(gamepad !== undefined && gamepad !== null)
		{
			if(gamepad.connected)
				disconnected = false;
		}
	}

	if(disconnected)
	{
		activegamepad = -1;

		if(polltimer === -1)
			polltimer = setInterval(connecthandler, 100);
	}
}

function createButtonStyle()
{
	removeAllButtonStyle();

	for(var i = -1; i < customlayout.totalbuttonshow; ++i)
	{
		setButtonStyle(i);
	}
}

function showGamepadArea(show)
{
	if(show)
	{
//		replaceClassName(getGamepadElement(0), gamepaddisconnectedlabel, gamepadconnectedlabel);
		addClassNameById("gamepad-background-image", gamepadconnectedlabel);
//		showElementById("gamepad-area");
	}else{
//		replaceClassName(getGamepadElement(0), gamepadconnectedlabel, gamepaddisconnectedlabel);
		removeClassNameById("gamepad-background-image", gamepadconnectedlabel);
//		hideElementById("gamepad-area");
	}
}

function removeButtons(total)
{
	total = defaultArg(total, customlayout.totalbuttonshow)

	var btnarea = getButtonAreaElement(0);
	var len = btnarea.childElementCount;
	var offset = btnarea.childNodes.length - len;
	for(var i = len - 1; i >= total; --i)
	{
		btnarea.removeChild(btnarea.childNodes[i + offset]);

		removeButtonStyle(i);
	}
}

function createButtons(total)
{
	total = defaultArg(total, customlayout.totalbuttonshow)

	removeButtons(total);

	var btnarea = getButtonAreaElement(0);

	for(var i = btnarea.childElementCount; i < total; ++i)
	{
		var btn = document.createElement("div");
		btn.id = "button" + i;
		btn.className = "button button-released button" + i;
//		btn.addEventListener("click", buttonSetup);
		btn.addEventListener("mousedown", mousedown);

		btnarea.appendChild(btn);

		setButtonStyle(i);
	}
}

function showButtons(total)
{
	if(typeof total !== "undefined")
	{
		var num = Number(total);
		customlayout.totalbuttonshow = (num < 0) ? 0 : (num > totalbuttons) ? totalbuttons : num;
	}

	createButtons();

	e = document.getElementById("custombuttonn");
	e.max = customlayout.totalbuttonshow;
	if(Number(e.value) > e.max)
		e.value = e.max;
	if(e.max <= 0)
	{
		e.value = "";
		getButtonValue("");
		e.disabled = true;
	}else
		e.disabled = false;

	e.disabled = !(e.max > 0 && document.getElementById("custombuttoncheck").checked);
}

function showStickBlock(show)
{
	if(typeof show !== "undefined")
		customlayout.showstick = show;
	else
		show = customlayout.showstick;

	showElement(getStickAreaElement(gamepadid), show);

	getStickValue();
	setStickStyle();

	enableById("customstickx", show);
	enableById("customsticky", show);
	enableById("customstickw", show);
	enableById("customstickh", show);
}

function showBackground(show)
{
	if(typeof show !== "undefined")
		customlayout.background.show = show;
	else
		show = customlayout.background ? customlayout.background.show : true;

	getBackgroundValue();
	setBackgroundStyle();
}

function resetgamepad()
{
	gamepadid = 0;

	createButtonStyle();

	showGamepadArea(false);
	showBackground();
	showButtons();
	showStickBlock();

	setClassName(getStickElement(gamepadid), "stick");
	for(var i = 0; i < 4; ++i)
	{
		setClassName(getStickArrowElement(gamepadid, i), "stick-block " + sticknames[i]);
	}

/*	customlayout.defaultbuttons = getButtonStyleValue(-1);
	for(i = 0; i < totalbuttons; ++i)
		customlayout.buttons[i] = getButtonStyleValue(i);
*/
}

function enableSetupTooltip(text)
{
	document.getElementById("assignbuttontooltip").innerHTML = text;
	addClassNameById("assignbuttontooltip", "active");
}

function disableSetupTooltip()
{
	removeClassNameById("assignbuttontooltip", "active");
	removeClassNameById("assignbuttontooltip", "tooltiptextholdaxis");
}

function clearSetupStatus()
{
	if(setbutton !== -1)
	{
		if(setbutton >= 1000 )
			removeClassName(getStickSetupElement(0, setbutton - 1000), sticksetuplabel);
		else
			removeClassName(getButtonElement(0, setbutton), buttonsetuplabel);

		setbutton = -1;

		disableSetupTooltip();
	}
}

function cancelSetup(e)
{
	if(setbutton !== -1 && e.target.className.search("-setup") === -1)
	{
		clearSetupStatus();

		updateLink();
	}
}

function buttonSetup(e)
{
	clearSetupStatus();
	addClassName(e.target, buttonsetuplabel);
	setbutton = parseInt(e.target.id.match(/\d+/));
	buttonstatus[setbutton] = -100;

	enableSetupTooltip("Assigning Button " + ( setbutton + 1 ) + " ...");
}

function stickSetup(e)
{
	clearSetupStatus();
	var stickarrow = e.target.id;

	for(var i = 0; i < 4; ++i)
	{
		if(sticknames[i] === stickarrow)
		{
			setbutton = i + 1000;
			dpadstatus[i] = -100;

			addClassName(e.target, sticksetuplabel);

			enableSetupTooltip("Assigning Button " + dpadnames[i] + " ...");
		}
	}
}

function showElementById(id, show)
{
	showElement(document.getElementById(id), show);
}

function hideElementById(id)
{
	showElementById(id, false);
}

function showElement(ele, show)
{
	if(typeof show !== "undefined" && !show )
		replaceClassName(ele, "show", "hide");
	else
		replaceClassName(ele, "hide", "show");
}

function hideElement(ele)
{
	showElement(ele, false);
}

function checkInputNumber3(e)
{
	var n = e.valueAsNumber;
	if(!isNaN(n))
	{
		if(n > e.max)
			n = e.max;
		if(n < e.min)
			n = e.min;

		e.value = n;
	}else
		e.value = e.defaultValue;
}

function setContainerHeight() {
	document.getElementById("container").style.height = (document.getElementById("gamepad-area").offsetHeight * options.scale) + "px";
}

function updateScale(value)
{
	options.scale = parseFloat(value);
	if(isNaN(options.scale)) options.scale = 1;

	var gamepadele = getGamepadElement(0);

	gamepadele.style.transform = "scale(" + options.scale + ")";

	setContainerHeight();

	updateLink();
}

function updateBgOpacity(value)
{
	options.opacity = parseFloat(value);
	if(isNaN(options.opacity)) options.opacity = 1;

	var bgele = document.getElementById("gamepad-area-background");
	bgele.style.opacity = options.opacity.toString();

	updateLink();
}

function updateInputHistoryToggle()
{
	if(document.getElementById("customlayouttoggle").checked)
	{
		customlayout.inputhistorymode.toggle = document.getElementById("inputhistorytoggle").checked;
		document.getElementById("inputhistoryfieldset").style.display = customlayout.inputhistorymode.toggle ? "block" : "none";
		document.getElementById("stickbuttonconfig").style.display = customlayout.inputhistorymode.toggle ? "none" : "block";

		if(customlayout.inputhistorymode.toggle)
		{
			customlayout.inputhistorymode.direction = parseInt(document.querySelector("input[name='inputhistorydirectionset']:checked").value);
			customlayout.inputhistorymode.count = getValueById("inputhistorycount");
			customlayout.inputhistorymode.game = getValueById("inputhistorygame");

			if(customlayout.inputhistorymode.direction === 0)
			{
				removeClassNameById("inputlist", "horizontal");
				removeClassNameById("inputlist", "up");
			}
			else
			{
				addClassNameById("inputlist", "horizontal");

				if(customlayout.inputhistorymode.direction === 2)
					addClassNameById("inputlist", "up");
				else
					removeClassNameById("inputlist", "up");
			}

			document.getElementById("inputhistorytekkenfieldset").style.display = customlayout.inputhistorymode.game === "tekken" ? "block" : "none";

			updateInputHistoryTekkenBtn();

			document.getElementById("stickbuttonconfig").disabled = true;
			removeClassNameById("inputlist", "hide");
			addClassNameById("container", "hide");

			//updateInputHistoryStyle();

			return;
		}
	}

	document.getElementById("stickbuttonconfig").disabled = false;
	addClassNameById("inputlist", "hide");
	removeClassNameById("container", "hide");
}

function updateInputHistoryStyle()
{
	var style = "";

	style += ".inputlistelement.inputarrow{background-image: url('layout/" + customlayout.name + "/btn-up.png');}";

	for(var i = 0; i < 20; i++)
	{
		style += ".inputlistelement.inputlistelement" + i + "{background-image:url('layout/" + customlayout.name + "/btn-" + i + ".png');}";
	}

	var btns = [[1,2],[1,2,3],[1,2,3,4],[1,2,4],[1,3],[1,3,4],[1,4],[2,3],[2,3,4],[2,4],[3,4]];

	for(i = 0; i < btns.length; i++)
	{
		style += updateInputHistoryStyleTekken(btns[i]);
	}

	var ele = document.getElementById("inputhistorystyle");
	if(!ele)
	{
		ele = document.createElement("style");
		document.head.appendChild(ele);
	}
	ele.id = "inputhistorystyle";
	ele.innerHTML = style;
}

function updateInputHistoryStyleTekken(btns)
{
	return ".tekken .inputlistelement.inputlistelement" + btns.join("-") + "{background-image:url('layout/" + customlayout.name + "/btn-" + btns.join("+") + ".png');}";
}

function updateInputHistoryTekkenBtn()
{
	if(customlayout.inputhistorymode.game === "tekken")
	{
		var btn = parseInt(document.getElementById("inputhistorytekkenbtn").value) - 1;
		if(!customlayout.inputhistorymode.btnmapping)
			customlayout.inputhistorymode.btnmapping = ["1","2","3","4","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"];

		document.getElementById("inputhistorytekkenbtnmapto").value = (customlayout.inputhistorymode.btnmapping.length > btn) ? customlayout.inputhistorymode.btnmapping[btn] : "0";
	}
}

function updateInputHistoryTekkenBtnMapTo()
{
	customlayout.inputhistorymode.btnmapping[document.getElementById("inputhistorytekkenbtn").value - 1] = document.getElementById("inputhistorytekkenbtnmapto").value;
}

function decodeAxisCode(str, pos)
{
	var val = str.substring(pos, pos + 6);
	if(val.length < 6 || val.match(/[^0-9]/) !== null)
		return -1;

	return parseInt(val);
}

function decodeButtonCode(code)
{
	if(code >= 97 && code <= 122) // a-z
		return code - 97;
	else if(code >= 65 && code <= 90) // A-Z
		return code - 65 + 26;

	switch(code)
	{
		case 43: return 1000000; // +
		case 45: return 2000000; // -
	}

	return -1;
}

function encodeButtonCode(code)
{
	var str = "";
	if(code >= 1000000)
	{
		if(code >= 2000000)
		{
			str = "-";
		}else{
			str = "+";
		}

		str += code.toString().substring(1);
		return str;
	}

	return String.fromCharCode(code + ((code < 26) ? 97 : 65 - 26));
}

function getVaildValueAsString(id)
{
	var str = "";
	var n = document.getElementById(id).valueAsNumber;
	if(!isNaN(n))
		str += n.toFixed(2);

	return str;
}

function getVaildIntegerAsString(id)
{
	var str = "";
	e = document.getElementById(id);
	var n = e.valueAsNumber;
	if(!isNaN(n))
	{
		n = Math.floor(n);
		if(n < e.min)
			n = e.min;
		if(n > e.max)
			n = e.max;

		if(n === e.valueAsNumber)
			str += n;
	}

	return str;
}

function getUserSpecificString(obj, name)
{
	if(obj.axis !== "" && obj.value !== "")
	{
		return name + ":" + obj.axis + "~" + obj.value + ";";
	}

	return "";
}

function getUserSpecific(axisid, valueid)
{
	var obj = {axis : "", value : ""};
	obj.axis = getVaildIntegerAsString(axisid);
	if(obj.axis !== "")
	{
		obj.value = getVaildValueAsString(valueid);
		if(obj.value !== "")
		{
			return obj;
		}
	}

	return {axis : "", value : ""};
}

function setUserSpecific(name, str)
{
	var obj = {axis : "", value : ""};
	var pos = str.search(name + ":");
	if(pos < 0) return obj;
	var pos2 = str.indexOf("~", pos);
	if(pos2 < 0) return obj;
	var pos3 = str.indexOf(";", pos2);
	if(pos3 < 0) return obj;

	obj.axis = str.substring(pos + name.length + 1, pos2);
	obj.value = str.substring(pos2 + 1, pos3);

	userspecific.enable = true;

	return obj;
}

function setUserSpecificButton(name)
{
	var button = parseInt(document.getElementById("userspecificb" + name).value);
	if(!isNaN(button) && button > 0 && button <= totalbuttons)
		custombutton[button - 1] = axisToButtonCode(Number(userspecific[name].axis), Number(userspecific[name].value));
}

function axisToButtonCode(axis, value)
{
	var code = value < 0 ? 2000000 : 1000000; // sign
	code += axis * 10000;
	code += Math.abs(Math.floor(value * 100));

	return code;
}

function updateLayoutName()
{
	updateLink();

	if(customlayout.inputhistorymode.toggle)
		updateInputHistoryToggle();
}

function updateLink()
{
	var link = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "") + location.pathname;

	var paracustom = "?c=0";
	var parasave = "?c=1";
	var para = "";

	// scale
	var scale = document.getElementById("scalevalue").value;
	scale = parseFloat(scale);
	if(scale !== 1)
		para += "&s=" + scale;

	// background opacity
	var bgopacity = document.getElementById("bgopacityvalue").value;
	bgopacity = parseFloat(bgopacity);
	if(bgopacity !== 1)
		para += "&o=" + bgopacity;

	// user specific
	var u = "";
	if(document.getElementById("userspecifictoggle").checked)
	{
		var str = "";
		userspecific.n = getUserSpecific("userspecifican", "userspecificvn");
		userspecific.u = getUserSpecific("userspecificau", "userspecificvu");
		userspecific.d = getUserSpecific("userspecificad", "userspecificvd");
		userspecific.l = getUserSpecific("userspecifical", "userspecificvl");
		userspecific.r = getUserSpecific("userspecificar", "userspecificvr");
		userspecific.ul = getUserSpecific("userspecificaul", "userspecificvul");
		userspecific.dl = getUserSpecific("userspecificadl", "userspecificvdl");
		userspecific.ur = getUserSpecific("userspecificaur", "userspecificvur");
		userspecific.dr = getUserSpecific("userspecificadr", "userspecificvdr");

		str += getUserSpecificString(userspecific.n, "N");
		str += getUserSpecificString(userspecific.u, "U");
		str += getUserSpecificString(userspecific.d, "D");
		str += getUserSpecificString(userspecific.l, "L");
		str += getUserSpecificString(userspecific.r, "R");
		str += getUserSpecificString(userspecific.ul, "UL");
		str += getUserSpecificString(userspecific.dl, "DL");
		str += getUserSpecificString(userspecific.ur, "UR");
		str += getUserSpecificString(userspecific.dr, "DR");

		if(str !== "")
		{
			userspecific.enable = true;
			u += "&u=" + str;
		}

		setUserSpecificButton("u");
		setUserSpecificButton("d");
		setUserSpecificButton("l");
		setUserSpecificButton("r");
	}
	else
	{
		userspecific.enable = false;
		userspecific.status = [];
	}

	// custom buttons
	var i;
	var dpadstr = "";
	var btnstr = "";
	var totalcustomdpads = 0;
	var totalcustombuttons = 0;
	for(i = 0; i < 4; ++i)
	{
		dpadstr += encodeButtonCode(customdpad[i]);
		if(customdpad[i] != i + 12)
			totalcustomdpads = i;
	}

	for( i = 0; i < totalbuttons; ++i)
	{
		if(custombutton[i] != i)
			totalcustombuttons = i;
	}
	for( i = 0; i <= totalcustombuttons; ++i)
	{
		btnstr += encodeButtonCode(custombutton[i]);
	}

	if(totalcustombuttons > 0)
		para += "&b=" + dpadstr + btnstr;
	else if(totalcustomdpads > 0)
		para += "&b=" + dpadstr;

	para += u;

	// custom layout
	if(document.getElementById("customlayouttoggle").checked)
	{
		var name = document.getElementById("customlayoutfilename").value;

		customlayout.name = name;
		var pathname = "layout/" + name + "/";
		document.getElementById("inputfilenamepathbackgroundimg").innerHTML = pathname;
		document.getElementById("inputfilenamepathimg").innerHTML = pathname;
		document.getElementById("inputfilenamepathimgp").innerHTML = pathname;
		document.getElementById("tooltiptextsavefile").innerHTML = "Copy the saved file to the \"" + pathname + "\" folder";
		document.getElementById("tooltiptextimagefile").innerHTML = "Image files must be placed under the \"" + pathname + "\" folder";
		document.getElementById("tooltiptextimagepfile").innerHTML = "Image files must be placed under the \"" + pathname + "\" folder";

		if(name !== "")
			para += "&l=" + encodeURI(name);

		showGamepadArea(customize >= 1 || activegamepad !== -1);
	}else{
		showGamepadArea(activegamepad !== -1);
	}

	var str = link + parasave + para;
	document.getElementById("savelinktext").value = str;
	document.getElementById("savelinktooltip").innerText = str;

	str = link + paracustom + para;
	document.getElementById("customlinktext").value = str;
	document.getElementById("customlinktooltip").innerText = str;

	if(location.protocol === "file:")
		link = "http://absolute" + location.pathname;

	str = link + paracustom + para;
	document.getElementById("obsbrowserlinktext").value = str;
	document.getElementById("obslinktooltip").innerText = str;
}

function checkUserSpecificStickTilted(obj, gamepad)
{
	if(obj.axis === "" || obj.value === "")
		return -1;

	var axis = Number(obj.axis);
	var value = Number(obj.value);

	if(axis >= gamepad.axes.length)
		return -1;

	var gamepadaxis = gamepad.axes[axis];

	if(value >= gamepadaxis - 0.05 && value <= gamepadaxis + 0.05)
		return 1;

	return 0;
}

function checkUserSpecificStick(obj, neutral_obj, gamepad)
{
	if(obj.axis === "" || obj.value === "")
		return -1;

	var axis = Number(obj.axis);
	var value = Number(obj.value);

	if(axis >= gamepad.axes.length)
		return -1;

	var gamepadaxis = gamepad.axes[axis];

	var neutral = (value - ((neutral_obj.value === "") ? 0 : Number(neutral_obj.value))) * 0.3;

	var max, min;
	if(value > neutral)
	{
		max = value;
		min = neutral;
	}
	else
	{
		max = neutral;
		min = value;
	}

	if(max >= gamepadaxis - 0.05 && min <= gamepadaxis + 0.05)
		return 1;

	return 0;
}

function checkGamepadButton(btn, gamepad)
{
	if(btn >= 1000000) // axes
	{
		var sign;
		var axis;
		var val;
		if(btn >= 2000000)
		{
			sign = -1;
			btn -= 2000000;
		}else{
			sign = 1;
			btn -= 1000000;
		}

		axis = Math.floor(btn / 10000);
		val = ( btn - (axis * 10000) ) * sign / 100;

		if(axis < gamepad.axes.length)
		{
			if(userspecific.enable)
			{
				for(var i = 0; i < userspecific.status.length; ++i)
				{
					var diff = Math.abs(val - Number(userspecific.status[i].value));

					if(axis == userspecific.status[i].axis && diff <= 0.05 && diff >= -0.05)
						return 1;
				}

				return 0;
			}

			var gamepadaxis = gamepad.axes[axis];

//			if(gamepadaxescenter[axis] <= 30)
//			{
				var min = (val - gamepadaxescenter[axis]) * 0.55;
				var max = val + (0.05 * sign);
				if(max < min)
				{
					var tmp = min;
					min = max;
					max = tmp;
				}

				if(gamepadaxis >= min && gamepadaxis <= max)
					return 1;

//				if((gamepadaxis >= 80 && val >= 98 && val <= 102) || (gamepadaxis <= -80 && val <= -98 && val >= -102))
//					return 1;
//			}

//			return (gamepadaxis >= val - 2 && gamepadaxis <= val + 2) ? 1 : 0;
		}
	}else{
		if(btn < gamepad.buttons.length)
		{
			return gamepad.buttons[btn].pressed ? 1 : 0;
		}
	}

	return 0;
}

var setaxiscounter =
{
	axis: 0, value: 0 , counter: 0,
	set: function(axis, value)
	{
		this.axis = axis; this.value = value; this.counter = 1; addClassNameById("assignbuttontooltip", "tooltiptextholdaxis");
	},
	clear: function()
	{
		this.axis = 0; this.value = 0; this.counter = 0; removeClassNameById("assignbuttontooltip", "tooltiptextholdaxis");
	}
};

function updateStatus()
{
	if( activegamepad !== -1 )
	{
		var gamepad = getGamepad(activegamepad);
		if(gamepad === undefined || gamepad === null)
			return;

		var btnlen = gamepad.buttons.length;
		var axeslen = gamepad.axes.length;

		var gamepadid = 0;

		var i;

		if(setbutton !== -1)
		{
			for(i = 0; i < btnlen; ++i)
			{
				if(gamepad.buttons[i].pressed)
				{
					if(setbutton < 1000)
						custombutton[setbutton] = i;
					else
						customdpad[setbutton - 1000] = i;

					updateLink();

					clearSetupStatus();
				}
			}

			if(setbutton !== -1)
			{
				var axiscenter = true;

				for(i = 0; i < axeslen; ++i)
				{
					var val = gamepad.axes[i];
					if(val >= gamepadaxescenter[i] + 0.30 || val <= gamepadaxescenter[i] - 0.30)
					{
						axiscenter = false;

						var reset = true;
						if(setaxiscounter.axis === i)
						{
							if(setaxiscounter.value <= val + 0.30 && setaxiscounter.value >= val - 0.30)
							{
								if(++setaxiscounter.counter >= 60)
								{
									var code = axisToButtonCode(i, val);

									if(setbutton < 1000)
										custombutton[setbutton] = code;
									else
										customdpad[setbutton - 1000] = code;

									setaxiscounter.clear();

									updateLink();

									clearSetupStatus();

								}
								reset = false;
							}
						}

						if(reset)
							setaxiscounter.set(i, val);
					}
				}

				if(axiscenter && setaxiscounter.counter > 0)
					setaxiscounter.clear();
			}
		}

		var input = [];
		var statuschanged = false;

		// stick
		var status = [0, 0, 0, 0];
		var stickclass = "stick";

		if(userspecific.enable)
		{
			userspecific.status = [];

			var tilted = false;
			var ret;

			ret = checkUserSpecificStickTilted(userspecific.ul, gamepad);
			if(ret >= 0)
			{
				if(ret > 0)
				{
					stickclass = "stick " + sticknames[0] + " " + sticknames[2];
					status[0] = 1; status[2] = 1;
					userspecific.status.push(userspecific.u, userspecific.l);
				}
				tilted = true;
			}

			ret = checkUserSpecificStickTilted(userspecific.dl, gamepad);
			if(ret >= 0)
			{
				if(ret > 0)
				{
					stickclass = "stick " + sticknames[1] + " " + sticknames[2];
					status[1] = 1; status[2] = 1;
					userspecific.status.push(userspecific.d, userspecific.l);
				}
				tilted = true;
			}

			ret = checkUserSpecificStickTilted(userspecific.ur, gamepad);
			if(ret >= 0)
			{
				if(ret > 0)
				{
					stickclass = "stick " + sticknames[0] + " " + sticknames[3];
					status[0] = 1; status[3] = 1;
					userspecific.status.push(userspecific.u, userspecific.r);
				}
				tilted = true;
			}

			ret = checkUserSpecificStickTilted(userspecific.dr, gamepad);
			if(ret >= 0)
			{
				if(ret > 0)
				{
					stickclass = "stick " + sticknames[1] + " " + sticknames[3];
					status[1] = 1; status[3] = 1;
					userspecific.status.push(userspecific.d, userspecific.r);
				}
				tilted = true;
			}

			if(tilted)
			{
				if(status[0] === 0 && checkUserSpecificStickTilted(userspecific.u, gamepad) > 0)
				{
					stickclass += " " + sticknames[0];
					status[0] = 1;
					userspecific.status.push(userspecific.u);
				}
				if(status[1] === 0 && checkUserSpecificStickTilted(userspecific.d, gamepad) > 0)
				{
					stickclass += " " + sticknames[1];
					status[1] = 1;
					userspecific.status.push(userspecific.d);
				}
				if(status[2] === 0 && checkUserSpecificStickTilted(userspecific.l, gamepad) > 0)
				{
					stickclass += " " + sticknames[2];
					status[2] = 1;
					userspecific.status.push(userspecific.l);
				}
				if(status[3] === 0 && checkUserSpecificStickTilted(userspecific.r, gamepad) > 0)
				{
					stickclass += " " + sticknames[3];
					status[3] = 1;
					userspecific.status.push(userspecific.r);
				}
			}
			else
			{
				if(checkUserSpecificStick(userspecific.u, userspecific.n, gamepad) > 0)
				{
					stickclass += " " + sticknames[0];
					status[0] = 1;
					userspecific.status.push(userspecific.u);
				}
				if(checkUserSpecificStick(userspecific.d, userspecific.n, gamepad) > 0)
				{
					stickclass += " " + sticknames[1];
					status[1] = 1;
					userspecific.status.push(userspecific.d);
				}
				if(checkUserSpecificStick(userspecific.l, userspecific.n, gamepad) > 0)
				{
					stickclass += " " + sticknames[2];
					status[2] = 1;
					userspecific.status.push(userspecific.l);
				}
				if(checkUserSpecificStick(userspecific.r, userspecific.n, gamepad) > 0)
				{
					stickclass += " " + sticknames[3];
					status[3] = 1;
					userspecific.status.push(userspecific.r);
				}
			}

/*			if(checkUserSpecificStick(userspecific.n, gamepad) > 0)
				stickclass = "stick";
*/
		}else{
			for(i = 0; i < 4; ++i)
			{
				if(checkGamepadButton(customdpad[i], gamepad))
				{
					stickclass += " " + sticknames[i];
					status[i] = 1;
				}
			}
		}
		setClassName(getStickElement(gamepadid), stickclass);

		// buttons
		var istekken = (activelayout.inputhistorymode.toggle && activelayout.inputhistorymode.game === "tekken");

		for(i = 0; i < activelayout.totalbuttonshow; i++)
		{
			var btnstatus = checkGamepadButton(custombutton[i], gamepad);
			if(btnstatus !== buttonstatus[i])
			{
				buttonstatus[i] = btnstatus;

				if(btnstatus === 1)
				{
					replaceClassName(getButtonElement(gamepadid, i), "button-released", "button-pressed");
					statuschanged = true;
					input.push(i);
				}
				else
				{
					replaceClassName(getButtonElement(gamepadid, i), "button-pressed", "button-released");

					if(istekken)
						statuschanged = true;
				}
			}
		}

		// input history
		if(activelayout.inputhistorymode.toggle)
		{
			if(statuschanged && inputlist.length > 0)
			{
				input = inputlist.concat(input);
				input.sort();
			}
			inputlist = input.slice(0);

			for(i = 0; i < 4; i++)
			{
				if(status[i] !== dpadstatus[i])
				{
					dpadstatus[i] = status[i];
					statuschanged = true;
				}
			}

			var d = 0;
			if(statuschanged)
			{
				if(dpadstatus[0] === 1 && dpadstatus[2] === 1)
					d = 1005;
				else if(dpadstatus[1] === 1 && dpadstatus[2] === 1)
					d = 1006;
				else if(dpadstatus[0] === 1 && dpadstatus[3] === 1)
					d = 1007;
				else if(dpadstatus[1] === 1 && dpadstatus[3] === 1)
					d = 1008;
				else if(dpadstatus[0] === 1)
					d = 1001;
				else if(dpadstatus[1] === 1)
					d = 1002;
				else if(dpadstatus[2] === 1)
					d = 1003;
				else if(dpadstatus[3] === 1)
					d = 1004;

				if(d > 0)
					input.push(d);

				displayInputList(input);
			}
		}

		requestAnimFrame(updateStatus);
	}
	else
		resetgamepad();
}

function displayInputList(input)
{
	if(activelayout.inputhistorymode.game === "tekken")
	{
		displayInputListTekken(input);
		return;
	}

	var len = input.length;
	if(len === 0)
		return;

	var parent = document.getElementById("inputlist");

	while(parent.childElementCount >= activelayout.inputhistorymode.count)
		parent.removeChild(parent.lastChild);

	var child = document.createElement("div");
	child.className = "inputlistchild";

	var childalign = document.createElement("div");
	childalign.className = "inputlistchildalign";
	child.appendChild(childalign);

	for(var i = 0; i < len; i++)
	{
		var ele = document.createElement("div");
		var inp = input[i];
		var arrow = (inp >= 1000 && inp < 2000) ? " inputarrow" : "";
		if(inp < 999) inp++;
		ele.className = "inputlistelement inputlistelement" + inp + arrow;

		childalign.appendChild(ele);
	}

	parent.insertBefore(child, parent.firstChild);
}

function displayInputListTekken(input)
{
	var child = document.createElement("div");
	child.className = "inputlistchild tekken";

	var childalign = document.createElement("div");
	childalign.className = "inputlistchildalign";
	child.appendChild(childalign);

	var len = input.length;
	var ele, inp;
	var arrow = 0;
	for(var i = 0; i < len; i++)
	{
		inp = input[i];
		if(inp >= 1000 && inp < 2000)
			arrow = inp;
	}

	var btns = [0,0,0,0];
	var b = [];
	var j;
	var pressing = 0;
	for(i = 0; i < activelayout.totalbuttonshow; i++)
	{
		if(buttonstatus[i] === 1)
		{
			pressing = i + 1;

			if(activelayout.inputhistorymode.btnmapping.length > i && activelayout.inputhistorymode.btnmapping[i] !== "0")
			{
				b = activelayout.inputhistorymode.btnmapping[i].split("+");
				for(j = 0; j < b.length; j++)
				{
					btns[parseInt(b[j]) - 1] = 1;
				}
			}
		}
	}

	var ele = document.getElementById("inputhistorytekkenbtn");
	if(pressing)
	{
		addClassName(ele, "pressing");

		pressing = pressing.toString();
		if(ele.value !== pressing)
		{
			ele.value = pressing;
			ele.onchange();
		}
	}
	else
		removeClassName(ele, "pressing");

	if(laststatus.arrow === arrow)
	{
		var statuschanged = false;

		for(i = 0; i < laststatus.btns.length; i++)
		{
			if(laststatus.btns[i] !== btns[i])
			{
				statuschanged = true;
				break;
			}
		}

		if(!statuschanged)
			return;
	}

	b = [];
	for(i = 0; i < btns.length; i++)
	{
		if(btns[i])
			b.push(i + 1);
	}

	if(b.length)
	{
		ele = document.createElement("div");
		ele.className = "inputlistelement inputlistelement" + b.join("-");
		childalign.appendChild(ele);
	}

	if(arrow)
	{
		ele = document.createElement("div");
		ele.className = "inputlistelement inputlistelement" + arrow + " inputarrow";
		childalign.appendChild(ele);
	}

	laststatus = {arrow: arrow, btns: btns};

	var parent = document.getElementById("inputlist");

	while(parent.childElementCount >= activelayout.inputhistorymode.count)
		parent.removeChild(parent.lastChild);

	parent.insertBefore(child, parent.firstChild);
}

function enableStyle(id, enable)
{
	var style = document.getElementById(id);
	if(style !== null)
		style.disabled = !enable;
}

function enableCustomLayout(enable)
{
	activelayout = enable ? customlayout : defaultlayout;

	toggleClassNameById('customlayoutdropdown', 'dropdownopen', enable);
	toggleClassNameById('container', 'customlayout', enable);
//	showElementById('customlayoutfield', enable);

	createButtons(activelayout.totalbuttonshow);
	showElement(getStickAreaElement(0), activelayout.showstick);

	enableStyle("background-style", enable);
	enableStyle("stick-style", enable);
	enableStyle("button-style", enable);

	updateInputHistoryToggle();

	showGamepadArea(enable || activegamepad !== -1);

	setContainerHeight();

	updateLink();
}

function removeStickStyle()
{
	var styleid = "stick-style"
	var style = document.getElementById(styleid);
	if(style !== null)
	{
		var name = ".stick-area";

		var len = style.sheet.cssRules.length;
		for(var i = 0, j = 0; i < len; ++i)
		{
			if(style.sheet.cssRules[i].selectorText === name)
			{
				style.sheet.deleteRule(i);
				break;
			}
		}
	}
}

function setStickStyle()
{
	var styleid = "stick-style"
	var style = document.getElementById(styleid);
	if(style === null)
	{
		style = document.createElement("style");
		style.id = styleid;
		document.head.appendChild(style);
	}

	var name = ".stick-area";
	var val = customlayout.stick;

	var len = style.sheet.cssRules.length;
	for(var i = 0, j = 0; i < len; ++i)
	{
		if(style.sheet.cssRules[i].selectorText === name)
		{
			style.sheet.deleteRule(i);
			break;
		}
	}

	var l = (val.x === "") ? "" : "left:" + val.x + "px;";
	var t = (val.y === "") ? "" : "top:" + val.y + "px;";
	var w = (val.w === "") ? "1" : val.w / 100;
	var h = (val.h === "") ? "1" : val.h / 100;

	style.sheet.insertRule(name + " {" + l + t + "transform:translate(-50%,-50%) scale(" + w + "," + h + ");}", 0);
}

function removeButtonStyle(btn)
{
	var style = document.getElementById("button-style");
	if(style !== null)
	{
		var name = ".button"
		var namer = ".button-released";
		var namep = ".button-pressed";
		var val = {};

		if(btn !== -1)
		{
			val = customlayout.buttons[btn];
			name += btn.toString();
			namer += name;
			namep += name;
		}else{
			val = customlayout.defaultbuttons;
		}

		namer += name;
		namep += name;

		var len = style.sheet.cssRules.length;
		for(var i = 0, j = 0; i < len; ++i)
		{
			var text = style.sheet.cssRules[i].selectorText;
			if(text === name || text === namer || text === namep)
			{
				style.sheet.deleteRule(i);
				--len;
				if(++j > 3)
					break;
			}
		}
	}
}

function removeAllButtonStyle()
{
	var style = document.getElementById("button-style");
	if(style !== null)
		document.head.removeChild(style);
}

function setButtonStyle(btn)
{
	var styleid = "button-style";
	var style = document.getElementById(styleid);
	if(style === null)
	{
		style = document.createElement("style");
		style.id = styleid;
		document.head.appendChild(style);
	}

	var name = ".button"
	var namer = ".button-released";
	var namep = ".button-pressed";
	var val = {};

	if(btn !== -1)
	{
		val = customlayout.buttons[btn];
		name += btn.toString();
		namer += name;
		namep += name;
	}
	else
	{
		val = customlayout.defaultbuttons;
	}

	namer += name;
	namep += name;

	var len = style.sheet.cssRules.length;
	for(var i = 0, j = 0; i < len;)
	{
		var text = style.sheet.cssRules[i].selectorText;
		if(text === name || text === namer || text === namep)
		{
			style.sheet.deleteRule(i);
			len--;
			if(++j >= 3)
				break;
		}
		else
		{
			i++;
		}
	}

	var l = (val.x === "") ? "" : "left:" + val.x + "px" + ";";
	var t = (val.y === "") ? "" : "top:" + val.y + "px" + ";";
	var w = (val.w === "") ? "" : "width:" + val.w + "px" + ";";
	var h = (val.h === "") ? "" : "height:" + val.h + "px" + ";";
	var img = (val.img === "") ? "" : "background-image:url(\"layout/" + customlayout.name + "/" + val.img + "\")" + ";";

	var lp = (val.xp === "") ? "" : "left:" + val.xp + "px" + ";";
	var tp = (val.yp === "") ? "" : "top:" + val.yp + "px" + ";";
	var wp = (val.wp === "") ? "" : "width:" + val.wp + "px" + ";";
	var hp = (val.hp === "") ? "" : "height:" + val.hp + "px" + ";";
	var imgp = (val.imgp === "") ? "" : "background-image:url(\"layout/" + customlayout.name + "/" + val.imgp + "\")" + ";";

	if(btn === -1)
	{
		if(!val.img) img = "background-image:none;";
		if(!val.imgp) img = "background-image:none;";

		toggleClassNameById("button-area", "no-img", !val.img);
	}
	else
	{
		toggleClassNameById("button" + btn, "no-img", !val.img);
	}

	style.sheet.insertRule(name + " {" + l + t + w + h + "}", i);
	style.sheet.insertRule(namer + " {" + img + "}", i + 1);
	style.sheet.insertRule(namep + " {" + lp + tp + wp + hp + imgp + "}", i + 2);
}

function removeBackgroundStyle() {
	var style = document.getElementById("background-style");
	if(style) style.remove();
}

function setBackgroundStyle() {
	var styleid = "background-style";
	var style = document.getElementById(styleid);

	if(style) style.remove();

	if(!customlayout.background) return;

	style = document.createElement("style");
	style.id = styleid;
	document.head.appendChild(style);

	var css = "";
	var bg = customlayout.background;

	css += "#gamepad-area-background{";
	css += bg.show === false ? "visibility:hidden;" : "";
	css += bg.image ? "background-image:url(\"layout/" + customlayout.name + "/" + bg.image + "\");" : "";
	css += bg.w ? "width:" + bg.w + "px;" : "";
	css += bg.h ? "height:" + bg.h + "px;" : "";
	css += "}";

	style.innerHTML = css;
}

function getStringBetween(str, begin, end)
{
	var res = str.match(RegExp(begin + "(.*?)" + end, "i"));
	return (res !== null) ? res[1]: "";
}

function getButtonStyleValue(btn)
{
	var val={};
	var ele = document.createElement("div");
	ele.className = "hide button" + ((btn < 0) ? "" : btn);
	ele.style.display = "none";
	var parent = document.getElementById("customlayout");
	parent.appendChild(ele);

	var style = window.getComputedStyle(ele);

	var str = style.left.match(/\d+/);
	val.x = (str!==null) ? str : "";
	str = style.top.match(/\d+/);
	val.y = (str!==null) ? str : "";
	str = style.width.match(/\d+/);
	val.w = (str!==null) ? str : "";
	str = style.height.match(/\d+/);
	val.h = (str!==null) ? str : "";
	str = getStringBetween(style.backgroundImage, "url\\(\"", "\"");
	val.img = str.substring(str.lastIndexOf("/") + 1);

	ele.className += " button-pressed";
	style = window.getComputedStyle(ele);

	str = style.left.match(/\d+/);
	val.xp = (str!==null) ? str : "";
	str = style.top.match(/\d+/);
	val.yp = (str!==null) ? str : "";
	str = style.width.match(/\d+/);
	val.wp = (str!==null) ? str : "";
	str = style.height.match(/\d+/);
	val.hp = (str!==null) ? str : "";
	str = getStringBetween(style.backgroundImage, "url\\(\"", "\"");
	val.imgp = str.substring(str.lastIndexOf("/") + 1);

	parent.removeChild(ele);
	return val;
}

function checkInputNumber(e)
{
	if(e !== "")
	{
		var x = Number(e.value);
		if(x < e.min)
			x = e.min;
		if(x > e.max)
			x = e.max;

		e.value = "";
		e.value = x.toString();
	}
}

function checkInputNumber2(e)
{
	if(e.value === "")
		e.value = "0";
	else
		checkInputNumber(e);
}

function formatInputNumber2(e)
{
	var x = e.value;
	if(e.beforevalue === undefined)
		e.beforevalue = e.defaultValue;

	if(e.value !== "")
	{
		x = Number(x.replace(/[^-\d]/g, ""));

		if(e.value !== x.toString() && e.beforevalue !== "0")
		{
			e.value = e.beforevalue;
		}
		else
		{
			e.value = "";
			e.value = x;
		}
	}

	e.beforevalue = e.value;
}

function formatInputNumber(e)
{
	var x = e.value;
	if(e.beforevalue === undefined)
		e.beforevalue = e.defaultValue;

	if(!e.validity.valid)
		e.value = e.beforevalue;
	else if(e.value != "")
	{
		x = Number(x.match(/\d+/g));
		if(x < e.min)
			x = e.min;
		if(x > e.max)
			x = e.max;

		if(e.value != x.toString() && e.beforevalue !== "0")
		{
			e.value = e.beforevalue;
		}
		else
		{
			e.value = "";
			e.value = x;
		}
	}

	e.beforevalue = e.value;
}

function setBackgroundValue()
{
	var val = {
		show: document.getElementById("custombackgroundshow").checked,
		image : getValueById("custombackgroundimg"),
		w : getValueById("custombackgroundw"),
		h : getValueById("custombackgroundh"),
	};

	customlayout.background = val;

	setBackgroundStyle();
	setContainerHeight();
}

function getBackgroundValue()
{
	if(!customlayout.background) return;

	document.getElementById("custombackgroundshow").checked = customlayout.background.show;
	setValueById("custombackgroundimg", customlayout.background.image);
	setValueById("custombackgroundw", customlayout.background.w);
	setValueById("custombackgroundh", customlayout.background.h);
}

function enableBackgroundValue()
{
	var enable = document.getElementById("custombackgroundshow").checked;
	toggleClassNameById("inputfilenamepathbackgroundimg", "disabled", !enable);
	enableById("custombackgroundimg", enable);
	enableById("custombackgroundw", enable);
	enableById("custombackgroundh", enable);

	setBackgroundValue();
}

function setStickValue()
{
	var val = {
		x : getValueById("customstickx"),
		y : getValueById("customsticky"),
		w : getValueById("customstickw"),
		h : getValueById("customstickh"),
	};

	customlayout.stick = val;

	setStickStyle();
}

function getStickValue()
{
	setValueById("customstickx", customlayout.stick.x);
	setValueById("customsticky", customlayout.stick.y);
	setValueById("customstickw", customlayout.stick.w);
	setValueById("customstickh", customlayout.stick.h);
}

function setButtonValue()
{
	var val = {
		x : getValueById("custombuttonx"),
		y : getValueById("custombuttony"),
		w : getValueById("custombuttonw"),
		h : getValueById("custombuttonh"),
		img : getValueById("custombuttonimg"),

		xp : getValueById("custombuttonxp"),
		yp : getValueById("custombuttonyp"),
		wp : getValueById("custombuttonwp"),
		hp : getValueById("custombuttonhp"),
		imgp : getValueById("custombuttonimgp")
	};

	var btn = -1;
	if(document.getElementById("custombuttondefault").checked)
	{
		customlayout.defaultbuttons = val;
	}else{
		btn = Number(getValueById("custombuttonn")) - 1;
		customlayout.buttons[btn] = val;
	}

	// display the changes
	setButtonStyle(btn);
}

var oldsetbuttonvalue = -1;

function getButtonValue(btn)
{
	var enable = (btn !== "");
	btn = Number(btn) - 1;
	var enable2 = (enable && btn >= 0)
	enableById("custombuttonx", enable2);
	enableById("custombuttony", enable2);
	enableById("custombuttonw", enable);
	enableById("custombuttonh", enable);
	enableById("custombuttonimg", enable);
	toggleClassNameById("inputfilenamepathimg", "disabled", !enable);

	enableById("custombuttonxp", enable2);
	enableById("custombuttonyp", enable2);
	enableById("custombuttonwp", enable);
	enableById("custombuttonhp", enable);
	enableById("custombuttonimgp", enable);
	toggleClassNameById("inputfilenamepathimgp", "disabled", !enable);

	if(!enable)
	{
		setValueById("custombuttonx", "");
		setValueById("custombuttony", "");
		setValueById("custombuttonw", "");
		setValueById("custombuttonh", "");
		setValueById("custombuttonimg", "");

		setValueById("custombuttonxp", "");
		setValueById("custombuttonyp", "");
		setValueById("custombuttonwp", "");
		setValueById("custombuttonhp", "");
		setValueById("custombuttonimgp", "");
	}else{
		var val;
		if(btn < 0)
		{
			val = customlayout.defaultbuttons;
			setValueById("custombuttonx", "");
			setValueById("custombuttony", "");
			setValueById("custombuttonxp", "");
			setValueById("custombuttonyp", "");
		}else{
			val = customlayout.buttons[btn];
			setValueById("custombuttonx", val.x);
			setValueById("custombuttony", val.y);
			setValueById("custombuttonxp", val.xp);
			setValueById("custombuttonyp", val.yp);
		}

		setValueById("custombuttonw", val.w);
		setValueById("custombuttonh", val.h);
		setValueById("custombuttonimg", val.img);

		setValueById("custombuttonwp", val.wp);
		setValueById("custombuttonhp", val.hp);
		setValueById("custombuttonimgp", val.imgp);
	}

	if(oldsetbuttonvalue !== btn)
	{
		if(oldsetbuttonvalue >= 0)
			removeClassNameById("button" + oldsetbuttonvalue, "setbuttonvalue");

		if(btn >= 0)
			addClassNameById("button" + btn, "setbuttonvalue");

		oldsetbuttonvalue = btn;
	}
}

function getCSSValue(classname, prop)
{
	var css = document.createElement("div");
	css.className = classname;
	css.style.display = "none";
	var parent = document.getElementById("customlayout");
	parent.appendChild(css);
	var vals = window.getComputedStyle(css).getPropertyValue(prop).replace(/(^\"|\"$)/g, "");
	parent.removeChild(css);

	return vals;
}

function cssLoaded()
{
	var css = document.createElement("div");
	css.id = "customLayoutValue";
	css.style.display = "none";
	var parent = document.getElementById("customlayout");
	parent.appendChild(css);
	var vals = window.getComputedStyle(css).getPropertyValue("content");
	parent.removeChild(css);

	vals = vals.replace(/(^\"|\"$)/g, "");

	var val = getCustomCSSValue(vals, "totalbuttonshow").match(/\d+/);
	if(val !== "")
		customlayout.totalbuttonshow = Number(val);

	val = getCustomCSSValue(vals, "showstick");
	if(val !== "")
		customlayout.showstick = (val === "true");

	resetgamepad();
}

function saveCSSToFile()
{
	var filename = document.getElementById("customlayoutfilename").value;
	if(filename === "")
		filename = "custom.css";

	var data =	"/*-------------------------------------*\\\r\n";
	data +=		"|   Fightstick Motion Custom CSS File   |\r\n";
	data +=		"\\*-------------------------------------*/\r\n\r\n";
	data +=		"#customLayoutValue\r\n{\r\n\tcontent = \"totalbuttonshow="+customlayout.totalbuttonshow+";showstick="+((customlayout.showstick)?"true":"false")+"\";\r\n}\r\n\r\n";

	saveToFile(filename, data);
}

//----------------------------------
//	mouse event

var mouseevent = {target: null, id: 0, offsetx: 0, offsety: 0, pagex: 0, pagey:0};

function mousedown(e)
{
	if(mouseevent.target !== null)
		return;

	clearSetupStatus();

	if(e.target.id.match(/^button/))
	{
		mouseevent.id = Number(e.target.id.match(/\d+$/));
		if(mouseevent.id >= customlayout.totalbuttonshow)
			return;
	}
	else if(e.target.id.match(/stick-area/) || e.target.parentNode.id.match(/stick-area/))
	{
		mouseevent.id = 1000;
	}
	else
		return;

	if(document.getElementById("customlayouttoggle").checked)
	{
		document.addEventListener("mousemove", mousemove);

		if(mouseevent.id < 1000)
		{
			actionCheckById("custombuttoncheck", true);
			actionSetValueById("custombuttonn", mouseevent.id + 1);

			addClassName(e.target, "mousemove");

			mouseevent.offsetx = e.target.offsetLeft;
			mouseevent.offsety = e.target.offsetTop;

			enableSetupTooltip("Move Button " + (mouseevent.id + 1) + "<br>(" + mouseevent.offsetx + "," + mouseevent.offsety + ")");
		}
		else if(mouseevent.id === 1000)
		{
			addClassNameById("stick-area", "mousemovestick")

			var ele = getStickAreaElement(0);
			mouseevent.offsetx = ele.offsetLeft;
			mouseevent.offsety = ele.offsetTop;

			enableSetupTooltip("Move Stick " + "<br>(" + mouseevent.offsetx + "," + mouseevent.offsety + ")");
		}
	}

	mouseevent.target = e.target;
	mouseevent.pagex = e.pageX;
	mouseevent.pagey = e.pageY;

	document.addEventListener("mouseup", mouseup);

	document.getElementById("inputareafield").disabled = true;

	e.preventDefault();

	return;
}

function mousemove(e)
{
	if(mouseevent.target === null)
		return;

	var x = Math.round((e.pageX - mouseevent.pagex) / options.scale + mouseevent.offsetx);
	var y = Math.round((e.pageY - mouseevent.pagey) / options.scale + mouseevent.offsety);

	if(mouseevent.id < 1000) // button
	{
		if(document.getElementById("custombuttonn").valueAsNumber === mouseevent.id + 1)
		{
			setValueById("custombuttonx", x);
			setValueById("custombuttony", y);
		}

		customlayout.buttons[mouseevent.id].x = x;
		customlayout.buttons[mouseevent.id].y = y;
		setButtonStyle(mouseevent.id);

		enableSetupTooltip("Move Button " + (mouseevent.id + 1) + "<br>(" + x + "," + y + ")");
	}
	else if(mouseevent.id === 1000) // stick
	{
		setValueById("customstickx", x);
		setValueById("customsticky", y);

		customlayout.stick.x = x;
		customlayout.stick.y = y;
		setStickStyle();

		enableSetupTooltip("Move Stick " + "<br>(" + x + "," + y + ")");
	}
	else
		return;
}

function mouseup(e)
{
	if(mouseevent.target === null)
		return;

	document.removeEventListener("mousemove", mousemove);
	document.removeEventListener("mouseup", mouseup);

	var clicked = false;
	if(document.getElementById("customlayouttoggle").checked)
	{
		if(e.pageX === mouseevent.pagex && e.pageY === mouseevent.pagey)
			clicked = true;

		mousemove(e);

		disableSetupTooltip();
	}
	else
	{
		if(mouseevent.target === e.target)
			clicked = true;
	}

	if(clicked)
	{
		if(mouseevent.id < 1000)
			buttonSetup(mouseevent);
		else if(mouseevent.id === 1000)
		{
			if(mouseevent.target.className.search("stick-block") >= 0)
				stickSetup(mouseevent);
		}
	}

	document.getElementById("inputareafield").disabled = false;

	removeClassName(mouseevent.target, "mousemove");

	if(mouseevent.id === 1000)
		removeClassNameById("stick-area", "mousemovestick");

	mouseevent.target = null;
}

function actionCheckById(id, check)
{
	var ele = document.getElementById(id);
	ele.checked = check;
	ele.onchange();
}

function actionSetValueById(id, value)
{
	var ele = document.getElementById(id);
	ele.value = value;
	ele.oninput();
}


//----------------------------------

function resetLayout()
{
	customlayout = new defaultLayout();
}

//----------------------------------

var gamepadbackgroundlabel = "gamepad-area-background";
var gamepadconnectedlabel = "gamepad-connected";
var gamepaddisconnectedlabel = "gamepad-disconnected";
var buttonsetuplabel = "button-setup";
var sticksetuplabel = "stick-setup";
var sticknames = ["stick-up", "stick-down", "stick-left", "stick-right"];
var dpadnames = ["Up", "Down", "Left", "Right"];

var totalbuttons = 52;
var customdpad = new Array(4);
var dpadstatus = new Array(4);
var custombutton = new Array(totalbuttons);
var buttonstatus = new Array(totalbuttons);
var setbutton = -1;
var activegamepad = -1;
var customize = 0;

var inputlist = [];
var laststatus = {btns: [0,0,0,0], arrow: 0};

var options =
{
	scale: 1,
	opacity: 1
};

var userspecific = {
	enable : false,
	n : { axis : "", value : ""},
	u : { axis : "", value : ""},
	d : { axis : "", value : ""},
	l : { axis : "", value : ""},
	r : { axis : "", value : ""},
	ul : { axis : "", value : ""},
	dl : { axis : "", value : ""},
	ur : { axis : "", value : ""},
	dr : { axis : "", value : ""}
};

function defaultArg(arg, value)
{
	return (typeof arg == 'undefined') ? value : arg;
}

function copyLayout(layout)
{
	this.version = defaultArg(layout.version, "");
	if(this.version === "")
		return null;

	this.name = defaultArg(layout.name, "");

	this.inputhistorymode = new inputhistorymode(defaultArg(layout.inputhistorymode, {}));

	this.totalbuttonshow = defaultArg(layout.totalbuttonshow, 0);

	this.showstick = defaultArg(layout.showstick, false);

	this.stick = defaultArg(layout.stick, {});

	this.defaultbuttons = new buttonlayout(defaultArg(layout.defaultbuttons, {}));

	this.buttons = [];
	var len = layout.buttons.length;
	for(var i = 0; i < len; ++i)
	{
		this.buttons.push(new buttonlayout(defaultArg(layout.buttons[i], {})));
	}
	for(var i = len; i < totalbuttons; ++i)
		this.buttons.push(new buttonlayout());

	if(layout.background)
		this.background = layout.background;

	return this;
}

function inputhistorymode(input)
{
	input = defaultArg(input, new Object());
	this.toggle = defaultArg(input.toggle, false);
	this.direction = defaultArg(input.direction, 0);
	this.count = defaultArg(input.count, 20);
	this.game = defaultArg(input.game, "default");
	this.btnmapping = defaultArg(input.btnmapping, ["1","2","3","4","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"]);
	return this;
}

function sticklayout(layout)
{
	layout = defaultArg(layout, new Object());
	this.x = defaultArg(layout.x, "0"); this.y = defaultArg(layout.y, "0"); this.w = defaultArg(layout.w, ""); this.h = defaultArg(layout.h, "");
	return this;
}

function buttonlayout(layout)
{
	layout = defaultArg(layout, new Object());
	this.x = defaultArg(layout.x, "0"); this.y = defaultArg(layout.y, "0"); this.w = defaultArg(layout.w, ""); this.h = defaultArg(layout.h, ""); this.img = defaultArg(layout.img, "");
	this.xp = defaultArg(layout.xp, ""); this.yp = defaultArg(layout.yp, ""); this.wp = defaultArg(layout.wp, ""); this.hp = defaultArg(layout.hp, ""); this.imgp = defaultArg(layout.imgp, "");
	return this;
}

function defaultLayout() {

	this.version = currentversion;

	this.name = "preset";

	this.inputhistorymode = new inputhistorymode({toggle:false, direction:0, count: 20});

	this.totalbuttonshow = 10;
	this.showstick = true;

	this.stick = new sticklayout({x:"110", y:"125", w:"100", h:"100"});

	this.defaultbuttons = new buttonlayout({x:"", y:"", w:"60", h:"60", img:"button-released.png", xp:"", yp:"", wp:"", hp:"", imgp:"button-pressed.png"});
	this.buttons = [
		new buttonlayout({x:"250", y:"115"}),
		new buttonlayout({x:"310", y:"85"}),
		new buttonlayout({x:"375", y:"85"}),
		new buttonlayout({x:"440", y:"85"}),
		new buttonlayout({x:"240", y:"185"}),
		new buttonlayout({x:"300", y:"155"}),
		new buttonlayout({x:"365", y:"155"}),
		new buttonlayout({x:"430", y:"155"}),
		new buttonlayout({x:"390", y:"30", w:"40", h:"40"}),
		new buttonlayout({x:"440", y:"30", w:"40", h:"40"})
	];

	for(var i = this.buttons.length; i < totalbuttons; ++i)
		this.buttons.push(new buttonlayout());

	return this;
};

var defaultlayout = new defaultLayout();
var customlayout = activelayout = new defaultLayout();
var customlayoutenabled = false;

function init()
{
	var i;
	for(i = 0; i < totalbuttons; ++i)
	{
		custombutton[i] = i;
		buttonstatus[i] = -200;
	}

	for(i = 0; i < 4; ++i)
	{
		customdpad[i] = i + 12;
		dpadstatus[i] = -200;
	}

	custombutton[0] = 1;
	custombutton[1] = 2;
	custombutton[2] = 3;
	custombutton[3] = 6;
	custombutton[4] = 0;
	custombutton[5] = 4;
	custombutton[6] = 5;

	//----------------------------------

	var player = getParameterByName("p");
	if(player !== "")
		player = parseInt(player);
	else
		player = 0;

	var bgopacity = getParameterByName("o");
	if(bgopacity !== "")
	{
		document.getElementById("bgopacityvalue").value = bgopacity;
		updateBgOpacity(bgopacity);
	}
	else
	{
		document.getElementById("bgopacityvalue").value = "1.0";
	}

	var scale = getParameterByName("s");
	if(scale !== "")
	{
		document.getElementById("scalevalue").value = scale;
		updateScale(scale);
	}
	else
	{
		document.getElementById("scalevalue").value = "1.0";
	}

	var b = getParameterByName("b");
	if(b !== "")
	{
		var getButtonParameter = function(str, index, obj, len)
		{
			var l = str.length;
			var j = 0;

			while(index < l && j < len)
			{
				var code = decodeButtonCode(str.charCodeAt(index));
				if(code >= 1000000) // axis
				{
					var val = decodeAxisCode(str, ++index);
					if(val < 0) break;
					code += val;
					index += 5;
				}

				obj[j] = code;

				++index;
				++j;
			}

			return index;
		};

		i = 0;
		i = getButtonParameter(b, i, customdpad, 4);
		i = getButtonParameter(b, i, custombutton, totalbuttons);
	}

	var u = getParameterByName("u");
	if(u !== "")
	{
		userspecific.n = setUserSpecific("N", u);
		userspecific.u = setUserSpecific("U", u);
		userspecific.d = setUserSpecific("D", u);
		userspecific.l = setUserSpecific("L", u);
		userspecific.r = setUserSpecific("R", u);
		userspecific.ul = setUserSpecific("UL", u);
		userspecific.dl = setUserSpecific("DL", u);
		userspecific.ur = setUserSpecific("UR", u);
		userspecific.dr = setUserSpecific("DR", u);

		if(userspecific.enable)
		{
			setElementValueById("userspecifican", userspecific.n.axis);
			setElementValueById("userspecificvn", userspecific.n.value);
			setElementValueById("userspecificau", userspecific.u.axis);
			setElementValueById("userspecificvu", userspecific.u.value);
			setElementValueById("userspecificad", userspecific.d.axis);
			setElementValueById("userspecificvd", userspecific.d.value);
			setElementValueById("userspecifical", userspecific.l.axis);
			setElementValueById("userspecificvl", userspecific.l.value);
			setElementValueById("userspecificar", userspecific.r.axis);
			setElementValueById("userspecificvr", userspecific.r.value);
			setElementValueById("userspecificaul", userspecific.ul.axis);
			setElementValueById("userspecificvul", userspecific.ul.value);
			setElementValueById("userspecificadl", userspecific.dl.axis);
			setElementValueById("userspecificvdl", userspecific.dl.value);
			setElementValueById("userspecificaur", userspecific.ur.axis);
			setElementValueById("userspecificvur", userspecific.ur.value);
			setElementValueById("userspecificadr", userspecific.dr.axis);
			setElementValueById("userspecificvdr", userspecific.dr.value);

			document.getElementById("userspecifictoggle").checked = true;
			document.getElementById("userspecifictoggle").onclick();
		}
	}

	var layout = getParameterByName("l");
	if(layout !== "")
	{
//		loadCustomCSS(layout, cssLoaded);
		loadJSON("layout/" + layout + "/layout.sav");
//		loadLayout(new File([""], "layout/" + layout + "/layout.sav"));

		document.getElementById("customlayoutfilename").value = layout;
	}
	getBackgroundValue();
	getStickValue();
	getButtonValue(-1);

/*	for( i = 0; i < 4; ++i)
	{
		var stickarrow = getStickArrowElement(0, i);
		if(stickarrow !== undefined)
		{
			stickarrow.addEventListener("click", stickSetup);
		}
	}
*/
	getStickAreaElement(0).addEventListener("mousedown", mousedown);

	var c = getParameterByName("c");
	if(c !== "")
		customize = parseInt(c);
	else
		customize = 1;

	if(customize >= 1)
	{
		updateLink();
		showElementById("inputarea");

		if(location.protocol === "file:")
			showElementById("obsbrowserlink");

		// init dropdown elements
		var style = document.createElement("style");
		style.id = "dropdownstyle";
		document.head.appendChild(style);
		var x = document.getElementsByClassName("dropdown");
		for(i = 0; i < x.length; ++i)
		{
			style.sheet.insertRule("#" + x[i].id + ".dropdownopen{max-height:" + x[i].scrollHeight + "px;}", 0);
		}
	}

	resetgamepad();
}

//--------------------------------

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

var polltimer = setInterval(connecthandler, 100);

document.onclick = cancelSetup;

document.title += " (v." + currentversion + ")";

window.onload = init;

//--------------------------------