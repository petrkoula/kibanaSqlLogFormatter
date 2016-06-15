javascript: (function() {
  var getFieldElement = function(fieldName) {
      return $("doc-viewer table td[title='%FIELD%'] + td > div".replace("%FIELD%", fieldName));
  };
  var formatSql = function (query, params) {
      if (!query) return "";
      params = params || []; 
      
      var replaceAll = function (text, patternToReplace, replaceWith) {
          return text.replace(new RegExp(patternToReplace, "g"), replaceWith);
      };
      
      _.forEach(params, function (p) {
          var name = p.Name;
          var value = " " + formatParamValueByType(p.Value) + " /*" + name + "*/";
          
          console.log("replacing " + name + " with " + value);
          query = replaceAll(query, ": " + name, value);
          query = replaceAll(query, ":" + name, value);
      });

      return query;
  };
  var matchDate = function(input) {
    var iso = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/;
    return input.match(iso);
  };
  var formatParamValueByType = function(obj) {
    var number = +obj;
    if (number) return obj;

    if (matchDate(obj)) return "to_timestamp('%DATE', 'YYYY-MM-DD\"T\"HH24:MI:SS.FF7\"Z\"')".replace("%DATE", obj);
    return "'" + obj + "'";
  };
  
  try {
    var sqlElement = getFieldElement('Payload');
    var sqlParametersJson = getFieldElement('SqlParamaters').text();
    var sqlParameters = JSON.parse("[" + sqlParametersJson + "]");
    
    var formattedSql = formatSql(sqlElement.text(), sqlParameters);
    sqlElement.text(formattedSql);
    alert("Sql query formatted with parameters.");
    
  } catch (err) {
    alert("Bookmarklet fatal error. " + err.message);
  }
})();
