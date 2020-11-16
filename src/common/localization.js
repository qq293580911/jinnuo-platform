export let getLocalization = (culture) => {
  let localization = null;
  switch (culture) {
    case 'de':
      localization = {
        // separator of parts of a date (e.g. '/' in 11/05/1955)
        '/': '/',
        // separator of parts of a time (e.g. ':' in 05:44 PM)
        ':': ':',
        // the first day of the week (0 = Sunday, 1 = Monday, etc)
        firstDay: 1,
        days: {
          // full day names
          names: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
          // abbreviated day names
          namesAbbr: ['Sonn', 'Mon', 'Dien', 'Mitt', 'Donn', 'Fre', 'Sams'],
          // shortest day names
          namesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
        },

        months: {
          // full month names (13 months for lunar calendards -- 13th month should be '' if not lunar)
          names: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember', ''],
          // abbreviated month names
          namesAbbr: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dez', '']
        },
        // AM and PM designators in one of these forms:
        // The usual view, and the upper and lower case versions
        //      [standard,lowercase,uppercase]
        // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
        //      null
        AM: ['AM', 'am', 'AM'],
        PM: ['PM', 'pm', 'PM'],
        eras: [
          // eras in reverse chronological order.
          // name: the name of the era in this culture (e.g. A.D., C.E.)
          // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
          // offset: offset in years from gregorian calendar
          {
            'name': 'A.D.',
            'start': null,
            'offset': 0
          }
        ],
        twoDigitYearMax: 2029,
        patterns: {
          d: 'dd.MM.yyyy',
          D: 'dddd, d. MMMM yyyy',
          t: 'HH:mm',
          T: 'HH:mm:ss',
          f: 'dddd, d. MMMM yyyy HH:mm',
          F: 'dddd, d. MMMM yyyy HH:mm:ss',
          M: 'dd MMMM',
          Y: 'MMMM yyyy'

        },
        percentsymbol: '%',
        currencysymbol: '€',
        currencysymbolposition: 'after',
        decimalseparator: '.',
        thousandsseparator: ',',
        pagergotopagestring: 'Gehe zu',
        pagershowrowsstring: 'Zeige Zeile:',
        pagerrangestring: ' von ',
        pagerpreviousbuttonstring: 'nächster',
        pagernextbuttonstring: 'voriger',
        pagerfirstbuttonstring: 'first',
        pagerlastbuttonstring: 'last',
        groupsheaderstring: 'Ziehen Sie eine Kolumne und legen Sie es hier zu Gruppe nach dieser Kolumne',
        sortascendingstring: 'Sortiere aufsteigend',
        sortdescendingstring: 'Sortiere absteigend',
        sortremovestring: 'Entferne Sortierung',
        groupbystring: 'Group By this column',
        groupremovestring: 'Remove from groups',
        filterclearstring: 'Löschen',
        filterstring: 'Filter',
        filtershowrowstring: 'Zeige Zeilen, in denen:',
        filterorconditionstring: 'Oder',
        filterandconditionstring: 'Und',
        filterselectallstring: '(Alle auswählen)',
        filterchoosestring: 'Bitte wählen Sie:',
        filterstringcomparisonoperators: ['leer', 'nicht leer', 'enthält', 'enthält(gu)',
          'nicht enthalten', 'nicht enthalten(gu)', 'beginnt mit', 'beginnt mit(gu)',
          'endet mit', 'endet mit(gu)', 'equal', 'gleich(gu)', 'null', 'nicht null'
        ],
        filternumericcomparisonoperators: ['gleich', 'nicht gleich', 'weniger als', 'kleiner oder gleich', 'größer als', 'größer oder gleich', 'null', 'nicht null'],
        filterdatecomparisonoperators: ['gleich', 'nicht gleich', 'weniger als', 'kleiner oder gleich', 'größer als', 'größer oder gleich', 'null', 'nicht null'],
        filterbooleancomparisonoperators: ['gleich', 'nicht gleich'],
        validationstring: 'Der eingegebene Wert ist ungültig',
        emptydatastring: 'Nokeine Daten angezeigt',
        filterselectstring: 'Wählen Sie Filter',
        loadtext: 'Loading...',
        clearstring: 'Löschen',
        todaystring: 'Heute'
      }
      break;
    case 'zh-CN':
      localization = {
        // separator of parts of a date (e.g. '/' in 11/05/1955)
        '/': '/',
        // separator of parts of a time (e.g. ':' in 05:44 PM)
        ':': ':',
        // the first day of the week (0 = Sunday, 1 = Monday, etc)
        firstDay: 0,
        days: {
          // full day names
          names: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
          // abbreviated day names
          namesAbbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          // shortest day names
          namesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        },
        months: {
          // full month names (13 months for lunar calendards -- 13th month should be '' if not lunar)
          names: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月', ''],
          // abbreviated month names
          namesAbbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', '']
        },
        // AM and PM designators in one of these forms:
        // The usual view, and the upper and lower case versions
        //      [standard,lowercase,uppercase]
        // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
        //      null
        AM: ['AM', 'am', 'AM'],
        PM: ['PM', 'pm', 'PM'],
        eras: [
          // eras in reverse chronological order.
          // name: the name of the era in this culture (e.g. A.D., C.E.)
          // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
          // offset: offset in years from gregorian calendar
          {
            'name': 'A.D.',
            'start': null,
            'offset': 0
          }
        ],
        twoDigitYearMax: 2029,
        patterns: {
          // short date pattern
          d: 'M/d/yyyy',
          // long date pattern
          D: 'dddd, MMMM dd, yyyy',
          // short time pattern
          t: 'h:mm tt',
          // long time pattern
          T: 'h:mm:ss tt',
          // long date, short time pattern
          f: 'dddd, MMMM dd, yyyy h:mm tt',
          // long date, long time pattern
          F: 'dddd, MMMM dd, yyyy h:mm:ss tt',
          // month/day pattern
          M: 'MMMM dd',
          // month/year pattern
          Y: 'yyyy MMMM',
          // S is a sortable format that does not vary by culture
          S: 'yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss',
          // formatting of dates in MySQL DataBases
          ISO: 'yyyy-MM-dd hh:mm:ss',
          ISO2: 'yyyy-MM-dd HH:mm:ss',
          d1: 'dd.MM.yyyy',
          d2: 'dd-MM-yyyy',
          d3: 'dd-MMMM-yyyy',
          d4: 'dd-MM-yy',
          d5: 'H:mm',
          d6: 'HH:mm',
          d7: 'HH:mm tt',
          d8: 'dd/MMMM/yyyy',
          d9: 'MMMM-dd',
          d10: 'MM-dd',
          d11: 'MM-dd-yyyy'
        },
        percentsymbol: "%",
        currencysymbol: "$",
        currencysymbolposition: "之前",
        decimalseparator: ".",
        thousandsseparator: ",",
        pagergotopagestring: "转到页面:",
        pagershowrowsstring: "显示行:",
        pagerrangestring: " 属于 ",
        pagerpreviousbuttonstring: "上一页", //
        pagernextbuttonstring: "下一页",
        pagerfirstbuttonstring: "首页",
        pagerlastbuttonstring: "末页",
        groupsheaderstring: "将一列拖放到此处并以该列分组",
        sortascendingstring: "升序",
        sortdescendingstring: "降序",
        sortremovestring: "默认排序",
        groupbystring: "删除排序",
        groupremovestring: "以该列分组",
        filterclearstring: "清空",
        filterstring: "筛选",
        filtershowrowstring: "显示行:", //
        filtershowrowdatestring: "显示行哪里:",
        filterorconditionstring: "或者",
        filterandconditionstring: "并且",
        filterselectallstring: "(选择全部)",
        filterchoosestring: "请选择:",
        filterstringcomparisonoperators: [
          "空字符",
          "非空字符",
          "包含",
          "包含(区分大小写)",
          "不包含",
          "不包含(区分大小写)",
          "开始于",
          "开始于(区分大小写)",
          "结束于",
          "结束于(区分大小写)",
          "等于",
          "等于(区分大小写)",
          "空",
          "非空"
        ],
        filternumericcomparisonoperators: [
          "等于",
          "不等于",
          "小于",
          "小于或等于",
          "大于",
          "大于或等于",
          "空",
          "非空"
        ],
        filterdatecomparisonoperators: [
          "等于",
          "不等于",
          "小于",
          "小于或等于",
          "大于",
          "大于或等于",
          "空",
          "非空"
        ],
        filterbooleancomparisonoperators: ["等于", "不等于"],
        validationstring: "输入的值无效", //输入的值无效
        emptydatastring: "没有数据显示", //没有数据显示
        filterselectstring: "选择筛选", //选择筛选
        loadtext: "正在加载...", //正在加载
        clearstring: "清理",
        todaystring: "今天",
      };
      break;
    case 'en':
    default:
      localization = {
        // separator of parts of a date (e.g. '/' in 11/05/1955)
        '/': '/',
        // separator of parts of a time (e.g. ':' in 05:44 PM)
        ':': ':',
        // the first day of the week (0 = Sunday, 1 = Monday, etc)
        firstDay: 0,
        days: {
          // full day names
          names: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          // abbreviated day names
          namesAbbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          // shortest day names
          namesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        },
        months: {
          // full month names (13 months for lunar calendards -- 13th month should be '' if not lunar)
          names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', ''],
          // abbreviated month names
          namesAbbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', '']
        },
        // AM and PM designators in one of these forms:
        // The usual view, and the upper and lower case versions
        //      [standard,lowercase,uppercase]
        // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
        //      null
        AM: ['AM', 'am', 'AM'],
        PM: ['PM', 'pm', 'PM'],
        eras: [
          // eras in reverse chronological order.
          // name: the name of the era in this culture (e.g. A.D., C.E.)
          // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
          // offset: offset in years from gregorian calendar
          {
            'name': 'A.D.',
            'start': null,
            'offset': 0
          }
        ],
        twoDigitYearMax: 2029,
        patterns: {
          // short date pattern
          d: 'M/d/yyyy',
          // long date pattern
          D: 'dddd, MMMM dd, yyyy',
          // short time pattern
          t: 'h:mm tt',
          // long time pattern
          T: 'h:mm:ss tt',
          // long date, short time pattern
          f: 'dddd, MMMM dd, yyyy h:mm tt',
          // long date, long time pattern
          F: 'dddd, MMMM dd, yyyy h:mm:ss tt',
          // month/day pattern
          M: 'MMMM dd',
          // month/year pattern
          Y: 'yyyy MMMM',
          // S is a sortable format that does not vary by culture
          S: 'yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss',
          // formatting of dates in MySQL DataBases
          ISO: 'yyyy-MM-dd hh:mm:ss',
          ISO2: 'yyyy-MM-dd HH:mm:ss',
          d1: 'dd.MM.yyyy',
          d2: 'dd-MM-yyyy',
          d3: 'dd-MMMM-yyyy',
          d4: 'dd-MM-yy',
          d5: 'H:mm',
          d6: 'HH:mm',
          d7: 'HH:mm tt',
          d8: 'dd/MMMM/yyyy',
          d9: 'MMMM-dd',
          d10: 'MM-dd',
          d11: 'MM-dd-yyyy'
        },
        percentsymbol: '%',
        currencysymbol: '$',
        currencysymbolposition: 'before',
        decimalseparator: '.',
        thousandsseparator: ',',
        pagergotopagestring: 'Go to page:',
        pagershowrowsstring: 'Show rows:',
        pagerrangestring: ' of ',
        pagerpreviousbuttonstring: 'previous',
        pagernextbuttonstring: 'next',
        pagerfirstbuttonstring: 'first',
        pagerlastbuttonstring: 'last',
        groupsheaderstring: 'Drag a column and drop it here to group by that column',
        sortascendingstring: 'Sort Ascending',
        sortdescendingstring: 'Sort Descending',
        sortremovestring: 'Remove Sort',
        groupbystring: 'Group By this column',
        groupremovestring: 'Remove from groups',
        filterclearstring: 'Clear',
        filterstring: 'Filter',
        filtershowrowstring: 'Show rows where:',
        filterorconditionstring: 'Or',
        filterandconditionstring: 'And',
        filterselectallstring: '(Select All)',
        filterchoosestring: 'Please Choose:',
        filterstringcomparisonoperators: ['empty', 'not empty', 'enthalten', 'enthalten(match case)',
          'does not contain', 'does not contain(match case)', 'starts with', 'starts with(match case)',
          'ends with', 'ends with(match case)', 'equal', 'equal(match case)', 'null', 'not null'
        ],
        filternumericcomparisonoperators: ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal', 'null', 'not null'],
        filterdatecomparisonoperators: ['equal', 'not equal', 'less than', 'less than or equal', 'greater than', 'greater than or equal', 'null', 'not null'],
        filterbooleancomparisonoperators: ['equal', 'not equal'],
        validationstring: 'Entered value is not valid',
        emptydatastring: 'No data to display',
        filterselectstring: 'Select Filter',
        loadtext: 'Loading...',
        clearstring: 'Clear',
        todaystring: 'Today'
      }
      break;
  }
  return localization;
}
