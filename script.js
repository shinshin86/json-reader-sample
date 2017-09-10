var output = [];
var ERR_MSG = '<h4 class="err-msg">Please select json file.</h4>';

var recursiveRead = function(k, v) {
  v = v ? v : [];

  if(typeof k != 'object') {
    output.push(
      '<li class="list-group-item">', '<h5 class="display-text">', v.join('.'), '</h5>', '<hr color="#5bc0ee">', k, '</li>'
    );
  } else {
    for(var i in k) {
      arguments.callee(k[i], v.concat(i));
    }
  }
};

$(document).ready(function() {
  document.getElementById('files').addEventListener('change', handleFileSelect, false);

  $('input[id=files]').change(function() {
    $('#files-input').val($(this).val().replace("C:\\fakepath\\", ""));
  });
});


function handleFileSelect(event) {
  var files = event.target.files;

  for (var i = 0, f; f = files[i]; i++) {
    if(f.type !== "application/json") {
      document.getElementById('list').innerHTML = ERR_MSG;
      return false;
    }

    output.push('<div class="content-area">',
                '<div class="bd-callout bd-callout-info">',
                '<h3 class="display-4">', escape(f.name), '(', f.type || 'n/a', ')</h3> ',
                '<p class="display-text">file size : ', f.size, ' bytes</p>',
                '<p class="display-text">last modified : ',
                f.lastModifiedDate.toLocaleDateString(), '</p>',
                '</div>');

    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        jsondata = JSON.parse(e.target.result);

        output.push('<ul class="list-group">');
        recursiveRead(jsondata);
        output.push('</ul>');
        output.push('</div>');

        document.getElementById('list').innerHTML = output.join('');
      }
    })(f);

    reader.readAsText(f);
  }
}
