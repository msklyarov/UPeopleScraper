var requestText = 'Taganrog';

console.log(document.title);
if (document.title !== 'Upwork Freelancer' &&
  document.title.indexOf(' - ') !== -1) {
  console.log(document.title.split(' - ')[0]);
  dataJson = {
    profileUrl: location.href,
    name: document.title.split(' - ')[0]
  };

  console.log(dataJson);

  $.ajax({
    type: 'post',
    url: 'https://localhost:8080/api/setFullName/' + requestText,
    data: JSON.stringify(dataJson),
    contentType: "application/json; charset=utf-8",
    traditional: true,
    success: function (data) {
      console.log('data were send');
    }
  });
}

// wait 4 sec

var requestText = 'Taganrog';

$.get('https://localhost:8080/api/getNextProfileUrl/' + requestText, function (data) {
  if (!data.value.done) {
    console.log(data.value);
    location.href = data.value;
  }
});


// wait 20 sec






