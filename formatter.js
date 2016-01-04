javascript: (function() {
  var getFieldElement = function(fieldName) {
      return $("doc-viewer table td[title='%FIELD%'] + td > div".replace("%FIELD%", fieldName));
  };
  var formatSql = function(query, params) {
    if (!query || !sqlParametersJson) throw 'Sql or SqlParameters cannot be empty';

    _.forEach(params, function (p) {
        var name = p.Name;
        var nameCommented = " /*" + name + "*/";
        var value = p.Value;
        console.log("replacing " + name + " with " + value);
        query = query.replace(": " + name, " " + formatParamValueByType(value) + nameCommented);
        query = query.replace(":" + name, " " + formatParamValueByType(value) + nameCommented);
    });

    return query;
  };
  var matchDate = function(input) {
    var iso = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/;
    return input.match(iso);
  };
  var formatParamValueByType = function(obj) {
    var number = +obj;
    if (number) return number;

    if (matchDate(obj)) return "to_timestamp('%DATE', 'YYYY-MM-DD\"T\"HH24:MI:SS.FF7\"Z\"')".replace("%DATE", obj);
    return "'" + obj + "'";
  };
  
  try {
    var sqlElement = getFieldElement('Sql');
    var sqlParametersJson = getFieldElement('SqlParamaters').text();
    var sqlParameters = JSON.parse("[" + sqlParametersJson + "]");
    
    var formattedSql = formatSql(sqlElement.text(), sqlParameters)
    
    sqlElement.text(formattedSql);
    alert("Sql query formatted with parameters.");
    
  } catch (err) {
    alert("Bookmarklet fatal error. " + err.message);
  }
})();