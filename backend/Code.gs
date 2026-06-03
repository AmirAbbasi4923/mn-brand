function doPost(e) {

  var sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("Sheet1");

  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.orderId,
    data.name,
    data.phone,
    data.address,
    data.city,
    data.products,
    data.quantity,
    data.totalPrice,
    new Date()
  ]);

  return ContentService
    .createTextOutput(
      JSON.stringify({
        status: "success"
      })
    )
    .setMimeType(ContentService.MimeType.JSON);
}
