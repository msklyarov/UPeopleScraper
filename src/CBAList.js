var dataJson = {
  page: parseInt($('.pagination-page.active').text().trim()),
  records: []
};


$('article.row').each(function() {
  var data = $(this).children('.col-md-9');
  var nameAndUrl = data.children('.m-0-top-bottom.display-inline-block').children('a');
  var rateAndEarned = data.children('.row.m-sm-top.m-0-bottom').children('.col-md-3').children('div');

  if (nameAndUrl.text().trim() !== '') {
    var jsonRow = {
      name: nameAndUrl.text().trim(),
      title: data.children('.m-0-top-bottom').children('div').children('.ellipsis').text().trim(),
      profileUrl: nameAndUrl.prop('href'),
      photoUrl: $(this).children('.col-md-1').children('.row').children('.col-md-10').children('div').children('div').children('a').prop('href'),
      rate: rateAndEarned.children('strong').text(),
      totalEarned: rateAndEarned.children('span').children('strong').text()
    };

    dataJson.records.push(jsonRow);

    console.log(nameAndUrl.text().trim(), ';', nameAndUrl.prop('href'), ';',
      $(this).children('.col-md-1').children('.row').children('.col-md-10').children('div').children('div').children('a').prop('href'), ';',
      data.children('.m-0-top-bottom').children('div').children('.ellipsis').text().trim(), ';',
      rateAndEarned.children('strong').text(), ';',
      rateAndEarned.children('span').children('strong').text());
  }
});

var requestText = $('.form-control.p-xlg-right.ng-pristine.ng-valid.ng-not-empty').val().trim();

$.ajax({
  type: 'post',
  url: 'https://localhost:8080/api/' + requestText,
  data: JSON.stringify(dataJson),
  contentType: "application/json; charset=utf-8",
  traditional: true,
  success: function (data) {
    console.log('data were send');
  }
});


//wait 4 sec
if ($('.pagination-next.disabled').length === 0) {
  $('.pagination-next > a')[0].click()
}

//wait 25 sec

