function setAggressionInput(aggression) {
    document.getElementById("inputAggression").value = aggression;
}
var currentPhase = "input";

var aggression = "1.4";
var url = "http://...";

var summary = true;

var current_data = null;

function setPhase(phase) {
    hideLoadingPhase();
    hideReadPhase();
    hideError();
    hideInputPhase();

    if (phase == "loading") {
        showLoadingPhase();
    }
    if (phase == "input") {
        showInputPhase();
    }
    if (phase == "read") {
        showReadPhase();
    }

    currentPhase = phase;
}

function showLoadingPhase() {
    $("#loading").fadeIn(100);
}
function hideLoadingPhase() {
    $("#loading").hide();
}

function showInputPhase() {
    $("#input").fadeIn(100);
}
function hideInputPhase() {
    $("#input").hide();
}

function showReadPhase() {
    $("#read").fadeIn(100);
}
function hideReadPhase() {
    $("#read").hide();
}

function showError(error) {
    hideLoadingPhase();
    hideInputPhase();
    hideReadPhase();

    document.getElementById("errorText").textContent = error;
    $("#error").fadeIn(200);
    currentPhase = "error";
}

function hideError() {
    $("#error").hide();
}

function loadHotswap() {
    aggression = document.getElementById("inputAggressionQuick").value;
    setPhase("loading");
    loadData();
}

function submitInputForm() {
    try {
        url = document.getElementById("inputUrl").value;
        aggression = document.getElementById("inputAggression").value;


        setPhase("loading");
        loadData();

    }catch (errorThrown){
        showError(errorThrown.textContent);
    }
}

function renderRead() {
    if (current_data == null) {
        showError("No valid data!");
    } else {
        if(current_data.Error == "none") {
            $("#articleTitle").text(current_data.Title);
            $("#articleDeflated").text(Math.round(current_data.Deflated) + "%");
            document.getElementById("articleImage").src = current_data.Image;
            document.getElementById("articleSource").setAttribute("href", url);
            document.getElementById("inputAggressionQuick").setAttribute("placeholder", "New Aggression (now " + aggression + ")");
            var blocks = current_data.Content.split("\n");
            var html = "";
            for (var i = 0; i < blocks.length; i++) {
                html += "<p>" + blocks[i] + "</p>";
            }
            $("#articleText").html(html);
            summary = true;
        }else{
            showError(current_data.Error);
        }
    }
}

function loadData() {
    $.ajax({
        type: "POST",
        url: "http://labs.md-c.com:2001/?api=summarize&url=" + encodeURIComponent(url) + "&aggression=" + aggression,
        success: function (response) {
            console.log(response);
            //var json_obj = $.parseJSON(response);//parse JSON
            var error = response.Error;
            if (error != "none") {
                showError(error);
            }
            current_data = response;
            renderRead();
            setPhase("read");
        },
        error: function(){
            showError("Unable to contact summary servers");
        },
        dataType: "json"//set to JSON
    })
}

function toggleFullArticle() {
    var blocks;
    if (summary) {
        blocks = current_data.Original.split("\n");
        $("#fullToggle").text("Show Summary");
        summary = false;
    } else {
        blocks = current_data.Content.split("\n");
        $("#fullToggle").text("Show Full Article");
        summary = true;
    }
    var html = "";
    for (var i = 0; i < blocks.length; i++) {
        html += "<p>" + blocks[i] + "</p>";
    }
    $("#articleText").hide();
    $("#articleText").html(html);
    $("#articleText").fadeIn(100);
}
