/*




 */
var run = function (enabled) {

  if (!enabled) {
    resetHighlight();
    $('body').off();
    return;
  }
  var url = window.location.href;

  if (url.indexOf('//www.google') != -1) {


    $('body').on("click keyup", function () {
      setTimeout(function () {
        getKeywords();
      }, 800);
    });

    setTimeout(function () {
      getKeywords();
    }, 800);


  }
  else {
    chrome.storage.local.get('keywords', function (result) {
      highlighter(result.keywords);
    });
  }


  function getKeywords() {
    var keywordsInput = $('#cdr_opt input[name=q]');
    var keywords = $.trim(keywordsInput.val());
    if (typeof  keywords != 'undefined' && keywords != '') {
      chrome.storage.local.get('keywords', function (result) {
        if (result.keywords != keywords || $("span[class^=hilite]").length == 0) {
          highlighter(keywords);
          chrome.storage.local.set({'keywords': keywords});
        }
      });

    }
  }

  function highlighter(keywords) {
    keywords = $.trim(keywords);
    var options = {
      exact: "exact"
    };
    if (keywords != "") {
      options.keys = keywords;
    }
    resetHighlight();
    $(document).SearchHighlight(options);
//    console.log(keywords);
  }

  function resetHighlight() {
    $("span[class^=hilite]").each(function () {
      var hilite = $(this);
      var txt_el = hilite[0].previousSibling;
      if (txt_el && txt_el.nodeType == 3)
        txt_el.data += hilite.text();
      else {
        hilite.before(hilite.text());
        txt_el = hilite[0].previousSibling;
      }
      if (hilite[0].nextSibling && hilite[0].nextSibling.nodeType == 3) {
        txt_el.data += hilite[0].nextSibling.data;
        $(hilite[0].nextSibling).remove();
      }
      hilite.remove();
    });


  }
}


$(function () {
  chrome.storage.local.get('enabled', function (result) {
    enabled = typeof result.enabled != 'undefined' ? result.enabled : true;
    run(enabled);
    chrome.storage.onChanged.addListener(function (changes, namespace) {
      enabled = typeof changes.enabled != 'undefined' && typeof changes.enabled.newValue != 'undefined' ? changes.enabled.newValue : true;
      run(enabled);
//      console.log(enabled);
    });
  });


});